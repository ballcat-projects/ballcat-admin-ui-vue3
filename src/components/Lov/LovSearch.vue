<template>
  <a-card :bordered="false" :body-style="{ paddingBottom: 0 }">
    <a-form ref="formRef" :model="formModel" :label-col="labelCol">
      <a-row :gutter="8">
        <a-col v-for="item in formModel.domains" :key="item.field" :md="8" :sm="16">
          <a-form-item
            :key="item.field"
            :label="item.label"
            :label-col="{ span: 7 }"
            :wrapper-col="{ span: 16 }"
            style="height: 30px"
          >
            <a-input
              v-if="item.type === 'input'"
              v-model:value="item.value"
              :placeholder="rawI18nText(item.placeholder)"
              allow-clear
            />
            <a-input-number
              v-if="item.type === 'number-input'"
              v-model:value="item.value"
              style="width: 100%"
              :placeholder="rawI18nText(item.placeholder)"
              :min="item.min || 1"
              :max="item.max"
              allow-clear
            />
            <a-select
              v-if="item.type === 'select'"
              v-model:value="item.value"
              allow-clear
              :placeholder="rawI18nText(item.placeholder)"
              :options="item.options"
            />
            <dict-select
              v-if="item.type === 'dict-select'"
              v-model:value="item.value"
              :placeholder="rawI18nText(item.placeholder)"
              :dict-code="item.dictCode"
            />
          </a-form-item>
        </a-col>
        <!-- 搜索控制按钮 -->
        <a-col :xs="8" :sm="4" :md="8">
          <search-actions
            :collapsible="false"
            :loading="props.loading"
            @search="search"
            @reset="reset"
          />
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
// @ts-nocheck TODO 优化 Lov 类型

import type { LOV_SEARCH_TYPE_ENUM } from '@/components/Lov/type'
import { useAdminI18n } from '@/hooks/i18n'
export interface Domain {
  field: string
  label: string
  type: LOV_SEARCH_TYPE_ENUM
  placeholder: string
  dictCode?: string
  value?: any
}

export interface LovSearchProps {
  domains?: Domain[]
  loading?: boolean
}

const { rawI18nText } = useAdminI18n()

// 表单 label 全局配置
const labelCol = { md: { span: 6 } }

const props = withDefaults(defineProps<LovSearchProps>(), {
  loading: false
})

const formRef = ref()

const formModel = reactive<{ domains?: Domain[] }>({
  domains: []
})

watchEffect(() => {
  formModel.domains = props.domains
})

const emits = defineEmits<{
  (e: 'search', params: Record<string, any>): void
}>()

const search = () => {
  const searchParams = (formModel.domains || [])
    .filter(item => item.value)
    .reduce((accumulator, value) => {
      return { ...accumulator, [value.field]: value.value }
    }, {})
  emits('search', searchParams)
}

const resetFormField = () => {
  formModel.domains.forEach(item => (item.value = undefined))
}

const reset = () => {
  resetFormField()
  search()
}

defineExpose({
  clearForm() {
    resetFormField()
  }
})
</script>

<script lang="ts">
export default {
  name: 'LovSearch'
}
</script>
<style lang="less" scoped></style>
