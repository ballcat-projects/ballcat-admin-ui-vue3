<template>
  <a-dropdown>
    <TranslationOutlined style="font-size: 18px" />

    <template #overlay>
      <a-menu :selected-keys="[language]">
        <a-menu-item v-for="local of locals" :key="local" @click="setLanguage(local as Language)">
          <a href="javascript:;">{{ local }}</a>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { TranslationOutlined } from '@ant-design/icons-vue'
import { useI18n } from 'vue-i18n'
import { useI18nStore } from '@/stores/i18n-store'
import type { Language } from '@/locale'

export default defineComponent({
  name: 'SelctLanguage',
  components: {
    TranslationOutlined
  },
  setup() {
    const { setLanguage } = useI18nStore()
    const { messages } = useI18n()
    const locals = Object.keys(messages.value)

    return {
      locals,
      setLanguage
    }
  },
  computed: {
    language: () => useI18nStore().language
  },
  methods: {}
})
</script>
