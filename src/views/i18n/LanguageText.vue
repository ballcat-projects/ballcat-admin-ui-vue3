<template>
  <div v-for="language in languageList" :key="language.languageTag" style="margin-bottom: 8px">
    <template v-if="targetLangTags.includes(language.languageTag)">
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
      <span
        v-if="targetLangTags.length > 1"
        class="dynamic-delete-button"
        @click="() => remove(language)"
      >
        <MinusCircleOutlined />
      </span>
    </template>
  </div>
  <a-popover trigger="click" style="width: 100%">
    <template #content>
      <a-transfer
        :target-keys="targetLangTags"
        :data-source="transferDataSource"
        :render="(item: TransferItem) => item.title"
        :titles="['Source', 'Target']"
        :lazy="false"
        @change="handleChange"
      />
    </template>
    <a-button type="dashed" style="width: 100%">
      <PlusOutlined />
      Add field
    </a-button>
  </a-popover>
</template>

<script setup lang="ts">
import type { LanguageText } from '@/api/i18n/types'
import { supportLanguage } from '@/config'
import type { TransferItem } from 'ant-design-vue/es/transfer'

// 支持的语言 tags
const supportLanguageTags = Object.keys(supportLanguage)

// 语言选择的传输框数据
const transferItems = supportLanguageTags.map(x => {
  const languageInfo = supportLanguage[x]
  return { key: x, title: `${languageInfo.title} (${languageInfo.lang})` }
})

const transferDataSource = ref<TransferItem[]>(transferItems)

// 选中的目标语言 tags
const targetLangTags = ref<string[]>([])
// 语言文本列表
const languageList = ref<LanguageText[]>([])

function remove(language: LanguageText) {
  const index = targetLangTags.value.findIndex(key => key === language.languageTag)
  targetLangTags.value.splice(index, 1)
}

function handleChange(nextTargetKeys: string[]) {
  targetLangTags.value = nextTargetKeys
}

function initData() {
  targetLangTags.value = [...supportLanguageTags]
  languageList.value = supportLanguageTags.map(x => {
    return { languageTag: x, message: '' }
  })
}

// 初始化数据
initData()

defineExpose({
  data: () => languageList.value.filter(x => targetLangTags.value.includes(x.languageTag)),
  reset: () => initData()
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
</style>
