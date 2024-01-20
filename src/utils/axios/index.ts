import { Modal, notification, message } from 'ant-design-vue'
import 'ant-design-vue/es/button/style/index.less'

import type { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResult } from '@/api/types'

import { useUserStore } from '@/stores/user-store'
import { loginPath } from '@/config'
import router from '@/router'
import { HttpClient } from '@/utils/axios/http-client'
import { useI18nStore } from '@/stores/i18n-store'
import { useAdminI18n } from '@/hooks/i18n'

const { rawI18nText } = useAdminI18n()

const onRequestFulfilled = (requestConfig: InternalAxiosRequestConfig) => {
  const headers = requestConfig.headers || {}

  // token
  const { accessToken } = useUserStore()
  // Authorization 请求头不存在再进行追加
  if (accessToken && !headers['Authorization']) {
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    headers['Authorization'] = 'Bearer ' + accessToken
  }

  // i18n
  const appLanguage = useI18nStore().language
  if (appLanguage && !headers['Accept-Language']) {
    headers['Accept-Language'] = appLanguage
  }

  if (requestConfig.headers) {
    requestConfig.headers = headers
  }
  return requestConfig
}

// 响应成功处理函数
const onResponseFulfilled = (response: AxiosResponse) => {
  const headers = response.headers
  if (
    headers != null &&
    headers['content-type'] &&
    headers['content-type'].startsWith('application/json')
  ) {
    return response.data
  } else {
    return response
  }
}

// 响应失败处理函数
const onResponseRejected = (error: AxiosError) => {
  if (error.response) {
    const data = error.response.data as unknown as ApiResult
    const errorStatus = error.response.status
    const errorStatusText = error.response.statusText
    switch (errorStatus) {
      case 400:
        if (router.currentRoute.value.path !== loginPath) {
          error.resolved = true
          message.error(data?.message || error.message)
        }
        break
      case 401:
        error.resolved = true
        useUserStore().clean()
        if (router.currentRoute.value.path !== loginPath) {
          // 防止重复弹出 TODO 这里拦截所有其他的 axios 的请求
          Modal.destroyAll()
          Modal.info({
            title: rawI18nText('system.tip.title', '系统提示'),
            content: rawI18nText('user.login.expired', '登录状态已过期!'),
            okText: rawI18nText('user.login.submit.retry', '重新登陆'),
            onOk: () => {
              router.push({
                path: loginPath,
                query: { redirect: router.currentRoute.value.fullPath }
              })
            }
          })
        }
        break
      case 403:
        error.resolved = true
        notification.error({
          message: rawI18nText('user.pemission.reject', '没有权限访问!'),
          description: data.message
        })
        break
      default:
        error.resolved = true
        notification.error({
          message: rawI18nText('system.tip.request.error', '网络请求异常!'),
          description:
            data?.message ||
            errorStatusText ||
            error.message ||
            rawI18nText('system.tip.request.error.message', '错误状态码：' + errorStatus)
        })
        break
    }
  } else {
    error.resolved = true
    notification.error({
      message: rawI18nText('system.tip.network.error', '网络异常, 无法访问到服务器!'),
      description:
        error.message || rawI18nText('system.tip.network.error.message', '请检测您的网络是否通畅!')
    })
  }
  return Promise.reject(error)
}

const httpClient = new HttpClient({
  defaultRequestConfig: {
    baseURL: import.meta.env.VITE_API_URL, // api base_url
    timeout: import.meta.env.VITE_API_TIME_OUT // 请求超时时间
  },
  interceptorOptions: {
    onRequestFulfilled: onRequestFulfilled,
    onResponseFulfilled: onResponseFulfilled,
    onResponseRejected: onResponseRejected
  }
})

export default httpClient
