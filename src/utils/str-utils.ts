/**
 * 下划线转驼峰
 * @param str
 */
export function underlineToLittleCamel(str: string) {
  return str.replace(/_([a-z])/g, (p, m) => m.toUpperCase())
}

/**
 * 小驼峰转下划线
 * @param str
 * @returns {{}|*}
 */
export function littleCamelToUnderline(str: string) {
  return str.replace(/([A-Z])/g, (p, m) => `_${m.toLowerCase()}`)
}

/**
 * 首字母大写
 * @param str
 * @returns {*}
 */
export function firstUpperCase(str: string) {
  return str.replace(/^\S/, s => s.toUpperCase())
}
