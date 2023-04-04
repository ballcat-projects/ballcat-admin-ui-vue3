<template>
  <div :class="prefixCls">
    <a-tabs v-model:active-key="currentTab">
      <a-tab-pane v-for="v in iconGroups" :key="v.key" :tab="v.title">
        <ul>
          <li
            v-for="(icon, index) in v.icons"
            :key="`${v.key}-${index}`"
            :class="{ active: selectedIcon === icon }"
            @click="handleSelectedIcon(icon)"
          >
            <AntIcon :type="icon" :style="{ fontSize: '36px' }" />
          </li>
        </ul>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script lang="ts" setup>
import IconGroups from './icons'
import AntIcon from '#/layout/components/AntIcon/index'
import type { Icon, IconGroup } from '@/components/IconSelector/types'

const props = withDefaults(
  defineProps<{
    prefixCls?: string
    value?: Icon
  }>(),
  { prefixCls: 'ant-pro-icon-selector', value: '' }
)

const iconGroups = IconGroups as IconGroup[]

const emit = defineEmits(['update:value'])

const selectedIcon = ref<string | undefined>(props.value || '')
const currentTab = ref('directional')

const autoSwitchTab = () => {
  if (selectedIcon.value === '') {
    currentTab.value = 'directional'
  }
  iconGroups.some(
    item => item.icons.some(icon => icon === props.value) && (currentTab.value = item.key)
  )
}

watch(
  () => props.value,
  (value, oldValue, onCleanup) => {
    selectedIcon.value = value
    autoSwitchTab()
  }
)

const handleSelectedIcon = (icon: Icon) => {
  selectedIcon.value = icon
  autoSwitchTab()
  emit('update:value', icon)
}
// const handleTabChange = (activeKey: string) => {
//   currentTab.value = activeKey
// }

onMounted(() => {
  if (props.value) {
    autoSwitchTab()
  }
})
</script>

<script lang="ts">
export default {
  name: 'IconSelect'
}
</script>

<style lang="less" scoped>
@import (reference) 'ant-design-vue/es/style/themes/default.less';

ul {
  list-style: none;
  padding: 0;
  overflow-y: scroll;
  height: 250px;

  li {
    display: inline-block;
    padding: @padding-sm;
    margin: 3px 0;
    border-radius: @border-radius-base;

    &:hover,
    &.active {
      // box-shadow: 0px 0px 5px 2px @primary-color;
      cursor: pointer;
      color: @white;
      background-color: @primary-color;
    }
  }
}
</style>
