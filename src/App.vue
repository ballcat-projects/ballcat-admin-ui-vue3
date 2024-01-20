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
import dayjs from 'dayjs'

let antdLocal: Ref<Locale>

if (enableI18n) {
  const i18n = useI18n()
  const i18nStore = useI18nStore()
  antdLocal = computed<Locale>(() => {
    return i18n.getLocaleMessage(i18nStore.language)?.antdLocale as Locale
  })
} else {
  // 未开启国际化，默认使用中文
  const modules = import.meta.glob('@/locales/lang/default-local-import.ts', { eager: true })
  for (const path in modules) {
    // @ts-ignore
    antdLocal = modules[path].default
  }
  dayjs.locale('zh-cn')
}
</script>
