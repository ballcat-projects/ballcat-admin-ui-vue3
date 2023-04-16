<template>
  <a-config-provider :locale="antdLocal">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n-store'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const i18nStore = useI18nStore()
const antdLocal = computed(() => {
  return i18n.getLocaleMessage(i18nStore.language)?.antdLocale ?? {}
})
</script>
