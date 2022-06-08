import { message } from 'ant-design-vue'
import type { RequestOptions } from '@/utils/axios/types'
import type { AxiosError, AxiosResponse } from 'axios'
import type { ApiResult } from '@/api/types'

/**
 * 请求方法封装
 * TODO 消息提示类型可选：使用 message、modal、或则 notification
 * @param request 一个 Promise 对象
 * @param requestOptions 请求配置
 */
export function useRequest<T = unknown>( // 请求 Promise
  request: Promise<AxiosResponse<ApiResult<T>>>,
  requestOptions?: RequestOptions<T>
) {
  // 填充默认值
  const finalOptions: RequestOptions<T> = Object.assign(
    {
      checkRequestSuccess: (res: ApiResult) => res.code === 200,
      // 成功消息提示
      successMessage: false,
      // 失败消息提示
      failMessage: true,
      // 错误消息提示
      errorMessage: true
    },
    requestOptions
  )
  request
    .then(response => {
      // 这里由于上面的拦截器处理过了，所以直接强转
      const res = response as never as ApiResult<T>
      if (finalOptions.checkRequestSuccess && finalOptions.checkRequestSuccess(res)) {
        handleSuccess(finalOptions, res)
      } else {
        handleFail(finalOptions, res)
      }
    })
    .catch(e => {
      handleError(finalOptions, e)
    })
    .finally(() => {
      finalOptions.onFinally && finalOptions.onFinally()
    })
}

function handleSuccess<T>(requestOptions: RequestOptions<T>, res: ApiResult<T>) {
  const successMessage = requestOptions.successMessage
  if (successMessage) {
    // 如果 successMessage 是字符串类型，则使用 successMessage 做为提示语
    if (typeof successMessage == 'string') {
      message.success(successMessage)
    } else {
      message.success(res.message)
    }
  }
  requestOptions.onSuccess && requestOptions.onSuccess(res)
}

function handleFail<T>(requestOptions: RequestOptions<T>, res: ApiResult<T>) {
  const failMessage = requestOptions.failMessage
  if (failMessage) {
    // 如果 failMessage 是字符串类型，则使用 failMessage 做为提示语
    if (typeof failMessage == 'string') {
      message.error(failMessage)
    } else {
      message.error(res.message)
    }
  }
  requestOptions.onFail && requestOptions.onFail(res)
}

function handleError<T>(requestOptions: RequestOptions<T>, e: AxiosError<ApiResult<T>>) {
  // 未被 axios拦截器处理过，则在这里继续处理
  if (requestOptions.errorMessage && !e.resolved) {
    const errorMessage = e.response?.data?.message || e.message || 'error request'
    message.error(errorMessage)
  }
  requestOptions.onError && requestOptions.onError(e)
}
