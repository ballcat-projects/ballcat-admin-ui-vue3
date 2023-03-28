import type {
  AxiosInterceptorOptions,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import type { ApiResult } from '@/api/types'
import type { WithFalse } from '#/layout/types'

export type AlertMode = 'message' | 'modal' | 'notification'

export interface MessageInfo {
  message: string
  mode: AlertMode
}

/**
 * request 请求选项
 */
export interface RequestOptions<T = unknown> {
  // 判断是否请求成功
  checkSuccess?: (res: ApiResult<T>) => boolean
  // 响应转换
  transformResponse?: WithFalse<(response: any) => T>
  // 成功消息提示
  successMessage?: boolean | string | MessageInfo
  // 失败消息提示
  failMessage?: boolean | string | MessageInfo
  // 错误消息提示
  errorMessage?: boolean | string | MessageInfo
  // 成功时的处理逻辑
  onSuccess?: (res: ApiResult<T>) => void
  // 失败时的处理逻辑
  onFail?: (res: ApiResult<T>) => void
  // 错误时的处理逻辑
  onError?: (e: any) => void
  // 最终的处理逻辑
  onFinally?: () => void
}

/**
 * 请求拦截器钩子
 */
export interface HttpInterceptorOptions {
  /**
   * 发起请求用前处理
   * @param value AxiosRequestConfig 请求配置
   */
  onRequestFulfilled?: (
    value: InternalAxiosRequestConfig
  ) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>

  /**
   * 请求失败后处理
   * @param error 错误
   */
  onRequestRejected?: (error: any) => any

  /**
   * 请求的一些设置
   */
  requestOptions?: AxiosInterceptorOptions

  /**
   * 响应成功，返回数据前处理
   * @param value AxiosRequestConfig 请求配置
   */
  onResponseFulfilled?: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>

  /**
   * 响应失败时处理
   * @param error 错误信息
   */
  onResponseRejected?: (error: any) => any

  /**
   * 响应的一些设置
   */
  responseOptions?: AxiosInterceptorOptions
}

/**
 * 请求配置
 */
export interface HttpClientConfig<D = unknown> {
  /**
   * 默认请求配置
   */
  defaultRequestConfig?: AxiosRequestConfig<D>
  /**
   * 请求响应拦截器选项
   */
  interceptorOptions?: HttpInterceptorOptions
}

export type BallcatAxiosRequestConfig<D> = {
  setLoading?: (flag: boolean) => void
} & AxiosRequestConfig<D>
