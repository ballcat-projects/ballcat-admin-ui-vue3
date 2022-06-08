import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { HttpClientConfig } from '@/utils/axios/types'

export class HttpClient {
  private axiosInstance: AxiosInstance

  constructor(config: HttpClientConfig) {
    // 创建 axios 实例
    this.axiosInstance = axios.create(config.defaultRequestConfig)

    // 拦截器配置
    const interceptorOptions = config.interceptorOptions
    if (interceptorOptions) {
      this.axiosInstance.interceptors.request.use(
        interceptorOptions.onRequestFulfilled,
        interceptorOptions.onRequestRejected,
        interceptorOptions.requestOptions
      )
      this.axiosInstance.interceptors.response.use(
        interceptorOptions.onResponseFulfilled,
        interceptorOptions.onResponseRejected,
        interceptorOptions.responseOptions
      )
    }
  }

  getUri(config?: AxiosRequestConfig) {
    return this.axiosInstance.getUri(config)
  }

  request<T = any, D = any>(config: AxiosRequestConfig<D>) {
    // const mergeConfig = Object.assign({}, defaultConfig, config)
    return this.axiosInstance.request<void, T, D>(config)
  }

  get<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, url, method: 'GET' })
  }

  delete<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, url, method: 'DELETE' })
  }

  head<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, url, method: 'HEAD' })
  }

  options<T = any, D = any>(url: string, config?: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, url, method: 'OPTIONS' })
  }

  post<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, url, data, method: 'POST' })
  }

  put<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, url, data, method: 'PUT' })
  }

  patch<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return this.request<T, D>({ ...config, url, data, method: 'PATCH' })
  }

  postForm<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return this.request<T, D>({
      ...config,
      url,
      data,
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }

  putForm<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return this.request<T, D>({
      ...config,
      url,
      data,
      method: 'PUT',
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }

  patchForm<T = any, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>) {
    return this.request<T, D>({
      ...config,
      url,
      data,
      method: 'PATCH',
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}
