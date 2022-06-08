<template>
  <component :is="iconComponent"></component>
</template>

<script setup lang="ts">
// TODO 图标按需加载
import * as AntIcons from '@ant-design/icons-vue'

const props = defineProps<{
  type: string
}>()

// eslint-disable-next-line vue/no-setup-props-destructure
let iconType = props.type
iconType = iconType
  .replace(/-([a-z])/g, (p, m) => m.toUpperCase())
  .replace(/^\S/, s => s.toUpperCase())

if (!iconType.endsWith('Outlined')) {
  iconType = iconType + 'Outlined'
}

// @ts-ignore
const antIcon = AntIcons[iconType]

const iconComponent = antIcon ? antIcon : props.type
</script>

<script lang="ts">
export default {
  name: 'AntIcon'
}
</script>
