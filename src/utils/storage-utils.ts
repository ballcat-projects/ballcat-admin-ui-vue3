import { storageKeyPrefix } from '@/config'

export const getStorageKey = (key: string) => {
  return storageKeyPrefix + key
}
