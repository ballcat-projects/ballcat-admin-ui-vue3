import { Modal, notification, message } from 'ant-design-vue'
import 'ant-design-vue/es/button/style/index.less'

import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResult } from '@/api/types'

import { useUserStore } from '@/stores/user-store'
import { LOGIN_PATH } from '@/constants'
import router from '@/router'
import { HttpClient } from '@/utils/axios/http-client'

const onRequestFulfilled = (requestConfig: AxiosRequestConfig) => {
  const headers = requestConfig.headers || {}

  // token
  const { accessToken } = useUserStore()
  // Authorization 请求头不存在再进行追加
  if (accessToken && !headers['Authorization']) {
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    headers['Authorization'] = 'Bearer ' + accessToken
  }

  // i18n
  // if (enableI18n) {
  //   const appLanguage = store.getters.lang
  //   if (appLanguage) {
  //     headers['Accept-Language'] = appLanguage
  //   }
  // }

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
    switch (errorStatus) {
      case 400:
        if (router.currentRoute.value.path !== LOGIN_PATH) {
          error.resolved = true
          message.error(data.message || error.message)
        }
        break
      case 401:
        error.resolved = true
        useUserStore().clean()
        if (router.currentRoute.value.path !== LOGIN_PATH) {
          // 防止重复弹出 TODO 这里拦截所有其他的 axios 的请求
          Modal.destroyAll()
          Modal.info({
            title: '系统提示',
            content: '登录状态已过期, 请退出重新登录!',
            okText: '重新登录',
            onOk: () => {
              router.push({
                path: LOGIN_PATH,
                query: { redirect: router.currentRoute.value.fullPath }
              })
            }
          })
        }
        break
      case 403:
        error.resolved = true
        notification.error({
          message: '没有权限访问！',
          description: data.message
        })
        break
    }
  }
  return Promise.reject(error)
}

// // 创建默认实例
// const axiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // api base_url
//   timeout: import.meta.env.VITE_API_TIME_OUT // 请求超时时间
// })
//
// // 添加拦截器
// axiosInstance.interceptors.request.use(onRequestFulfilled)
// axiosInstance.interceptors.response.use(onResponseFulfilled, onResponseRejected)
//
// export default axiosInstance

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
