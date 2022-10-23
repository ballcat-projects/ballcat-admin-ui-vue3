<template>
  <a-space direction="vertical">
    <div v-for="language in languageList" :key="language.languageTag">
      <a-input
        v-model:value="language.languageTag"
        placeholder="语言标签"
        style="width: 25%; margin-right: 8px"
        :disabled="true"
      />
      <a-input
        v-model:value="language.message"
        placeholder="文本值"
        style="width: 60%; margin-right: 8px"
      />
      <a-icon
        v-if="languageList.length > 1"
        class="dynamic-delete-button"
        type="minus-circle-o"
        :disabled="languageList.length === 1"
        @click="() => remove(language)"
      />
    </div>
    <a-popover trigger="click">
      <template #content>
        <a-transfer
          :row-key="transferKey"
          :data-source="allLanguageList"
          :render="transferKey"
          :titles="['Source', 'Target']"
          :target-keys="langTags"
          :lazy="false"
          @change="langTagChange"
        />
      </template>
      <a-button type="dashed" style="width: 60%">
        <a-icon type="plus" />
        Add field
      </a-button>
    </a-popover>
  </a-space>
</template>

<script setup lang="ts">
import type { LanguageTexts } from '@/api/i18n/types'
import projectConfig from '@/config/projectConfig'

interface Language {
  languageTag: string
  message: string
}

const { supportLanguage } = projectConfig
const supportLanguageTags = Object.keys(supportLanguage)

const langTags = ref<string[]>([])
const allLanguageList = ref<Language[]>([])
const languageList = ref<Language[]>([])

watch(langTags, () => {
  languageList.value = allLanguageList.value.filter(
    x => langTags.value.findIndex(key => key === x.languageTag) !== -1
  )
})

onMounted(() => {
  allLanguageList.value = supportLanguageTags.map(languageTag => {
    return {
      languageTag,
      message: ''
    }
  })
  langTags.value = [...supportLanguageTags]
})

const langTagChange = (nextTargetKeys: string[]) => {
  langTags.value = nextTargetKeys
}

const transferKey = (item: LanguageTexts) => item.languageTag

const remove = (language: Language) => {
  const index = langTags.value.findIndex(key => key === language.languageTag)
  langTags.value.splice(index, 1)
}

defineExpose({
  data: languageList,
  resetData() {
    const allLanguageListData = supportLanguageTags.map(languageTag => {
      return {
        languageTag,
        message: ''
      }
    })
    allLanguageList.value = allLanguageListData
    langTags.value = [...supportLanguageTags]
  }
})
</script>
