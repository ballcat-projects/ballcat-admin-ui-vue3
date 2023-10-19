<template>
  <a-space :class="isDark ? [$style.right, $style.dark] : $style.right" :size="0" :style="style">
    <!-- 文档跳转 icon -->
    <span :class="$style.action" @click="openDoc">
      <QuestionCircleOutlined />
    </span>
    <!-- 头像下拉框 -->
    <avatar-dropdown />
    <!-- 语言选择框 -->
    <SelectLanguage v-if="enableI18n" :class="$style.action" />
  </a-space>
</template>

<script setup lang="ts">
import { useSettingStore } from '@/stores/setting-store'
import AvatarDropdown from './AvatarDropdown.vue'
import SelectLanguage from '@/components/SelectLanguage/index.vue'
import { enableI18n } from '@/config'

const openDoc = () => {
  window.open('http://www.ballcat.cn')
}

const settingStore = useSettingStore()

const style = computed(() => {
  const { setting } = settingStore
  if (setting.layout === 'top') return {}
  return { marginRight: '-8px' }
})

const isDark = computed(() => {
  const { setting } = settingStore
  return (setting.navTheme === 'dark' && setting.layout === 'top') || setting.layout === 'mix'
})
</script>

<script lang="ts">
export default {
  name: 'RightContent'
}
</script>

<style lang="less" module>
@import './index.less';
</style>
