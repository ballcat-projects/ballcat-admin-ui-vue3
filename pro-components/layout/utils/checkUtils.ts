/** 判断是否是图片链接 */
export function isImg(path: string): boolean {
  return /\w.(png|jpg|jpeg|svg|webp|gif|bmp)$/i.test(path)
}

export const isNil = (value: any) => value === null || value === undefined

export const isUrl = (path: string | undefined): boolean => {
  if (!path) return false
  if (!path.startsWith('http')) {
    return false
  }
  try {
    const url = new URL(path)
    return !!url
  } catch (error) {
    return false
  }
}

/** 校验是否不是数组且不为空 **/
export const notNullArray = (value: any) => Array.isArray(value) && value.length > 0
