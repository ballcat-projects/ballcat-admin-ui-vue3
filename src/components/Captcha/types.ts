export interface CaptchaConfig {
  startX?: number
  startY?: number
  type?: string
  startTime?: Date
  stopTime?: Date
  trackArr?: Track[]
  end?: number
  bgImageWidth?: number
  bgImageHeight?: number
  templateImageWidth?: number
  templateImageHeight?: number
  movePercent?: number
  moveX?: number
  t?: number
}

export interface Track {
  x: number
  y: number
  type: string
  t: number
}

export interface CaptchaProps {
  onSuccess?: (id: string) => void
}
