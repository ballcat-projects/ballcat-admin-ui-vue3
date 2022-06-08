<template>
  <a-modal
    title="图片上传"
    :visible="visible"
    :mask-closable="false"
    :confirm-loading="confirmLoading"
    :width="800"
    :footer="null"
    @cancel="close"
  >
    <a-row>
      <a-col :xs="24" :md="12" :style="{ height: '350px' }">
        <vue-cropper
          ref="cropperRef"
          :img="options.img"
          :info="true"
          :auto-crop="options.autoCrop"
          :auto-crop-width="options.autoCropWidth"
          :auto-crop-height="options.autoCropHeight"
          :fixed-box="options.fixedBox"
          @real-time="realTime"
        />
      </a-col>
      <a-col :xs="24" :md="12" :style="{ height: '350px' }">
        <div class="avatar-upload-preview">
          <img v-if="previews.url" :src="previews.url" :style="previews.img" alt="previewImg" />
        </div>
      </a-col>
    </a-row>
    <a-row justify="center">
      <a-col>
        <div style="margin-top: 20px">
          <a-space :size="20">
            <a-upload name="file" :before-upload="beforeUpload" :show-upload-list="false">
              <a-button>
                <UploadOutlined />
                选择图片
              </a-button>
            </a-upload>
            <a-button @click="() => cropperRef.changeScale(1)">
              <PlusOutlined />
            </a-button>
            <a-button @click="() => cropperRef.changeScale(-1)">
              <MinusOutlined />
            </a-button>
            <a-button @click="() => cropperRef.rotateLeft()">
              <UndoOutlined />
            </a-button>
            <a-button @click="() => cropperRef.rotateRight()">
              <RedoOutlined />
            </a-button>
            <a-button type="primary" @click="upload">保存</a-button>
          </a-space>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup lang="ts">
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'
import { message } from 'ant-design-vue'
import type { UploadProps } from 'ant-design-vue'
import type { ApiResult } from '@/api/types'
import type { FileObject } from '@/components/CropperModal/types'

const props = defineProps<{
  uploadProcessor: (file: FileObject, params: any) => Promise<ApiResult>
}>()

const emits = defineEmits<{
  <T>(e: 'ok', data: ApiResult, extra?: T): void
}>()

const cropperRef = ref()
const options = reactive({
  // img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  img: '',
  autoCrop: true,
  autoCropWidth: 200,
  autoCropHeight: 200,
  fixedBox: true
})

type CropperData = {
  url?: string
  img?: CSSStyleRule
}
const previews = ref<CropperData>({})
const realTime = (data: CropperData) => {
  options.img && (previews.value = data)
}

let extra: any
const visible = ref(false)
const open = (img: string, info?: any) => {
  previews.value = {}
  extra = info
  options.img = img
  visible.value = true
}
const close = () => (visible.value = false)
const confirmLoading = ref(false)

let currentFilename = ''
const beforeUpload: UploadProps['beforeUpload'] = file => {
  const reader = new FileReader()
  // 把Array Buffer转化为blob 如果是base64不需要
  // 转化为base64
  reader.readAsDataURL(file)
  reader.onload = () => {
    options.img = reader.result as string
  }
  currentFilename = file.name
  // 转化为blob
  // reader.readAsArrayBuffer(file)
  return false
}

// 上传图片（点击上传按钮）
const upload = () => {
  // TODO 图片上传有上传文件和Base64字符串两种方式，暂时为做Base64方式的处理
  confirmLoading.value = true
  cropperRef.value.getCropBlob((data: Blob) => {
    props.uploadProcessor({ data: data, name: currentFilename }, extra).then(data => {
      confirmLoading.value = false
      message.success('上传图片成功')
      emits('ok', data)
      close()
    })
  })
}

defineExpose({
  open
})
</script>

<script lang="ts">
export default {
  name: 'CropperModal'
}
</script>

<style scoped lang="less">
.avatar-upload-preview {
  position: absolute;
  top: 50%;
  transform: translate(50%, -50%);
  width: 180px;
  height: 180px;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
  }
}
</style>
