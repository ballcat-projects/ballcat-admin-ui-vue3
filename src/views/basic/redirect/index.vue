<template>
  <div></div>
</template>

<script setup lang="ts">
const { currentRoute, replace } = useRouter()
const { params, query } = unref(currentRoute)

const { path } = params
delete params.path

const redirectPath = Array.isArray(path) ? path.join('/') : path

replace({
  path: redirectPath.startsWith('/') ? redirectPath : '/' + redirectPath,
  query,
  params
})
</script>

<script lang="ts">
export default {
  name: 'RedirectView'
}
</script>
