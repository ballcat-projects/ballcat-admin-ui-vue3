<template>
  <a-card :bordered="false" style="margin-bottom: 16px" :body-style="{ paddingBottom: 0 }">
    <a-form :model="formModel" :label-col="labelCol">
      <a-row :gutter="16">
        <a-col :md="8" :sm="24">
          <a-form-item label="标题">
            <a-input v-model:value="formModel.title" placeholder="支持模糊查询" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="接收人范围">
            <dict-select
              v-model:value="formModel.recipientFilterType"
              dict-code="recipient_filter_type"
              allow-clear
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
        <a-col :xl="8" :md="12" :sm="24">
          <search-actions :loading="props.loading" @search="search" @reset="reset" />
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { DictSelect } from '@/components/Dict'
import type { AnnouncementQO } from '@/api/notify/announcement/types'
import { Form } from 'ant-design-vue'

const useForm = Form.useForm

// 表单 label 全局配置
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

// const [searchCollapsed, toggleSearchCollapsed] = useToggle(true)

const formModel = reactive<AnnouncementQO>({
  title: undefined,
  recipientFilterType: undefined
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
