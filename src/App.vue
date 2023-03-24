<template>
  <a-config-provider :locale="antdLocal">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
import { useI18nStore } from '@/stores/i18n-store'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import enUS from 'ant-design-vue/es/locale/en_US'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
import { useI18n } from 'vue-i18n'
import type { Language } from '@/locale'
import { setT } from '@/utils/i18n-utils'

const antdLocalDict = {
  'zh-CN': zhCN,
  'en-US': enUS
}

const i18nStore = useI18nStore()
const { t, locale } = useI18n()
setT(t)
const setLocal = (newLanguage: Language) => {
  locale.value = newLanguage
  dayjs.locale(newLanguage)
}

setLocal(i18nStore.language)

watch(
  () => i18nStore.language,
  nv => {
    setLocal(nv)
  }
)

const antdLocal = computed(() => {
  return antdLocalDict[i18nStore.language]
})
</script>
