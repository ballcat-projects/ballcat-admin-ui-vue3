import type { AxiosResponse, AxiosResponseHeaders } from 'axios'

export const fileAbsoluteUrl = (
  relativePath: string,
  fileDomain = import.meta.env.VITE_IMAGE_DOMAIN
) => {
  if (!relativePath || relativePath.length === 0) return
  return relativePath.startsWith('/')
    ? `${fileDomain}${relativePath}`
    : `${fileDomain}/${relativePath}`
}

/**
 * Convert BASE64 to BLOB
 * @param base64Image Pass Base64 image data to convert into the BLOB
 */
export function convertBase64ToBlob(base64Image: string) {
  // Split into two parts
  const parts = base64Image.split(';base64,')

  // Hold the content type
  const imageType = parts[0].split(':')[1]

  // Decode Base64 string
  const decodedData = window.atob(parts[1])

  // Create UNIT8ARRAY of size same as row data length
  const uInt8Array = new Uint8Array(decodedData.length)

  // Insert all character code into uInt8Array
  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i)
  }

  // Return BLOB image after conversion
  return new Blob([uInt8Array], { type: imageType })
}

/**
 * 远程文件下载
 * @param response
 * @param filename
 */
export function remoteFileDownload(response: AxiosResponse, filename?: string) {
  if (response.data) {
    // 构造一个blob对象来处理数据，并设置文件类型
    const headers = response.headers as AxiosResponseHeaders
    const contentType = headers['content-type']
    const blob = new Blob([response.data], { type: contentType })

    // 不存在则从响应头中解析
    if (!filename) {
      filename = resolveFilename(headers)
      console.log(filename)
    }
    fileDownload(blob, filename)
  }
}

/**
 * 根据 response header 解析文件名
 * @param headers 响应头
 */
function resolveFilename(headers: AxiosResponseHeaders): string {
  const match = headers['content-disposition'].match(/filename=(.*)/)
  if (match && match.length > 0) {
    return decodeURI(match[1])
  }
  return ''
}

/**
 * 根据 blob 和 文件名进行文件下载
 * @param blob
 * @param filename
 */
export function fileDownload(blob: Blob, filename: string) {
  //兼容IE10，后续可以移除
  const navigator = window.navigator as any
  if (navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    const href = URL.createObjectURL(blob) //创建新的URL表示指定的blob对象
    const a = document.createElement('a') //创建a标签
    a.style.display = 'none'
    a.href = href // 指定下载链接
    a.download = filename //指定下载文件名
    a.click() //触发下载
    URL.revokeObjectURL(a.href) //释放URL对象
  }
}
