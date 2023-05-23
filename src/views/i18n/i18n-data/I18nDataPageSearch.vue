<template>
  <a-card :bordered="false" style="margin-bottom: 16px" :body-style="{ paddingBottom: 0 }">
    <a-form :model="formModel" :label-col="labelCol">
      <a-row :gutter="16">
        <a-col :xl="6" :md="12" :sm="24">
          <a-form-item label="国际化标识">
            <a-input v-model:value="formModel.code" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :xl="6" :md="12" :sm="24">
          <a-form-item label="文本值">
            <a-input v-model:value="formModel.message" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :xl="6" :md="12" :sm="24">
          <a-form-item label="语言标签">
            <a-input v-model:value="formModel.languageTag" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :xl="6" :md="12" :sm="24">
          <SearchActions :loading="props.loading" @search="search" @reset="reset" />
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
import type { I18nDataQO } from '@/api/i18n/types'
import { Form } from 'ant-design-vue'
const { useForm } = Form

const labelCol = { md: { span: 6 } }

const props = withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  { loading: false }
)

const emits = defineEmits<{
  (e: 'search', params: Record<string, any>): void
}>()

const formModel = reactive<I18nDataQO>({
  code: '',
  message: '',
  languageTag: ''
})

const { resetFields } = useForm(formModel)

const search = () => {
  emits('search', toRaw(formModel))
}

const reset = () => {
  resetFields()
  search()
}
</script>
