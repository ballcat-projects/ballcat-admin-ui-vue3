<template>
  <a-form :model="modelRef">
    <a-form-item v-bind="validateInfos.username">
      <a-input
        v-model:value="modelRef.username"
        size="large"
        placeholder="账号: admin"
        @press-enter="trySubmit"
      >
        <template #prefix>
          <user-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item v-bind="validateInfos.password">
      <a-input-password
        v-model:value="modelRef.password"
        size="large"
        placeholder="密码: a123456"
        autocomplete="on"
        @press-enter="trySubmit"
      >
        <template #prefix>
          <lock-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
        </template>
      </a-input-password>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { accountLogin } from '@/api/auth'
import { Form } from 'ant-design-vue'

import type { AccountLoginParam } from '@/api/auth/types'
import type { LoginFormInstance } from './types'
import { passEncrypt } from '@/utils/password-utils'

// 登录表单参数
const useForm = Form.useForm

const modelRef = reactive<AccountLoginParam>({
  username: '',
  password: ''
})
const rulesRef = reactive({
  username: [{ required: true, message: '请输入账号!' }],
  password: [{ required: true, message: '请输入密码!' }]
})
const { validate, validateInfos } = useForm(modelRef, rulesRef)

// 定义事件
const emits = defineEmits<{
  (e: 'trySubmit'): void
}>()

// 尝试提交表单
function trySubmit() {
  emits('trySubmit')
}

defineExpose<LoginFormInstance>({
  validate,
  doLogin(captchaId) {
    return accountLogin({
      username: modelRef.username,
      password: passEncrypt(modelRef.password), // 密码加密
      captchaId // 验证码id
    })
  }
})
</script>
