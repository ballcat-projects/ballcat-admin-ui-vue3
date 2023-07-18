<template>
  <a-modal :title="title" :visible="visible" :mask-closable="false" :body-style="{ paddingBottom: '8px' }"
    :confirm-loading="submitLoading" :width="450" @ok="handleSubmit" @cancel="handleClose">
    <a-form :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="名称" v-bind="validateInfos.name">
        <a-input v-model:value="formModel.name" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="Key" v-bind="validateInfos.confKey">
        <a-input v-model:value="formModel.confKey" :disabled="isUpdateForm" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="Value" v-bind="validateInfos.confValue">
        <a-input v-model:value="formModel.confValue" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="分类" v-bind="validateInfos.category">
        <a-input v-model:value="formModel.category" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="备注">
        <a-textarea v-model:value="formModel.remarks" :rows="3" placeholder="请输入" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { createConfig, updateConfig } from '@/api/system/config'
import type { SysConfigDTO, SysConfigPageVO } from '@/api/system/config/types'
import type { FormRequestMapping } from '@/hooks/form'
import { FormAction, useAdminForm, useFormAction } from '@/hooks/form'
import { useModal } from '@/hooks/modal'
import { overrideProperties } from '@/utils/bean-utils'
import type { ColProps } from 'ant-design-vue'

const labelCol: ColProps = {
  sm: { span: 24 },
  md: { span: 4 }
}

const wrapperCol: ColProps = {
  sm: { span: 24 },
  md: { span: 19 }
}

const emits = defineEmits<{
  (e: 'submit-success'): void
}>()

const { title, visible, openModal, closeModal } = useModal()

const { formAction, isUpdateForm } = useFormAction()

// 表单模型
const formModel = reactive<SysConfigDTO>({
  id: undefined,
  name: '',
  confKey: '',
  confValue: '',
  category: '',
  remarks: ''
})

// 表单的校验规则
const formRule = reactive({
  name: [{ required: true, message: '请输入配置名称!' }],
  confKey: [{ required: true, message: '请输入 Key!' }],
  confValue: [{ required: true, message: '请输入 Value!' }],
  category: [{ required: true, message: '请输入 分类!' }]
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<SysConfigDTO> = {
  [FormAction.CREATE]: createConfig,
  [FormAction.UPDATE]: updateConfig
}

const { submitLoading, validateAndSubmit, resetFields, validateInfos } = useAdminForm(
  formAction,
  formRequestMapping,
  formModel,
  formRule
)

/* 表单提交处理 */
const handleSubmit = () => {
  const model = { ...formModel }
  validateAndSubmit(model, {
    onSuccess: () => {
      closeModal()
      emits('submit-success')
    }
  })
}

/* 弹窗关闭方法 */
const handleClose = () => {
  closeModal()
  submitLoading.value = false
}

defineExpose({
  open(newFormAction: FormAction, record?: SysConfigPageVO) {
    openModal()
    resetFields()
    if (newFormAction === FormAction.CREATE) {
      title.value = '新建系统配置'
    } else {
      title.value = '编辑系统配置'
      overrideProperties(formModel, record)
    }
    formAction.value = newFormAction
  }
})
</script>
