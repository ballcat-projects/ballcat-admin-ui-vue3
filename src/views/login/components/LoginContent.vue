<template>
  <div :class="getCls('container')">
    <div :class="getCls('top')">
      <div :class="getCls('header')">
        <!-- logoAndTitle -->
        <span :class="getCls('logo')">
          <img alt="logo" src="@/assets/logo.png" />
        </span>
        <!-- 标题 -->
        <span :class="getCls('title')"> {{ projectTitle }} </span>
      </div>
      <!-- 描述 -->
      <div :class="getCls('desc')">{{ projectDesc }}</div>
    </div>

    <div :class="getCls('main')" style="width: 368px">
      <a-tabs v-model:active-key="currentLoginType" class="login-tabs">
        <a-tab-pane key="account" tab="账号密码登录"></a-tab-pane>
        <a-tab-pane key="mobile" tab="手机号登录"></a-tab-pane>
      </a-tabs>

      <!-- 错误提示信息 -->
      <a-alert
        v-if="isLoginError"
        style="margin-bottom: 24px"
        :message="loginErrorMessage"
        type="error"
        show-icon
      />

      <!-- 账户密码登录 -->
      <account-login-form
        v-show="currentLoginType === 'account'"
        ref="accountLoginFormRef"
        @try-submit="handleLogin"
      />

      <!-- 手机号登录 -->
      <mobile-login-form v-show="currentLoginType === 'mobile'" ref="mobileLoginFormRef" />

      <div style="margin-bottom: 24px">
        <a-checkbox v-model:checked="rememberMe" no-style name="autoLogin"> 自动登录</a-checkbox>
        <a style="float: right">忘记密码</a>
      </div>

      <a-button
        size="large"
        type="primary"
        style="width: 100%"
        :loading="loginLoading"
        @click="handleLogin"
      >
        {{ rawI18nText('user.login.submit', '登录') }}
      </a-button>

      <!-- 扩展部分 -->
      <div :class="getCls('other')">
        <a-space :size="8">
          <span>其他登录方式</span>
          <alipay-outlined class="icon" />
          <taobao-outlined class="icon" />
          <weibo-outlined class="icon" />
        </a-space>
        <a style="float: right"> 注册账户 </a>
      </div>
    </div>

    <!-- 登陆验证码 -->
    <login-captcha v-if="enableLoginCaptcha" ref="loginCaptchaRef" @success="handleSubmit" />
  </div>
</template>

<script setup lang="ts">
import AccountLoginForm from '@/views/login/components/AccountLoginForm.vue'
import MobileLoginForm from '@/views/login/components/MobileLoginForm.vue'
import type { LoginFormInstance, LoginType } from '@/views/login/components/types'
import type { LoginResult } from '@/api/auth/types'
import { useUserStore } from '@/stores/user-store'
import { projectTitle, projectDesc, enableLoginCaptcha } from '@/config'
import { SliderCaptcha as LoginCaptcha } from '@/components/Captcha'
import { useAdminI18n } from '@/hooks/i18n'

const { rawI18nText } = useAdminI18n()

const prefixCls = 'ant'
const baseClassName = 'pro-login-content'

function getCls(className: string) {
  return `${prefixCls}-${baseClassName}-${className}`
}

// 登录的加载状态
const loginLoading = ref(false)
// 登陆错误
const isLoginError = ref(false)
// 登录错误信息
const loginErrorMessage = ref('')
// 自动登录（记住我）
const rememberMe = ref(false)

// 登陆验证码组件
const loginCaptchaRef = ref()

// 当前登录类型，以及对应的登录组件
const currentLoginType = ref<LoginType>('account')
let loginFormRef = ref<LoginFormInstance>()
const accountLoginFormRef = ref<LoginFormInstance>()
const mobileLoginFormRef = ref<LoginFormInstance>()

watchEffect(() => {
  switch (currentLoginType.value) {
    case 'account':
      loginFormRef = accountLoginFormRef
      break
    case 'mobile':
      loginFormRef = mobileLoginFormRef
      break
  }
})

/** 存储登录信息 */
function store(res: LoginResult) {
  const userStore = useUserStore()
  // 存储 token
  userStore.accessToken = res.access_token

  // 存储用户信息
  const info = res.info
  const roleCodes = res.attributes?.roleCodes || []
  const permissions = res.attributes?.permissions || []
  userStore.userInfo = {
    ...info,
    roleCodes,
    permissions
  }

  // TODO 自动登录处理
  // const ttl = res.expires_in * 1000
  // const refreshToken = res.refresh_token
}

function handleLogin() {
  const loginFormInstance = loginFormRef.value!
  loginFormInstance.validate().then(() => {
    enableLoginCaptcha ? loginCaptchaRef.value?.show() : handleSubmit()
  })
}

const router = useRouter()

function handleSubmit(captchaId?: string) {
  const loginFormInstance = loginFormRef.value!
  loginLoading.value = true
  return loginFormInstance
    .doLogin(captchaId)
    .then(res => {
      isLoginError.value = false
      store(res)
      const nextPath = (router.currentRoute.value.query.redirect as string) || '/'
      router.push(nextPath)
    })
    .catch(err => {
      isLoginError.value = true
      loginErrorMessage.value =
        ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试'
    })
    .finally(() => {
      loginLoading.value = false
    })
}
</script>

<style lang="less">
@import 'loginContent.less';

.login-tabs .ant-tabs-tab {
  padding: 12px 16px !important;
}
</style>
