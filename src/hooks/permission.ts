import { useUserStore } from '@/stores/user-store'

export const useAuthorize = () => {
  const { userInfo } = useUserStore()

  function hasPermission(permissionCode: string) {
    return includes(userInfo?.permissions || [], permissionCode)
  }

  function hasAnyPermission(permissionCodes: string[]) {
    return includesAny(userInfo?.permissions || [], permissionCodes)
  }

  function hasRole(rolCode: string) {
    return includes(userInfo?.roleCodes || [], rolCode)
  }

  function hasAnyRole(rolCodes: string[]) {
    return includesAny(userInfo?.roleCodes || [], rolCodes)
  }

  return { hasPermission, hasAnyPermission, hasRole, hasAnyRole }
}

function includes(array: string[], item: string) {
  return array.includes(item)
}

function includesAny(array: string[], items: string[]) {
  if (items.length == 0) {
    return true
  }
  for (const item of items) {
    if (includes(array, item)) {
      return true
    }
  }
  return false
}
