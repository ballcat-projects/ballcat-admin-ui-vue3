<template>
  <div v-show="visible" class="captcha-mask">
    <div class="slider concat">
      <div class="content">
        <div ref="concatImgDivRef" :style="concatImgDivStyle" class="concat-img-div"></div>
        <div ref="bgImgDivRef" :style="bgImgDivStyle" class="bg-img-div"></div>
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
import { captchaCheck, type CaptchaData, captchaGen } from '@/api/auth/captcha'
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

const bgImgDivRef = ref()
const concatImgDivRef = ref()
const captchaData = ref<CaptchaData>()

// 验证码 X 轴移动位置
const moveX = ref(0)
// 滑动按钮是否被激活
const sliderMoveBtnActive = ref(false)
// 背景图 div 样式
const bgImgDivStyle = ref<CSSProperties>({})
//  拼接图 div 样式
const concatImgDivStyle = ref<CSSProperties>({ transform: 'translateX(0px)' })
// 滑动按钮的样式
const sliderMoveBtnStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${moveX.value}px)`,
  backgroundPosition: sliderMoveBtnActive.value ? '-5px 31.0092%' : '-5px 11.79625%'
}))

function reset() {
  moveX.value = 0
  sliderMoveBtnActive.value = false
  concatImgDivStyle.value.transform = 'translateX(0px)'
}

/* 刷新验证码 */
function refreshCaptcha() {
  reset()
  captchaGen('CONCAT').then(res => {
    captchaData.value = res

    bgImgDivStyle.value.backgroundImage = `url(${res.captcha.backgroundImage})`
    concatImgDivStyle.value.backgroundImage = `url(${res.captcha.backgroundImage})`
    concatImgDivStyle.value.backgroundPosition = '0px 0px'
    const backgroundImageHeight = res.captcha.backgroundImageHeight
    const height =
      ((backgroundImageHeight - res.captcha.data.randomY!) / backgroundImageHeight) * 159
    concatImgDivStyle.value.height = `${height}px`

    nextTick(() => {
      initConfig(
        bgImgDivRef.value.clientWidth,
        bgImgDivRef.value.clientHeight,
        concatImgDivRef.value.width,
        concatImgDivRef.value.height,
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
  concatImgDivStyle.value.backgroundPositionX = `${moveX.value}pX`
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

.concat {
  .bg-img-div {
    background-size: 100% 159px;
    background-image: none;
    background-position: 0 0;
    z-index: 0;
  }
}

.concat-img-div {
  height: 100%;
  width: 100%;
  background-size: 100% 159px;
  position: absolute;
  transform: translate(0px, 0px);
  z-index: 1;
}
</style>
