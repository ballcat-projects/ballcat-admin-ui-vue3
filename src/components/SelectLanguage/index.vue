<template>
  <a-dropdown>
    <TranslationOutlined style="font-size: 18px" />

    <template #overlay>
      <a-menu :selected-keys="[i18nStore.language]">
        <a-menu-item
          v-for="local of availableLocales"
          :key="local"
          @click="loadLanguageAsync(local)"
        >
          <a href="javascript:;">{{ local }}</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup lang="ts">
import { TranslationOutlined } from '@ant-design/icons-vue'
import { useI18nStore } from '@/stores/i18n-store'
import { availableLocales, loadLanguageAsync } from '@/locales'

const i18nStore = useI18nStore()
</script>

<script lang="ts">
export default {
  name: 'SelectLanguage'
}
</script>
