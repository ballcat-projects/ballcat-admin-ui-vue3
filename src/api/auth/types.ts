/**
 * 用户名密码登录所需参数
 */
export interface AccountLoginParam {
  username: string
  password: string
  captchaId?: string
}

/**
 * 手机号登录所需参数
 */
export interface MobileLoginParam {
  mobile?: string
  captcha?: string
}

/**
 * OAuth2 登录需要的参数
 */
export type OAuth2LoginParam = {
  grant_type: string
} & (AccountLoginParam | MobileLoginParam)

/**
 * 用户信息
 */
export interface LoginUserInfo {
  userId: number
  username: string
  type: number
  organizationId: number
  nickname: string
  avatar?: string
}

/**
 * 登录成功时的返回结果
 */
export interface LoginResult {
  access_token: string
  attributes: {
    permissions: string[]
    roleCodes: string[]
  }
  expires_in: number
  info: LoginUserInfo
  refresh_token: string
  scope: string
  token_type: string
}
