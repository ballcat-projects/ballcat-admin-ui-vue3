<template>
  <a-select show-search v-bind="props" :filter-option="filterOption" @update:value="onChange">
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
import type { SelectProps } from 'ant-design-vue'
import { listRoleSelectData } from '@/api/system/role'
import type { SelectData } from '@/api/types'
import type { SelectValue } from 'ant-design-vue/es/select'

type SelectRoleValue = string | string[] | undefined

interface RoleSelectProps extends Omit<SelectProps, 'value'> {
  value?: SelectRoleValue
}

const props = withDefaults(defineProps<RoleSelectProps>(), {
  value: undefined,
  placeholder: '请选择角色'
})

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

<script lang="ts">
export default {
  name: 'SysRoleSelect'
}
</script>

<style scoped></style>
