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
      <minus-circle-outlined
        v-if="languageList.length > 1"
        class="dynamic-delete-button"
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
        <PlusOutlined />
        Add field
      </a-button>
    </a-popover>
  </a-space>
</template>

<script setup lang="ts">
import type { LanguageText } from '@/api/i18n/types'
import { supportLanguage } from '@/config'

const supportLanguageTags = Object.keys(supportLanguage)

const langTags = ref<string[]>([])
const allLanguageList = ref<LanguageText[]>([])
const languageList = ref<LanguageText[]>([])

watch(langTags.value, () => {
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

const transferKey = (item: LanguageText) => item.languageTag

const remove = (language: LanguageText) => {
  const index = langTags.value.findIndex(key => key === language.languageTag)
  langTags.value.splice(index, 1)
}

defineExpose({
  data: languageList,
  resetData() {
    allLanguageList.value = supportLanguageTags.map(languageTag => {
      return {
        languageTag,
        message: ''
      }
    })
    langTags.value = [...supportLanguageTags]
  }
})
</script>

<style scoped lang="less">
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}

.dynamic-delete-button:hover {
  color: #777;
}

.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
