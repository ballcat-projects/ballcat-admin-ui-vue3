<template>
  <div />
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user-store'
import { loginPath } from '@/config'

// 如果需要被多页签缓存，必须要设置组件名称
defineOptions({ name: 'Oauth2Authorize' })

// 校验 token 是否有效，有效则直接 redirect, 如果无效则跳转到 login 页面，return_to 的参数也带过去
// 登录页登录完成后，如果有 return_to 参数，则进行 redirect

// 获取当前地址栏携带的 return_to 参数
const route = useRoute()
const returnTo = route.query.return_to

// 获取当前 token
const userStore = useUserStore()
const accessToken = userStore.accessToken

if (accessToken) {
  if (returnTo) {
    // 有 return_to 则且已登录则直接重定向到授权地址
    // return_to 参数必然会有后缀
    window.location.href = returnTo + '&access_token=' + accessToken
  } else {
    useRouter().push('/')
  }
} else {
  useRouter().push({
    path: loginPath,
    query: returnTo ? { return_to: returnTo } : {}
  })
}

// authorize(params)
</script>
