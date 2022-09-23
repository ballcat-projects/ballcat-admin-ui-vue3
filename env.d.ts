/// <reference types="vite/client" />
interface ImportMetaEnv {
  // 请求的 base_url
  readonly VITE_API_URL: string
  // 请求的超时时间
  readonly VITE_API_TIME_OUT: number
  // 密码加密密钥, 16 位字符串
  readonly VITE_PASSWORD_SECRET_KEY: string
  // 图片域名
  readonly VITE_IMAGE_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '@ckpack/vue-color' {
  import type { Component } from 'vue'
  const Alpha: Component
  const Checkboard: Component
  const Chrome: Component
  const Compact: Component
  const EditableInput: Component
  const Grayscale: Component
  const Hue: Component
  const Material: Component
  const Photoshop: Component
  const Saturation: Component
  const Sketch: Component
  const Slider: Component
  const Swatches: Component
  const Twitter: Component
}
