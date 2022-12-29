import type { Track, CaptchaConfig } from '@/components/Captcha/types'

export const useCaptcha = (
  options: {
    doDown?: (captchaConfig: CaptchaConfig) => void
    doMove?: (captchaConfig: CaptchaConfig) => void
    valid?: (captchaConfig: CaptchaConfig) => void
  } = {}
) => {
  // 验证码配置
  let currentCaptchaConfig: CaptchaConfig = {}

  function initConfig(
    bgImageWidth: number,
    bgImageHeight: number,
    sliderImageWidth: number,
    sliderImageHeight: number,
    end: number
  ) {
    currentCaptchaConfig = {
      startTime: new Date(),
      trackArr: [],
      movePercent: 0,
      bgImageWidth,
      bgImageHeight,
      sliderImageWidth,
      sliderImageHeight,
      end
    }
  }

  const down = (event: MouseEvent | TouchEvent) => {
    const targetTouches = (event as TouchEvent)?.targetTouches
    let startX = (event as MouseEvent)?.pageX
    let startY = (event as MouseEvent)?.pageY
    if (startX === undefined) {
      startX = Math.round(targetTouches[0].pageX)
      startY = Math.round(targetTouches[0].pageY)
    }
    currentCaptchaConfig.startX = startX
    currentCaptchaConfig.startY = startY

    const pageX = currentCaptchaConfig.startX
    const pageY = currentCaptchaConfig.startY
    const startTime = currentCaptchaConfig.startTime
    const trackArr = currentCaptchaConfig.trackArr
    trackArr!.push({
      x: pageX - startX,
      y: pageY - startY,
      type: 'down',
      t: new Date().getTime() - startTime!.getTime()
    })
    // pc
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    // 手机端
    window.addEventListener('touchmove', move, false)
    window.addEventListener('touchend', up, false)

    options.doDown?.(currentCaptchaConfig)
  }

  function move(event: MouseEvent | TouchEvent) {
    let touchMouseEvent: MouseEvent | Touch = event as MouseEvent
    if (window.TouchEvent && event instanceof TouchEvent) {
      touchMouseEvent = event.touches[0]
    }
    const pageX = Math.round(touchMouseEvent.pageX)
    const pageY = Math.round(touchMouseEvent.pageY)
    const startX = currentCaptchaConfig.startX as number
    const startY = currentCaptchaConfig.startY as number
    const startTime = currentCaptchaConfig.startTime as Date
    const end = currentCaptchaConfig.end as number
    const bgImageWidth = currentCaptchaConfig.bgImageWidth as number
    const trackArr = currentCaptchaConfig.trackArr as unknown[]
    let moveX = pageX - startX
    const track = {
      x: pageX - startX,
      y: pageY - startY,
      type: 'move',
      t: new Date().getTime() - startTime.getTime()
    }
    trackArr.push(track)
    if (moveX < 0) {
      moveX = 0
    } else if (moveX > end) {
      moveX = end
    }
    currentCaptchaConfig.moveX = moveX
    currentCaptchaConfig.movePercent = moveX / bgImageWidth

    options.doMove?.(currentCaptchaConfig)
  }

  function up(event: MouseEvent | TouchEvent) {
    let touchMouseEvent: MouseEvent | Touch = event as MouseEvent
    window.removeEventListener('mousemove', move)
    window.removeEventListener('mouseup', up)
    window.removeEventListener('touchmove', move)
    window.removeEventListener('touchend', up)
    if (window.TouchEvent && event instanceof TouchEvent) {
      touchMouseEvent = event.changedTouches[0]
    }
    currentCaptchaConfig.stopTime = new Date()
    const pageX = Math.round(touchMouseEvent.pageX)
    const pageY = Math.round(touchMouseEvent.pageY)
    const startX = currentCaptchaConfig.startX as number
    const startY = currentCaptchaConfig.startY as number
    const startTime = currentCaptchaConfig.startTime as Date
    const trackArr = currentCaptchaConfig.trackArr as Track[]

    const track: Track = {
      x: pageX - startX,
      y: pageY - startY,
      type: 'up',
      t: new Date().getTime() - startTime.getTime()
    }
    trackArr.push(track)

    options.valid?.(currentCaptchaConfig)
  }

  return {
    initConfig,
    down
  }
}
