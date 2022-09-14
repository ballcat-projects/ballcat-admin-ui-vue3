import type { validateOptions } from 'ant-design-vue/lib/form/useForm'
import type { LoginResult } from '@/api/auth/types'

declare type namesType = string | string[]

export type LoginType = 'account' | 'mobile'

export interface LoginFormInstance {
  validate: <T = any>(names?: namesType, option?: validateOptions) => Promise<T>
  doLogin: (captchaId?: string) => Promise<LoginResult>
}
