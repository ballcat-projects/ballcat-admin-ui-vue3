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
      <a-form-item :label="rawI18nText('i18n.i18nData.code.text')">
        <a-input
          v-model:value="formModel.code"
          :placeholder="rawI18nText('i18n.i18nData.code.tips')"
          disabled
        />
      </a-form-item>
      <a-form-item :label="rawI18nText('i18n.i18nData.languageTag.text')">
        <a-input
          v-model:value="formModel.languageTag"
          :placeholder="rawI18nText('i18n.i18nData.languageTag.tips')"
          disabled
        />
      </a-form-item>
      <a-form-item
        :label="rawI18nText('i18n.i18nData.message.text')"
        v-bind="validateInfos.message"
      >
        <a-input
          v-model:value="formModel.message"
          :placeholder="rawI18nText('i18n.i18nData.message.tips')"
        />
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
import type { I18nData, I18nDataPageVO } from '@/api/i18n/types'
import { updateI18nData } from '@/api/i18n/i18n-data'
import { overrideProperties } from '@/utils/bean-utils'
import { useAdminI18n } from '@/hooks/i18n'

const emits = defineEmits<{
  (e: 'submit-success'): void
}>()

const { title, visible, openModal, closeModal } = useModal('编辑国际化信息')

const { formAction } = useFormAction(FormAction.UPDATE)

const { rawI18nText } = useAdminI18n()

const formModel = reactive<I18nData>({
  code: '',
  languageTag: '',
  message: '',
  remarks: ''
})

// 表单的校验
const formRule = reactive({
  languageTag: [{ required: true, message: rawI18nText('i18n.i18nData.languageTag.tips') }],
  code: [{ required: true, message: rawI18nText('i18n.i18nData.code.tips') }],
  message: [{ required: true, message: rawI18nText('i18n.i18nData.message.tips') }]
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<I18nData> = {
  [FormAction.UPDATE]: updateI18nData
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
  open(record: I18nDataPageVO) {
    openModal()
    resetFields()
    overrideProperties(formModel, record)
  }
})
</script>
