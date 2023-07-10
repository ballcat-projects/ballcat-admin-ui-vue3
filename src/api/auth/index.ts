import httpClient from '@/utils/axios'
import type { AuthenticationManager, LoginResult, LoginStateManager } from '@/api/auth/types'
import { useUserStore } from '@/stores/user-store'
import { AuthenticationMethod, AuthenticationType } from '@/config'

// Base64(clientId:clientSecret)
// const BASIC_AUTHORIZATION = 'Basic bm8tY2FwdGNoYTpuby1jYXB0Y2hh'
const BASIC_AUTHORIZATION = 'Basic dWk6dWk='

export const authenticationManagers: Record<AuthenticationType, AuthenticationManager> = {
  [AuthenticationType.FORM_LOGIN]: {
    login: (parameter: any) => {
      return httpClient.request<LoginResult>({
        url: '/login',
        method: 'POST',
        params: parameter
      })
    },
    logout: () => {
      return httpClient.request({
        url: '/logout',
        method: 'POST'
      })
    }
  },
  [AuthenticationType.OAUTH2_PASSWORD_GRANT_TYPE]: {
    login: (parameter: any) => {
      return httpClient.request<LoginResult>({
        url: '/oauth2/token',
        method: 'POST',
        headers: {
          Authorization: BASIC_AUTHORIZATION
        },
        params: Object.assign({ grant_type: 'password' }, parameter)
      })
    },
    logout: () => {
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
  }
}

export const loginStateManagers: Record<AuthenticationMethod, LoginStateManager> = {
  [AuthenticationMethod.COOKIE_JSESSIONID]: {
    // jsessionid 无法获取，所以一律认定为未登出，交由服务端判断
    isLoggedOut: () => false
  },
  [AuthenticationMethod.OAUTH2_ACCESS_TOKEN]: {
    isLoggedOut: () => {
      return false
    }
  }
}
