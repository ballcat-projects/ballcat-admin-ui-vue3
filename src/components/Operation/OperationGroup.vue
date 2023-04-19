<template>
  <a-space>
    <template #split>
      <a-divider type="vertical" style="margin: 0" />
    </template>
    <slot />
  </a-space>
</template>

<script>
export default {
  name: 'OperationGroup'
}
</script>

<style scoped></style>
