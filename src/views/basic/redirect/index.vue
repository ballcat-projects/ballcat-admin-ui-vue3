<template>
  <div></div>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

// 如果需要被多页签缓存，必须要设置组件名称
defineOptions({ name: 'RedirectView' })

const { currentRoute, replace } = useRouter()
const { params, query } = unref(currentRoute)

const { path } = params
delete params.path

const redirectPath = Array.isArray(path) ? path.join('/') : path

replace({
  path: redirectPath.startsWith('/') ? redirectPath : '/' + redirectPath,
  query,
  params
} as RouteLocationRaw)
</script>
