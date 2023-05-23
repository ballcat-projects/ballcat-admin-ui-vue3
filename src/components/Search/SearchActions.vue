<template>
  <a-form-item :wrapper-col="{ flex: '1 1 0' }" class="search-actions-wrapper">
    <a-space size="middle">
      <a-space>
        <!-- 自定义内容位置 -->
        <slot />
        <a-button type="primary" :loading="props.loading" @click="emits('search')">查询</a-button>
        <a-button @click="emits('reset')">重置</a-button>
      </a-space>
      <a v-if="props.collapsible" @click="() => toggleCollapsed()">
        {{ innerCollapsed ? '展开' : '收起' }}
        <DownOutlined v-if="innerCollapsed" />
        <UpOutlined v-else />
      </a>
    </a-space>
  </a-form-item>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    collapsible?: boolean
    collapsed?: boolean
  }>(),
  { loading: false, collapsible: false, collapsed: true }
)

const emits = defineEmits<{
  (e: 'update:collapsed', collapsed: boolean): void
  (e: 'search'): void
  (e: 'reset'): void
}>()

// 双向绑定
const innerCollapsed = useVModel(props, 'collapsed', emits)

const toggleCollapsed = () => {
  innerCollapsed.value = !innerCollapsed.value
}
</script>

<script lang="ts">
export default {
  name: 'SearchActions'
}
</script>

<style scoped></style>
