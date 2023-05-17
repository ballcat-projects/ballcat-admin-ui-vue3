<template>
  <a-form :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
    <a-form-item v-if="isUpdateForm" style="display: none">
      <a-input v-model:value="formModel.id" />
    </a-form-item>

    <a-form-item label="字典标识" v-bind="validateInfos.dictCode">
      <a-input v-model:value="formModel.dictCode" :disabled="true" />
    </a-form-item>

    <a-form-item label="文本值" v-bind="validateInfos.name">
      <a-input v-model:value="formModel.name" placeholder="请输入" />
    </a-form-item>

    <a-form-item label="数据值" v-bind="validateInfos.value">
      <a-input
        v-model:value="formModel.value"
        placeholder="请输入数据值，注意：提交后不可修改"
        :disabled="isUpdateForm"
      />
    </a-form-item>

    <a-form-item label="属性数据">
      <dic-item-attributes-editor v-model:value="formModel.attributes" />
    </a-form-item>

    <a-form-item v-bind="validateInfos.sort">
      <template #label>
        <span>
          排序
          <a-tooltip title="升序，数值越小优先级越高"> <exclamation-circle-outlined /> </a-tooltip>
        </span>
      </template>
      <a-input-number
        v-model:value="formModel.sort"
        placeholder="排序（升序）"
        :min="0"
        style="width: 70%"
      />
    </a-form-item>

    <a-form-item label="备注">
      <a-textarea v-model:value="formModel.remarks" :auto-size="{ minRows: 3, maxRows: 5 }" />
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 10 }">
      <a-button type="primary" :loading="submitLoading" @click="handleSubmit">提交</a-button>
      <a-button style="margin-left: 8px" @click="showTable">取消</a-button>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
import { useAdminForm, useFormAction, FormAction } from '@/hooks/form'
import type { FormRequestMapping } from '@/hooks/form'
import { createDictItem, updateDictItem } from '@/api/system/dict'
import type { DictItemAttributes, SysDictItemDTO, SysDictItemPageVO } from '@/api/system/dict/types'
import { DictItemStatus } from '@/api/system/dict/types'
import { overrideProperties } from '@/utils/bean-utils'
import type { ColProps } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import DicItemAttributesEditor from '@/views/system/dict/DicItemAttributesEditor.vue'

const labelCol: ColProps = {
  sm: { span: 24 },
  md: { span: 6 }
}
const wrapperCol: ColProps = {
  sm: { span: 24 },
  md: { span: 12 }
}

const emits = defineEmits<{
  (e: 'submit-success'): void
  (e: 'show-table'): void
}>()

const { formAction, isUpdateForm } = useFormAction()

// 表单模型
const formModel = reactive<SysDictItemDTO & { attributes: DictItemAttributes }>({
  id: undefined,
  dictCode: '',
  value: '',
  name: '',
  status: DictItemStatus.ENABLED,
  attributes: {},
  sort: 1,
  remarks: ''
})

// 表单的校验规则
const formRule = reactive({
  dictCode: [{ required: true, message: '字典标识不能为空！' }],
  name: [{ required: true, message: '请输入文本值!' }],
  value: [{ required: true, message: '请输入数据值!' }],
  sort: [
    { required: true, message: '请输入排序值!' },
    { type: 'number', min: 0, message: '排序值不能小于 0 !' }
  ]
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<SysDictItemDTO> = {
  [FormAction.CREATE]: createDictItem,
  [FormAction.UPDATE]: updateDictItem
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
      emits('submit-success')
      showTable()
    }
  })
}

const showTable = () => {
  emits('show-table')
}

defineExpose({
  create(dictCode: string) {
    formAction.value = FormAction.CREATE
    resetFields()
    formModel.dictCode = dictCode
  },
  update(record?: SysDictItemPageVO) {
    formAction.value = FormAction.UPDATE
    resetFields()
    overrideProperties(formModel, record)
  }
})
</script>
