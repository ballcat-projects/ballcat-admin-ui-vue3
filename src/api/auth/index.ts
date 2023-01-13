import httpClient from '@/utils/axios'
import type {
  OAuth2LoginParam,
  AccountLoginParam,
  MobileLoginParam,
  LoginResult
} from '@/api/auth/types'
import { useUserStore } from '@/stores/user-store'

// Base64(clientId:clientSecret)
// const BASIC_AUTHORIZATION = 'Basic bm8tY2FwdGNoYTpuby1jYXB0Y2hh'
const BASIC_AUTHORIZATION = 'Basic dWk6dWk='

/**
 * 账号密码登录
 * @param parameter
 */
export function accountLogin(parameter: AccountLoginParam) {
  return login(Object.assign({ grant_type: 'password' }, parameter))
}

/**
 * 手机号登录
 * @param parameter
 */
export function mobileLogin(parameter: MobileLoginParam) {
  return login(Object.assign({ grant_type: 'mobile' }, parameter))
}

/**
 * 登录
 * @param parameter 登录参数
 */
function login(parameter: OAuth2LoginParam) {
  return httpClient.request<LoginResult>({
    url: '/oauth2/token',
    method: 'POST',
    headers: {
      Authorization: BASIC_AUTHORIZATION
    },
    params: parameter
  })
}

/**
 * 校验 token
 * @param token accessToken
 */
export function checkToken(token: string) {
  return httpClient.request({
    url: '/oauth2/check_token',
    method: 'POST',
    headers: {
      Authorization: BASIC_AUTHORIZATION
    },
    params: { token: token }
  })
}

/**
 * 登出
 */
export function logout() {
  const accessToken = useUserStore().accessToken
  return httpClient.request({
    url: '/oauth2/revoke',
    method: 'POST',
    headers: {
      Authorization: BASIC_AUTHORIZATION
    },
    params: { token: accessToken }
  })
}
