<template>
  <div v-show="visible" class="captcha-mask">
    <div class="slider word-click">
      <div class="slider-move">
        <span class="slider-move-span">请依次点击:</span>
        <img :src="sliderImageUrl" class="tip-img" alt="" />
      </div>
      <div ref="contentRef" class="content" @click="wordClick">
        <div ref="bgImgDivRef" class="bg-img-div">
          <img ref="bgImgRef" alt="" :src="backgroundImageUrl" />
        </div>
        <div class="bg-click-div">
          <span
            v-for="item in clickPositions"
            :key="item.number"
            class="click-span"
            :style="`left:${item.left}px;top:${item.top}px`"
          >
            {{ item.number }}
          </span>
        </div>
      </div>
      <div class="bottom">
        <div class="close-btn" style="margin-right: 6px" @click="closeCaptcha"></div>
        <div class="refresh-btn" @click="refreshCaptcha"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { captchaGen, captchaCheck, type CaptchaData } from '@/api/auth/captcha'
import type { CaptchaConfig, CaptchaProps, Track } from '@/components/Captcha/types'

const props = defineProps<CaptchaProps>()

// 是否显示验证码
const visible = ref(false)
function showCaptcha() {
  visible.value = true
}
function closeCaptcha() {
  visible.value = false
}

const contentRef = ref()
const bgImgRef = ref()
const bgImgDivRef = ref()
const captchaData = ref<CaptchaData>()

const backgroundImageUrl = ref()
const sliderImageUrl = ref()
const tpImageUrl = ref()

let startSlidingTime: Date
let entSlidingTime: Date
const trackArr: Track[] = []
// 选中文字次数
const clickCount = ref(0)

type ClickPosition = {
  left: number
  top: number
  number: number
}
const clickPositions = ref<ClickPosition[]>([])

function wordClick(event: MouseEvent) {
  if (clickCount.value >= 4) {
    return
  }
  clickCount.value++
  if (clickCount.value === 1) {
    startSlidingTime = new Date()
    // move 轨迹
    window.addEventListener('mousemove', move)
  }
  trackArr.push({
    x: event.offsetX,
    y: event.offsetY,
    type: 'click',
    t: new Date().getTime() - startSlidingTime.getTime()
  })
  const left = event.offsetX - 10
  const top = event.offsetY - 10

  clickPositions.value.push({ left: left, top: top, number: clickCount.value })
  if (clickCount.value === 4) {
    // 校验
    entSlidingTime = new Date()
    window.removeEventListener('mousemove', move)
    valid({
      bgImageWidth: bgImgDivRef.value.clientWidth,
      bgImageHeight: contentRef.value.clientHeight,
      sliderImageWidth: -1,
      sliderImageHeight: -1,
      startTime: startSlidingTime,
      stopTime: entSlidingTime,
      trackArr: trackArr
    })
  }
}

function move(event: MouseEvent) {
  trackArr.push({
    x: event.offsetX,
    y: event.offsetY,
    t: new Date().getTime() - startSlidingTime.getTime(),
    type: 'move'
  })
}

function reset() {
  startSlidingTime = new Date()
  entSlidingTime = new Date()
  trackArr.length = 0
  clickPositions.value = []
  clickCount.value = 0
  window.removeEventListener('mousemove', move)
}

/* 刷新验证码 */
function refreshCaptcha() {
  reset()
  captchaGen('WORD_IMAGE_CLICK').then(res => {
    captchaData.value = res
    backgroundImageUrl.value = res.captcha.backgroundImage
    sliderImageUrl.value = res.captcha.templateImage
    tpImageUrl.value = res.captcha.templateImage
  })
}

function valid(config: CaptchaConfig) {
  const data = {
    bgImageWidth: config.bgImageWidth,
    bgImageHeight: config.bgImageHeight,
    templateImageWidth: config.templateImageWidth,
    templateImageHeight: config.templateImageHeight,
    startSlidingTime: config.startTime,
    entSlidingTime: config.stopTime,
    trackList: config.trackArr
  }
  const { id } = captchaData.value!
  captchaCheck(id, data).then(res => {
    if (res) {
      props.onSuccess?.(id)
      closeCaptcha()
    } else {
      refreshCaptcha()
    }
  })
}

defineExpose({
  show() {
    refreshCaptcha()
    showCaptcha()
  }
})
</script>

<style lang="less" scoped>
@import './index.less';

.slider.word-click {
  height: 250px;
  position: relative;
}

.word-click {
  .bg-img-div {
    z-index: 0;
  }
  .slider-move {
    height: 40px;
    margin: 0;
  }
  .bottom {
    margin-top: 10px;
  }
}

.bg-click-div {
  z-index: 1;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.tip-img {
  width: 130px;
  position: absolute;
  right: 5px;
}

.slider-move-span {
  font-size: 18px;
  display: inline-block;
  height: 40px;
  line-height: 40px;
}

.click-span {
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 50px;
  background-color: #409eff;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  color: #fff;
  border: 2px solid #fff;
}
</style>
