<template>
  <div v-show="visible" class="captcha-mask">
    <div class="slider">
      <div class="content">
        <div class="bg-img-div">
          <img ref="bgImgRef" alt="" :src="captchaData?.captcha.backgroundImage" />
        </div>
        <div class="slider-img-div">
          <img
            ref="sliderImgRef"
            :style="sliderImgStyle"
            :src="captchaData?.captcha.templateImage"
            alt=""
          />
        </div>
      </div>
      <div class="slider-move">
        <div class="slider-move-track">拖动滑块完成拼图</div>
        <div
          class="slider-move-btn"
          :style="sliderMoveBtnStyle"
          @mousedown="down"
          @touchstart.prevent="down"
        ></div>
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
import type { CaptchaConfig, CaptchaProps } from '@/components/Captcha/types'
import { useCaptcha } from '@/components/Captcha/useCaptcha'
import type { CSSProperties } from 'vue'

const props = defineProps<CaptchaProps>()

// 是否显示验证码
const visible = ref(false)
function showCaptcha() {
  visible.value = true
}
function closeCaptcha() {
  visible.value = false
}

const bgImgRef = ref()
const sliderImgRef = ref()
const captchaData = ref<CaptchaData>()

// 验证码 X 轴移动位置
const moveX = ref(0)
// 滑动按钮是否被激活
const sliderMoveBtnActive = ref(false)
// 滑动图块的样式
const sliderImgStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${moveX.value}px)`
}))
// 滑动按钮的样式
const sliderMoveBtnStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${moveX.value}px)`,
  backgroundPosition: sliderMoveBtnActive.value ? '-5px 31.0092%' : '-5px 11.79625%'
}))

function reset() {
  moveX.value = 0
  sliderMoveBtnActive.value = false
}

/* 刷新验证码 */
function refreshCaptcha() {
  reset()
  captchaGen().then(res => {
    captchaData.value = res
    nextTick(() => {
      initConfig(
        bgImgRef.value.width,
        bgImgRef.value.height,
        sliderImgRef.value.width,
        sliderImgRef.value.height,
        206
      )
    })
  })
}

function doDown() {
  sliderMoveBtnActive.value = true
}

function doMove(config: CaptchaConfig) {
  moveX.value = config.moveX!
}

function valid(config: CaptchaConfig) {
  const {
    bgImageWidth,
    bgImageHeight,
    templateImageWidth,
    templateImageHeight,
    startTime: startSlidingTime,
    stopTime: endSlidingTime,
    trackArr: trackList
  } = config
  const captchaCheckConfig = {
    bgImageWidth,
    bgImageHeight,
    templateImageWidth,
    templateImageHeight,
    startSlidingTime,
    endSlidingTime,
    trackList
  }
  const { id } = captchaData.value!
  captchaCheck(id, captchaCheckConfig).then(res => {
    if (res) {
      props.onSuccess?.(id)
      closeCaptcha()
    } else {
      refreshCaptcha()
    }
  })
}

const { initConfig, down } = useCaptcha({ doDown, doMove, valid })

defineExpose({
  show() {
    refreshCaptcha()
    showCaptcha()
  }
})
</script>

<style lang="less" scoped>
@import './index.less';
</style>
