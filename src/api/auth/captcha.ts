import type { CaptchaConfig } from '@/components/Captcha/types'
import httpClient from '@/utils/axios'

export interface CaptchaData {
  id: string
  captcha: {
    backgroundImage: string
    templateImage: string
    backgroundImageWidth: number
    backgroundImageHeight: number
    sliderImageWidth: number
    sliderImageHeight: number
    data: {
      randomY?: string
    }
  }
}

/**
 * 获取验证码图片
 * @param type 图像验证码类型
 * @returns
 */
export function captchaGen(type?: string) {
  return httpClient.get<CaptchaData>('/captcha/tianai/gen', { params: { type: type } })
}

/**
 * 验证码校验
 * @param id 验证码id
 * @param data true:校验通过/false:校验失败
 * @returns
 */
export function captchaCheck(id: string, data: CaptchaConfig) {
  return httpClient.post<boolean>('/captcha/tianai/check', data, { params: { id } })
}
