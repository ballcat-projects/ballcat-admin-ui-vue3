const omitUndefined = <T>(obj: T): T => {
  const newObj = {} as T
  Object.keys(obj || {}).forEach(key => {
    // @ts-ignore
    if (obj[key] !== undefined) {
      // @ts-ignore
      newObj[key] = obj[key]
    }
  })
  // @ts-ignore
  if (Object.keys(newObj).length < 1) {
    return undefined as any
  }
  return newObj
}

export default omitUndefined
