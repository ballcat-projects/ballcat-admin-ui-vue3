export function hasItem(array: string[] | undefined, item: string) {
  if (!item) {
    return true
  }
  if (!array) {
    return false
  }
  return array.includes(item)
}

export function hasAnyItem(array: string[] | undefined, items: string[] | string) {
  if (!items) {
    return true
  }
  if (!array) {
    return false
  }
  if (Array.isArray(items)) {
    for (const item of items) {
      if (hasItem(array, item)) {
        return true
      }
    }
  } else {
    return hasItem(array, items)
  }
}

export function isEmpty(array: any[] | undefined) {
  if (!array) {
    return false
  }
  return array.length === 0
}

export function isNotEmpty(array: any[] | undefined) {
  return !isEmpty(array)
}
