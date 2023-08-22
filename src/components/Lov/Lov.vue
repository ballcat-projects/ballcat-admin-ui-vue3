<template>
  <div>
    <a-spin :spinning="loading" size="small" style="width: 100%">
      <div @click="showModal">
        <a-select
          ref="select"
          v-model:value="selectedValue"
          class="lov-select"
          style="width: 100%"
          :open="false"
          :allow-clear="true"
          :show-arrow="true"
          :mode="multiple ? 'tags' : 'default'"
          :disabled="disabled"
          :placeholder="enableI18n ? i18nText(placeholder | '') : placeholder"
          :options="selectOptions"
          :filter-option="false"
          :show-search="false"
          @change="handleChange"
        >
          <template #suffixIcon>
            <AntIcon type="ellipsis" />
          </template>
        </a-select>
      </div>
    </a-spin>

    <lov-modal
      ref="lovModalRef"
      :multiple="multiple"
      :custom-option-title="localCustomOptionTitle"
      :modal-title="modalTitle!"
      :modal-width="modalWidth"
      :search-options="searchOptions"
      :data-key="dataKey"
      :get-page-data="getPageData"
      :table-columns="tableColumns"
      :table-size="tableSize"
      @lov-choose="handleLovChoose"
    />
  </div>
</template>
<script lang="ts">
export default {
  name: 'LovLocal'
}
</script>
<script lang="ts" setup>
// @ts-nocheck TODO 优化 Lov 类型

import { LovModal } from '@/components/Lov'
import AntIcon from '#/layout/components/AntIcon'
import type { ApiResult } from '@/api/types'
import type { ProColumns } from '#/table'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { Domain } from '@/components/Lov/LovSearch.vue'
import { useAdminI18n } from '@/hooks/i18n'

// import { enableI18n } from '@/config/projectConfig'
const { i18nText } = useAdminI18n()
const enableI18n = ref<boolean>(false)

const props = withDefaults(defineProps<LovProps>(), {
  modelValue: undefined,
  isNumberValue: false,
  multiple: false,
  disabled: false,
  placeholder: '',
  customOptionTitle: undefined,
  modalTitle: '',
  modalWidth: '600px',
  searchOptions: undefined,
  tableSize: 'middle'
})

const loading = ref<boolean>(false)
const selectedRows = ref<Record<string, any>>([])
const selectedValue = ref<Key[] | Key>()

const lovModalRef = ref()

const localCustomOptionTitle = computed(() => {
  return props.customOptionTitle ? props.customOptionTitle : record => record[props.dataKey]
})

function convertValue(value) {
  let selected = value
  if (props.isNumberValue && value) {
    if (props.multiple) {
      selected = value.map(x => x.toString())
    } else {
      selected = String(value)
    }
  }
  return selected
}

const selectOptions = computed(() => {
  return selectedRows.value.map(x => {
    return {
      value: x[props.dataKey],
      label: props.customOptionTitle(x)
    }
  })
})

onMounted(() => {
  // 禁止 select 框输入
  const element = document.querySelector('.lov-select .ant-select-selection-search-input')
  element && (element['readOnly'] = true)
})

// 监听以便同步修改选中值
watch(
  () => props.modelValue,
  () => {
    selectedValue.value = convertValue(props.modelValue)
  },
  { immediate: true }
)

function convertSelectedValue(selectedValue) {
  let value = selectedValue
  if (props.isNumberValue && selectedValue) {
    if (props.multiple) {
      value = selectedValue.map(x => Number(x))
    } else {
      value = Number(selectedValue)
    }
  }
  return value
}

const emits = defineEmits<{
  // (e: 'change', value: string): void
  (e: 'update:modelValue', value: string): void
  (e: 'rowChange', value: object): void
}>()

function emitValue({ selectedValue, selectedRows }) {
  const value = convertSelectedValue(selectedValue)
  // v-decorator 方式的表单值联动
  // emits('change', value)
  // v-model 方式的表单值联动
  emits('update:modelValue', value)
  // 值修改时，对应选择的 Rows 也发射出去
  emits('rowChange', props.multiple ? selectedRows : selectedRows[0])
}

function showModal() {
  lovModalRef.value.open(selectedValue.value, selectedRows.value)
}

/**
 * select 框删除 tag，clear 都会触发
 */
function handleChange(selectedValue) {
  let newSelectedRows = []
  let newSelectedValue = undefined
  if (props.multiple) {
    // 只保留包含的
    newSelectedRows = selectedRows.value.filter(row => selectedValue.includes(row[props.dataKey]))
  } else {
    newSelectedRows = selectedRows.value.filter(row => selectedValue === row[props.dataKey])
  }

  // 剔除掉无效的输入值
  if (newSelectedRows.length > 0) {
    newSelectedValue = selectedValue.filter(
      value => newSelectedRows.findIndex(row => row[props.dataKey] === value) !== -1
    )
  }

  // 更新
  handleLovChoose({
    selectedValue: newSelectedValue,
    selectedRows: newSelectedRows
  })
}

/**
 * modal 确认选择时，或者 select 框属性变更时
 * @param data
 */
function handleLovChoose(data) {
  selectedValue.value = data.selectedValue
  selectedRows.value = data.selectedRows
  emitValue(data)
}

interface LovProps<T = Record<string, any>, R = Record<string, any>> {
  modelValue?: string | number | Key[]
  // 值是否是数字类型
  isNumberValue?: boolean
  // 是否禁用
  disabled?: boolean
  // 提示占位符
  placeholder?: string

  // 是否多选
  multiple?: boolean

  // 表格数据唯一值对应的属性名
  dataKey: string

  // 自定义选择项的展示标题(obj:object) => void
  customOptionTitle?: (raw: R) => string

  // 弹出框的标题
  modalTitle?: string

  // 弹出框的宽度
  modalWidth?: string

  // 搜索组件
  searchOptions?: Domain[]

  // 表格分页查询条件
  getPageData: (params: T) => Promise<ApiResult<R>>

  // 表格列配置
  tableColumns: ProColumns[]

  // 表格大小
  tableSize?: string
}
</script>
