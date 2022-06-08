export const fileAbsoluteUrl = (relativePath: string) => {
  if (!relativePath || relativePath.length === 0) return
  const fileDomain = 'https://hccake-img.oss-cn-shanghai.aliyuncs.com'
  return relativePath.startsWith('/')
    ? `${fileDomain}${relativePath}`
    : `${fileDomain}/${relativePath}`
}
