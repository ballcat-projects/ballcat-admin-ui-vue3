<template>
  <a-tree-select
    v-bind="props"
    v-model:searchValue="searchValue"
    style="width: 100%"
    :tree-data="organizationTree"
    @change="onChange"
  >
    <template #title="{ name }">
      <template v-if="name">
        <template
          v-for="(fragment, i) in name
            .toString()
            .split(new RegExp(`(?<=${searchValue})|(?=${searchValue})`, 'i'))"
        >
          <span
            v-if="fragment.toLowerCase() === searchValue.toLowerCase()"
            :key="i"
            style="color: #08c"
          >
            {{ fragment }}
          </span>
          <template v-else>{{ fragment }}</template>
        </template>
      </template>
    </template>
  </a-tree-select>
</template>

<script setup lang="ts">
import { listToTree } from '@/utils/tree-utils'
import { listOrganizations } from '@/api/system/organization'
import { treeSelectProps } from 'ant-design-vue/es/tree-select'
import { initDefaultProps } from 'ant-design-vue/es/_util/props-util'
import type { SysOrganizationTree } from '@/api/system/organization/types'

type OrganizationTreeSelectValue = number | number[]

const emits = defineEmits<{
  (e: 'update:value', selectedValue: OrganizationTreeSelectValue): void
}>()

const props = defineProps(
  initDefaultProps(treeSelectProps<OrganizationTreeSelectValue, SysOrganizationTree>(), {
    allowClear: true,
    showSearch: true,
    treeNodeFilterProp: 'name',
    fieldNames: { label: 'name', value: 'id' },
    dropdownStyle: { maxHeight: '400px', overflow: 'auto' }
  })
)

const searchValue = ref<string>('')

const organizationTree = ref<SysOrganizationTree[]>()

const onChange = (selectedValue: OrganizationTreeSelectValue) => {
  emits('update:value', selectedValue)
}

watchEffect(() => {
  if (props.treeData) {
    organizationTree.value = props.treeData
    return
  }
  listOrganizations().then(res => {
    organizationTree.value = listToTree<SysOrganizationTree>(res.data as SysOrganizationTree[], 0)
  })
})
</script>
