<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="props.mode"
    />
    <Editor
      v-model:value="valueHtml"
      :style="editorStyle"
      :default-config="editorConfig"
      :mode="props.mode"
      @onChange="handleUpdate"
      @onCreated="handleCreated"
    />
  </div>
</template>

<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { fileAbsoluteUrl } from '@/utils/file-utils'
import type { InsertFnType, UploadFunction } from '@/components/Editor/types'
import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'

const props = withDefaults(
  defineProps<{
    mode?: string
    height?: number | string
    modelValue?: string
    uploadImgReq: UploadFunction
  }>(),
  {
    mode: 'default',
    height: '300px',
    modelValue: ''
  }
)

const emits = defineEmits(['update:modelValue'])

// 编辑器样式
const editorStyle = reactive({
  height: props.height,
  overflowY: 'auto'
})

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

// 内容 HTML
const valueHtml = ref<string>()

const toolbarConfig: Partial<IToolbarConfig> = {}
const editorConfig: Partial<IEditorConfig> = { placeholder: '请输入内容...', MENU_CONF: {} }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

editorConfig.MENU_CONF!['uploadImage'] = {
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

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
  // 初始赋值
  editorRef.value.setHtml(props.modelValue)
}

const handleUpdate = (editor: IDomEditor) => {
  // @ts-ignore
  emits('update:modelValue', editor.getHtml())
}

watch(
  () => props.modelValue,
  () => {
    valueHtml.value = props.modelValue
    // 需要等待编辑器渲染完成
    if (valueHtml.value !== editorRef.value?.getHtml()) {
      editorRef.value?.setHtml(valueHtml.value)
    }
  }
)
</script>

<script lang="ts">
export default {
  name: 'WangEditor'
}
</script>
