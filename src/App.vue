<template>
  <a-config-provider :locale="antdLocal">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n-store'
import { useI18n } from 'vue-i18n'
import { enableI18n } from '@/config'
import type { Locale } from 'ant-design-vue/es/locale-provider'
import type { Ref } from 'vue'

let antdLocal: Ref<Locale>

if (enableI18n) {
  const i18n = useI18n()
  const i18nStore = useI18nStore()
  antdLocal = computed<Locale>(() => {
    return i18n.getLocaleMessage(i18nStore.language)?.antdLocale
  })
}
</script>
