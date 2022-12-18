/* 使用源对象，覆盖目标对象的已有属性 */
export function overrideProperties<T>(target: T, source: any, excludes?: string[]): T {
  if (!source) return target
  // @ts-ignore
  Object.keys(target).forEach(key => {
    const result = target as any
    if (!excludes?.includes(key)) {
      result[key] = source[key]
    }
  })
  return target
}
