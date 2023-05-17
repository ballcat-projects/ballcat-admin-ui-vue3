<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{ paddingBottom: '8px' }"
    :confirm-loading="submitLoading"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-model:value="formModel.id" />
      </a-form-item>

      <a-form-item label="标识" v-bind="validateInfos.code">
        <a-input v-model:value="formModel.code" placeholder="请输入" :disabled="isUpdateForm" />
      </a-form-item>

      <a-form-item label="名称" v-bind="validateInfos.title">
        <a-input v-model:value="formModel.title" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="数据类型" v-bind="validateInfos.valueType">
        <dict-radio-group v-model:value="formModel.valueType" dict-code="dict_value_type" />
      </a-form-item>

      <a-form-item label="备注">
        <a-textarea
          v-model:value="formModel.remarks"
          placeholder="备注"
          :auto-size="{ minRows: 3, maxRows: 5 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { useModal } from '@/hooks/modal'
import { useAdminForm, useFormAction, FormAction } from '@/hooks/form'
import type { FormRequestMapping } from '@/hooks/form'
import { createDict, updateDict } from '@/api/system/dict'
import type { SysDictDTO, SysDictPageVO } from '@/api/system/dict/types'
import { DictValueTypeEnum } from '@/api/system/dict/types'
import { overrideProperties } from '@/utils/bean-utils'
import type { ColProps } from 'ant-design-vue'

// 表单的标签布局
const labelCol: ColProps = {
  sm: { span: 24 },
  md: { span: 5 }
}
// 表单元素布局
const wrapperCol: ColProps = {
  sm: { span: 24 },
  md: { span: 17 }
}

const emits = defineEmits<{
  (e: 'submit-success'): void
}>()

const { title, visible, openModal, closeModal } = useModal()

const { formAction, isUpdateForm } = useFormAction()

// 表单模型
const formModel = reactive<SysDictDTO>({
  title: '',
  code: '',
  valueType: DictValueTypeEnum.NUMBER,
  remarks: ''
})

// 表单的校验规则
const formRule = reactive({
  title: [{ required: true, message: '请输入字典名称!' }],
  code: [{ required: true, message: '请输入字典标识!' }],
  valueType: [{ required: true, message: '请选择字典数据类型!' }]
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<SysDictDTO> = {
  [FormAction.CREATE]: createDict,
  [FormAction.UPDATE]: updateDict
}

const { submitLoading, validateAndSubmit, resetFields, validateInfos } = useAdminForm(
  formAction,
  formRequestMapping,
  formModel,
  formRule
)

/* 表单提交处理 */
const handleSubmit = () => {
  validateAndSubmit(toRaw(formModel), {
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
  open(newFormAction: FormAction, record?: SysDictPageVO) {
    openModal()
    resetFields()
    if (newFormAction === FormAction.CREATE) {
      title.value = '新建字典'
    } else {
      title.value = '编辑字典'
      overrideProperties(formModel, record)
    }
    formAction.value = newFormAction
  }
})
</script>
