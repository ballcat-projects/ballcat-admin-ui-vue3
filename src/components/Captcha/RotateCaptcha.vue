<template>
  <div v-show="visible" class="captcha-mask">
    <div class="slider rotate">
      <div class="content">
        <div class="bg-img-div">
          <img ref="bgImgRef" alt="" :src="captchaData?.captcha.backgroundImage" />
        </div>
        <div class="rotate-img-div">
          <img
            ref="rotateImgRef"
            :style="rotateImgStyle"
            :src="captchaData?.captcha.templateImage"
            alt=""
          />
        </div>
      </div>
      <div class="slider-move">
        <div class="slider-move-track">拖动滑块旋转正确位置</div>
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
const rotateImgRef = ref()
const captchaData = ref<CaptchaData>()

// 验证码 X 轴移动位置
const moveX = ref(0)
// 滑动按钮是否被激活
const sliderMoveBtnActive = ref(false)
// 旋转图块的样式
const rotateImgStyle = ref<CSSProperties>({ transform: 'rotate(0deg)' })
// 滑动按钮的样式
const sliderMoveBtnStyle = computed<CSSProperties>(() => ({
  transform: `translateX(${moveX.value}px)`,
  backgroundPosition: sliderMoveBtnActive.value ? '-5px 31.0092%' : '-5px 11.79625%'
}))

function reset() {
  moveX.value = 0
  sliderMoveBtnActive.value = false
  rotateImgStyle.value = { transform: 'rotate(0deg)' }
}

/* 刷新验证码 */
function refreshCaptcha() {
  reset()
  captchaGen('ROTATE').then(res => {
    captchaData.value = res
    nextTick(() => {
      initConfig(
        206,
        bgImgRef.value.height,
        rotateImgRef.value.width,
        rotateImgRef.value.height,
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
  rotateImgStyle.value.transform = 'rotate(' + moveX.value / (config.end! / 360) + 'deg)'
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

.rotate-img-div {
  height: 100%;
  position: absolute;
  transform: rotate(0deg);
  margin-left: 50px;
}

.rotate-img-div img {
  height: 100%;
}
</style>
