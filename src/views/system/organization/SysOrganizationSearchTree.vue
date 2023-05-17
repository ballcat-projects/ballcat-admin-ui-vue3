<template>
  <div class="organization-tree-wrapper">
    <a-input-search v-model:value="searchValue" style="margin-bottom: 15px" placeholder="Search" />
    <a-tree
      v-model:selected-keys="selectedKeys"
      v-model:expanded-keys="expandedKeys"
      :block-node="true"
      :tree-data="organizationTree"
      :multiple="true"
      :field-names="{
        title: 'name',
        key: 'id'
      }"
      @select="onSelect"
    >
      <template #title="{ name }">
        <span v-if="name.indexOf(searchValue) > -1">
          {{ name.substring(0, name.indexOf(searchValue)) }}
          <span style="color: #f50">{{ searchValue }}</span>
          {{ name.substring(name.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ name }}</span>
      </template>
    </a-tree>
  </div>
</template>

<script setup lang="ts">
import { listOrganizations } from '@/api/system/organization'
import { listToTree, matchedParentKeys } from '@/utils/tree-utils'
import type { Key } from '@/utils/tree-utils'
import type { SysOrganizationTree } from '@/api/system/organization/types'
import type { DataNode } from 'ant-design-vue/es/tree'

const emits = defineEmits<{
  (e: 'select', selectedKeys: Key[]): void
}>()

const searchValue = ref('')
const selectedKeys = ref<(string | number)[]>([])
const expandedKeys = ref<(string | number)[]>([])

type TreeData = SysOrganizationTree & DataNode

const organizationTree = ref<TreeData[]>([])
listOrganizations().then(res => {
  organizationTree.value = listToTree<TreeData>(res.data as TreeData[], 0)
  // 默认展开一级组织
  expandedKeys.value = organizationTree.value.map(x => x.id)
})

const onSelect = (selectedKeys: Key[]) => {
  emits('select', selectedKeys)
}

watch(searchValue, () => {
  expandedKeys.value = matchedParentKeys(
    organizationTree.value,
    node => node.name.indexOf(searchValue.value) > -1
  )
})
</script>

<style scoped lang="less">
.organization-tree-wrapper {
  overflow: auto;
  padding: 24px 16px;
}

.organization-tree-wrapper::-webkit-scrollbar {
  width: 5px;
  height: 6px;
}

.organization-tree-wrapper::-webkit-scrollbar-thumb {
  background: rgba(31, 31, 31, 0.2);
  border-radius: 3px;
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.05);
}
</style>
