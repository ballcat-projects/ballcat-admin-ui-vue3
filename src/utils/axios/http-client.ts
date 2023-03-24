import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import type { HttpClientConfig } from '@/utils/axios/types'
import qs from 'qs'
import JSONBig from 'json-bigint'

// 使用字符串处理 bigint 类型
const jsonBigInt = JSONBig({ storeAsString: true })

// HttpClient 默认的请求配置
const DefaultRequestConfig: AxiosRequestConfig = {
  paramsSerializer: {
    serialize: params => {
      return qs.stringify(params, {
        // 数组的格式化方式为重复参数，例如 { a: ['1', '2']} => a=1&a=2
        arrayFormat: 'repeat',
        filter: (prefix: string, value: any) => {
          // 空字符串不进行提交
          if (typeof value == 'string' && value.length === 0) {
            return
          }
          return value
        }
      })
    }
  },

  transformResponse: [
    function transform(data: any) {
      // Replacing the default transformResponse in axios because this uses JSON.parse and causes problems
      // with precision of big numbers.
      // https://github.com/axios/axios/blob/6642ca9aa1efae47b1a9d3ce3adc98416318661c/lib/defaults.js#L57
      if (typeof data === 'string') {
        try {
          data = jsonBigInt.parse(data)
        } catch (e) {
          /* Ignore */
        }
      }
      return data
    }
  ]
}

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

  request<T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T> {
    const mergeConfig = Object.assign({}, DefaultRequestConfig, config)
    return this.axiosInstance.request<void, T, D>(mergeConfig)
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
