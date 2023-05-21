<template>
  <a-select v-bind="props" :filter-option="filterOption" @change="onChange">
    <a-select-option
      v-for="selectData in selectDataList"
      :key="selectData.value"
      :value="selectData.value"
      :name="selectData.name"
    >
      {{ selectData.name }}
    </a-select-option>
  </a-select>
</template>

<script setup lang="ts">
import { selectProps } from 'ant-design-vue/es/select'
import { initDefaultProps } from 'ant-design-vue/es/_util/props-util'
import { listRoleSelectData } from '@/api/system/role'
import type { SelectData } from '@/api/types'
import type { SelectValue } from 'ant-design-vue/es/select'

defineOptions({ name: 'SysRoleSelect' })

type SelectRoleValue = string | string[] | undefined

const props = defineProps(
  initDefaultProps(selectProps(), {
    placeholder: '请选择角色',
    showSearch: true
  })
)

const emits = defineEmits<{
  (e: 'update:value', selectedValue: SelectRoleValue): void
}>()

const onChange = (selectedValue: SelectValue) => {
  emits('update:value', selectedValue as SelectRoleValue)
}

const filterOption = (input: string, option: any) => {
  return option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
}

const selectDataList = ref<SelectData[]>([])
listRoleSelectData().then(res => {
  selectDataList.value = res.data
})
</script>
