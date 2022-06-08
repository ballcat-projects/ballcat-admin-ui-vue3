import 'axios'

declare module 'axios' {
  interface AxiosError {
    resolved?: boolean // 扩展属性，是否已经在拦截器种处理过
  }
}
