<template>
  <div style='border: 1px solid #ccc'>
    <Toolbar
      style='border-bottom: 1px solid #ccc'
      :editor='editorRef'
      :default-config='toolbarConfig'
      :mode='mode'
    />
    <Editor
      v-model:value='html'
      style='height: 500px; overflow-y: hidden'
      :default-config='editorConfig'
      :mode='mode'
      @onChange='handleUpdate'
      @onCreated='handleCreated'
    />
  </div>
</template>

<script lang='ts' setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { fileAbsoluteUrl } from '@/utils/file-utils'
import type { InsertFnType, UploadFunction } from '@/components/Editor/types'

const mode = 'default'

const props = defineProps<{
  modelValue?: string
  uploadImgReq: UploadFunction
}>()

const html = ref<string>()

const emits = defineEmits(['update:modelValue'])

const editorRef = shallowRef()

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} }
editorConfig.MENU_CONF['uploadImage'] = {
  // 自定义上传
  async customUpload(file: File, insertFn: InsertFnType) {
    // TS 语法
    props.uploadImgReq([{ name: file.name, data: file }]).then(res => {
      // 上传图片，返回结果，将图片插入到编辑器中
      // TODO 图片大小控制
      for (const objectName of res.data) {
        const imgUrl = fileAbsoluteUrl(objectName)
        insertFn(imgUrl!, '', '')
      }
    })
  }
}

const handleCreated = editor => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

const handleUpdate = value => {
  emits('update:modelValue', value.getHtml())
}

watch(() => props.modelValue, () => {
  html.value = props.modelValue
  if (html.value !== editorRef.value.getHtml()) {
    editorRef.value.setHtml(html.value)
  }
})

onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})
</script>
<script lang='ts'>
export default {
  name: 'WangEditor'
}
</script>
