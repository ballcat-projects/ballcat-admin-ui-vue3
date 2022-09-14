import type { CaptchaConfig } from '@/components/Verifition/types'
import httpClient from '@/utils/axios'

export interface CaptchaRequest {
  type?: string
}

export interface CaptchaResponse {
  id: string
  captcha: {
    backgroundImage: string
    sliderImage: string
    backgroundImageWidth: number
    backgroundImageHeight: number
    sliderImageWidth: number
    sliderImageHeight: number
    data: null
  }
}

/**
 *
 * @param params 图像验证码类型
 * @returns
 */
export function captchaGen(params?: CaptchaRequest) {
  return httpClient.get<CaptchaResponse>('/captcha/tianai/gen', { params })
}

/**
 * 验证码校验
 * @param data
 * @returns
 */
export function captchaCheck(id: string, data: CaptchaConfig) {
  return httpClient.post<unknown>('/captcha/tianai/check', data, { params: { id } })
}
