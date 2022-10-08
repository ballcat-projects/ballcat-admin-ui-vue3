<template>
  <div class="mask">
    <div class="verify-slider-container">
      <div class="content">
        <div ref="bgImgRef" class="bg-img">
          <img alt="" :src="verifyImgRef?.captcha.backgroundImage" />
        </div>
        <div class="slider-img">
          <img
            ref="sliderImgRef"
            :style="`transform:translateX(${moveX}px)`"
            :src="verifyImgRef?.captcha.sliderImage"
            alt=""
          />
        </div>
      </div>
      <div class="slider-move">
        <div class="slider-move-track">拖动滑块完成拼图</div>
        <div
          class="slider-move-btn"
          :style="`transform:translateX(${moveX}px)`"
          @mousedown="down"
          @touchstart="down"
        ></div>
      </div>
      <div class="bottom">
        <div class="refresh-btn" @click="getPicture"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { captchaGen, captchaCheck, type CaptchaResponse } from '@/api/auth/captcha'
import type { CaptchaConfig, Track } from '@/components/Verifition/types'

const props = defineProps({
  success: { type: Function, default() {} },
  modelValue: Boolean,
  captchaType: { type: String, default: 'SLIDER' }
})
const emit = defineEmits(['update:modelValue'])

const bgImgRef = ref()
const sliderImgRef = ref()
const verifyImgRef = ref<CaptchaResponse>()
const moveX = ref(0)

let currentCaptchaConfig: CaptchaConfig = { trackArr: [] }
onMounted(() => {
  getPicture()
  const bgImgEle = bgImgRef.value
  const sliderImgEle = sliderImgRef.value
  const bgImageWidth = bgImgEle.offsetWidth
  const bgImageHeight = bgImgEle.offsetHeight
  const sliderImageWidth = sliderImgEle.offsetWidth
  const sliderImageHeight = sliderImgEle.offsetHeight
  currentCaptchaConfig = {
    startTime: new Date(),
    trackArr: [],
    movePercent: 0,
    bgImageWidth,
    bgImageHeight,
    sliderImageWidth,
    sliderImageHeight,
    end: 206
  }
})

const getPicture = () => {
  captchaGen().then(res => {
    verifyImgRef.value = res
  })
}

const refresh = () => {
  getPicture()
  currentCaptchaConfig = { ...currentCaptchaConfig, trackArr: [], startTime: new Date() }
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
  // printLog('start', startX, startY)
  // pc
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', up)
  // 手机端
  window.addEventListener('touchmove', move, false)
  window.addEventListener('touchend', up, false)
}

function move(event: MouseEvent | TouchEvent) {
  let touchMouseEvent: MouseEvent | Touch = event as MouseEvent
  if (event instanceof TouchEvent) {
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
  doMove(currentCaptchaConfig)
}

function up(event: MouseEvent | TouchEvent) {
  let touchMouseEvent: MouseEvent | Touch = event as MouseEvent
  window.removeEventListener('mousemove', move)
  window.removeEventListener('mouseup', up)
  window.removeEventListener('touchmove', move)
  window.removeEventListener('touchend', up)
  if (event instanceof TouchEvent) {
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
  valid(currentCaptchaConfig)
}

const valid = (config: CaptchaConfig) => {
  const {
    bgImageWidth,
    bgImageHeight,
    sliderImageWidth,
    sliderImageHeight,
    startTime: startSlidingTime,
    stopTime: endSlidingTime,
    trackArr: trackList
  } = config
  const captchaCheckConfig = {
    bgImageWidth,
    bgImageHeight,
    sliderImageWidth,
    sliderImageHeight,
    startSlidingTime,
    endSlidingTime,
    trackList
  }
  const { id } = verifyImgRef.value!
  captchaCheck(id, captchaCheckConfig).then(res => {
    if (res) {
      props.success(id)
      emit('update:modelValue', false)
    } else {
      refresh()
      moveX.value = 0
    }
  })
}

const doMove = (config: CaptchaConfig) => {
  moveX.value = config.moveX!
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
