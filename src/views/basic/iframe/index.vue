<template>
  <a-spin
    tip="Loading..."
    size="large"
    :spinning="iframeLoading"
    wrapper-class-name="iframe-spin-wrapper"
  >
    <iframe :id="id" ref="iframeRef" :src="url" class="iframe" @load="hideLoading" />
  </a-spin>
</template>

<script setup lang="ts">
// 如果需要被多页签缓存，必须要设置组件名称
defineOptions({ name: 'IframeView' })

const iframeRef = ref<HTMLIFrameElement>()

const route = useRoute()
const id = route.path
const url = route.meta.target

const iframeLoading = ref(true)

function iframeResize() {
  const iframe = unref(iframeRef)
  if (iframe) {
    const clientHeight = document.getElementsByClassName('ant-layout-content')[0].clientHeight - 1
    iframe.style.height = `${clientHeight}px`
  }
}

onMounted(() => window.addEventListener('resize', iframeResize))
onUnmounted(() => window.removeEventListener('resize', iframeResize))

const hideLoading = () => {
  iframeLoading.value = false
  iframeResize()
}
</script>

<style scoped>
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
  display: block;
}
</style>
