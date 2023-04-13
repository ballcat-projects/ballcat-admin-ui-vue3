import { useUserStore } from '@/stores/user-store'

export const useAuthorize = () => {
  const { userInfo } = useUserStore()

  function hasPermission(...permissionCodes: string[]) {
    return includes(userInfo?.permissions, permissionCodes)
  }

  function hasAnyPermission(...permissionCodes: string[]) {
    return includesAny(userInfo?.permissions, permissionCodes)
  }

  function hasRole(...rolCodes: string[]) {
    return includes(userInfo?.roleCodes, rolCodes)
  }

  function hasAnyRole(...rolCodes: string[]) {
    return includesAny(userInfo?.roleCodes, rolCodes)
  }

  return { hasPermission, hasAnyPermission, hasRole, hasAnyRole }
}

function includes(array: string[] | undefined, items: string[]) {
  if (!array || array.length == 0) {
    return false
  }
  if (items.length == 0) {
    return false
  }
  const notInclude = items.find(x => !array.includes(x))
  return !notInclude
}

function includesAny(array: string[] | undefined, items: string[]) {
  if (!array || array.length == 0) {
    return false
  }
  if (items.length == 0) {
    return true
  }
  const includeSomeOne = items.find(x => array.includes(x))
  return !!includeSomeOne
}
