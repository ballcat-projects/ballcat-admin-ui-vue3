<template>
  <a-row>
    <a-col :md="12" :sm="24" style="margin-bottom: 20px">
      <a-space>
        <a-popover trigger="click" placement="top">
          <template #content>
            <template v-for="tagColor in antdTagColor" :key="tagColor">
              <a-tag :color="tagColor" @click="presetTagColor(tagColor)">{{ tagColor }}</a-tag>
            </template>
          </template>
          <a-tag :color="attributes.tagColor" style="margin: 0 0 0 5px">标签样式</a-tag>
        </a-popover>

        <a-popover trigger="click" placement="right">
          <template #content>
            <sketch v-model="tagColorPicker" @update:model-value="onTagColorPicker" />
          </template>
          <highlight-two-tone />
        </a-popover>

        <delete-two-tone v-if="attributes.tagColor" @click="clearTagColor" />
      </a-space>
    </a-col>

    <a-col :md="12" :sm="24">
      <a-space>
        <span :style="{ marginLeft: '5px', color: attributes.textColor }">文本样式</span>
        <a-popover trigger="click" placement="right">
          <template #content>
            <sketch v-model="textColorPicker" @update:model-value="onTextColorPicker" />
          </template>
          <highlight-two-tone />
        </a-popover>
        <delete-two-tone v-if="attributes.textColor" @click="clearTextColor" />
      </a-space>
    </a-col>
  </a-row>

  <a-row>
    <a-col :sm="24" :md="24">
      <a-space>
        <a-popover trigger="click" placement="top">
          <template #content>
            <template v-for="badgeColor in antdBadgeColor" :key="badgeColor">
              <a-badge
                :color="badgeColor"
                :text="badgeColor"
                style="margin: 0 0 0 5px"
                @click="presetBadgeColor(badgeColor)"
              />
            </template>
          </template>
          <a-badge
            :status="attributes.badgeStatus"
            :color="attributes.badgeColor"
            text="徽标样式"
            style="margin: 0 0 0 5px"
          />
        </a-popover>

        <a-popover trigger="click" placement="right">
          <template #content>
            <sketch v-model="badgeColorPicker" @update:model-value="onBadgeColorPicker" />
          </template>
          <highlight-two-tone />
        </a-popover>

        <delete-two-tone v-if="attributes.badgeColor" @click="clearBadgeColor" />

        <a-select
          v-model:value="attributes.badgeStatus"
          style="width: 125px"
          @change="changeBadgeStatus"
        >
          <a-select-option
            v-for="optionBadgeStatus in antdBadgeStatus"
            :key="optionBadgeStatus"
            :value="optionBadgeStatus"
          >
            <a-badge :status="optionBadgeStatus" :text="optionBadgeStatus" />
          </a-select-option>
        </a-select>
      </a-space>
    </a-col>
  </a-row>

  <!--  <template v-for="language in supportLanguage">-->
  <!--    <a-row>-->
  <!--      <a-input-->
  <!--        :key="language.lang"-->
  <!--        v-model="languagesAttribute[language.lang]"-->
  <!--        :addon-before="language.title"-->
  <!--      />-->
  <!--    </a-row>-->
  <!--  </template>-->
</template>

<script setup lang="ts">
import { Sketch } from '@ckpack/vue-color'
import { DeleteTwoTone, HighlightTwoTone } from '@ant-design/icons-vue'
import type { DictItemAttributes } from '@/api/system/dict/types'
import type { PresetColorType, PresetStatusColorType } from 'ant-design-vue/es/_util/colors'

const antdTagColor = [
  'pink',
  'red',
  'orange',
  'green',
  'cyan',
  'blue',
  'purple'
] as PresetColorType[]
const antdBadgeStatus = [
  'success',
  'processing',
  'default',
  'error',
  'warning'
] as PresetStatusColorType[]
const antdBadgeColor = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime'
]

const props = defineProps<{
  value: DictItemAttributes
}>()

const emits = defineEmits(['update:value'])

const attributes = ref<DictItemAttributes>({})
watch(
  () => props.value,
  () => {
    attributes.value = Object.assign({}, unref(props.value))
    if (!attributes.value.badgeStatus) {
      attributes.value.badgeStatus = 'default'
      emits('update:value', attributes.value)
    }
  },
  { immediate: true }
)

// dict-tag 的拾色器
const tagColorPicker = ''

const presetTagColor = (tagColor: string) => {
  attributes.value.tagColor = tagColor
  emits('update:value', attributes.value)
}
const onTagColorPicker = (tagColorPicker: any) => {
  attributes.value.tagColor = tagColorPicker.hex
  emits('update:value', attributes.value)
}
const clearTagColor = () => {
  attributes.value.tagColor = ''
  emits('update:value', attributes.value)
}

// dict-text 的拾色器
const textColorPicker = ''
const presetBadgeColor = (badgeColor: string) => {
  attributes.value.badgeColor = badgeColor
  emits('update:value', attributes.value)
}
const onBadgeColorPicker = (badgeColorPicker: any) => {
  attributes.value.badgeColor = badgeColorPicker.hex
  emits('update:value', attributes.value)
}
const clearBadgeColor = () => {
  attributes.value.badgeColor = ''
  emits('update:value', attributes.value)
}
const changeBadgeStatus = (value: any) => {
  attributes.value.badgeStatus = value as PresetStatusColorType
  emits('update:value', attributes.value)
}

// dict-badge 的拾色器
const badgeColorPicker = ''
const onTextColorPicker = (textColorPicker: any) => {
  attributes.value.textColor = textColorPicker.hex
  emits('update:value', attributes.value)
}
const clearTextColor = () => {
  attributes.value.textColor = ''
  emits('update:value', attributes.value)
}
</script>
