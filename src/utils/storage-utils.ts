import { STORAGE_KEY_PREFIX } from '@/constants'

export const getStorageKey = (key: string) => {
  return STORAGE_KEY_PREFIX + key
}
