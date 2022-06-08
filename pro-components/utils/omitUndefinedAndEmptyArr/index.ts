const omitUndefinedAndEmptyArr = <T>(obj: T): T => {
  const newObj = {} as T
  Object.keys(obj || {}).forEach(key => {
    // @ts-ignore
    if (Array.isArray(obj[key]) && obj[key]?.length === 0) {
      return
    }
    // @ts-ignore
    if (obj[key] === undefined) {
      return
    }
    // @ts-ignore
    newObj[key] = obj[key]
  })
  return newObj
}

export default omitUndefinedAndEmptyArr
