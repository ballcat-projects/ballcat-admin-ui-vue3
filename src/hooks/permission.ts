import { useUserStore } from '@/stores/user-store'
import { hasAnyItem, hasItem } from '@/utils/array-utils'

export const useAuthorize = () => {
  const { userInfo } = useUserStore()

  function hasPermission(permissionCode: string) {
    return hasItem(userInfo?.permissions, permissionCode)
  }
  function hasAnyPermission(permissionCodes: string[]) {
    return hasAnyItem(userInfo?.permissions, permissionCodes)
  }
  function hasRole(rolCode: string) {
    return hasItem(userInfo?.roleCodes, rolCode)
  }
  function hasAnyRole(rolCodes: string[]) {
    return hasAnyItem(userInfo?.roleCodes, rolCodes)
  }

  return { hasPermission, hasAnyPermission, hasRole, hasAnyRole }
}
