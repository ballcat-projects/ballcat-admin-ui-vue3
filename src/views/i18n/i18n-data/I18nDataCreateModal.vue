<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{ paddingBottom: '8px' }"
    :confirm-loading="submitLoading"
    :width="600"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item :label="rawI18nText('i18n.i18nData.code.text')" v-bind="validateInfos.code">
        <a-input
          v-model:value="formModel.code"
          :placeholder="rawI18nText('i18n.i18nData.code.tips')"
        />
      </a-form-item>

      <a-form-item :label="rawI18nText('i18n.i18nData.languageTexts')">
        <language-text ref="languageTextRef" />
      </a-form-item>

      <a-form-item :label="rawI18nText('common.remarks')">
        <a-textarea
          v-model:value="formModel.remarks"
          :placeholder="rawI18nText('message.pleaseEnter')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { FormAction, labelCol, wrapperCol, useAdminForm, useFormAction } from '@/hooks/form'
import type { FormRequestMapping } from '@/hooks/form'
import { useModal } from '@/hooks/modal'
import type { I18nDataDTO } from '@/api/i18n/types'
import { createI18nData } from '@/api/i18n/i18n-data'
import LanguageText from '../LanguageText.vue'
import { useAdminI18n } from '@/hooks/i18n'

const { rawI18nText } = useAdminI18n()

const emits = defineEmits<{
  (e: 'submit-success'): void
}>()

const { title, visible, openModal, closeModal } = useModal('新建国际化信息')

const { formAction } = useFormAction(FormAction.CREATE)

const languageTextRef = ref()

const formModel = reactive<I18nDataDTO>({
  languageTexts: [],
  code: '',
  remarks: ''
})

// 表单的校验
const formRule = reactive({
  languageTag: [{ required: true, message: rawI18nText('i18n.i18nData.languageTag.tips') }],
  code: [{ required: true, message: rawI18nText('i18n.i18nData.code.tips') }]
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<I18nDataDTO> = {
  [FormAction.CREATE]: createI18nData
}

const { submitLoading, validateAndSubmit, resetFields, validateInfos } = useAdminForm(
  formAction,
  formRequestMapping,
  formModel,
  formRule
)

/* 表单提交处理 */
const handleSubmit = () => {
  const data = toRaw(formModel)
  data.languageTexts = languageTextRef.value?.data()
  validateAndSubmit(data, {
    onSuccess: () => {
      closeModal()
      emits('submit-success')
    }
  })
}

/** 弹窗关闭方法 */
const handleClose = () => {
  closeModal()
  submitLoading.value = false
}

defineExpose({
  open() {
    openModal()
    resetFields()
  }
})
</script>
