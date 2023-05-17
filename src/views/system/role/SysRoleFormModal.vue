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

      <a-form-item label="角色名" v-bind="validateInfos.name">
        <a-input v-model:value="formModel.name" placeholder="请输入" />
      </a-form-item>

      <a-form-item label="角色标识" v-bind="validateInfos.code">
        <a-input
          v-model:value="formModel.code"
          :disabled="isUpdateForm"
          placeholder="角色标识必须以ROLE_开头!"
        />
      </a-form-item>

      <a-form-item label="角色类型" v-bind="validateInfos.type">
        <dict-radio-group
          v-model:value="formModel.type"
          :disabled="isUpdateForm"
          type="button"
          dict-code="role_type"
        />
      </a-form-item>

      <a-form-item label="数据权限" v-bind="validateInfos.scopeType">
        <a-select v-model:value="formModel.scopeType">
          <a-select-option :value="0">全部</a-select-option>
          <a-select-option :value="1">个人</a-select-option>
          <a-select-option :value="2">本人及子级</a-select-option>
          <a-select-option :value="3">本级</a-select-option>
          <a-select-option :value="4">本级及子级</a-select-option>
          <a-select-option :value="5">自定义</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item v-if="isCustomScopeType" label="数据范围" v-bind="validateInfos.scopeResources">
        <sys-organization-tree-select
          v-model:value="formModel.scopeResourceList"
          :multiple="true"
        />
      </a-form-item>

      <a-form-item label="备注">
        <a-textarea
          v-model:value="formModel.remarks"
          :auto-size="{ minRows: 4, maxRows: 8 }"
          placeholder="备注信息"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import SysOrganizationTreeSelect from '../organization/SysOrganizationTreeSelect.vue'
import { useModal } from '@/hooks/modal'
import { useAdminForm, useFormAction, FormAction, labelCol, wrapperCol } from '@/hooks/form'
import type { FormRequestMapping } from '@/hooks/form'
import { overrideProperties } from '@/utils/bean-utils'
import type { Rule } from 'ant-design-vue/es/form'
import { createRole, updateRole } from '@/api/system/role'
import type { SysRoleDTO, SysRolePageVO } from '@/api/system/role/types'

const emits = defineEmits<{
  (e: 'submit-success'): void
}>()

const { title, visible, openModal, closeModal } = useModal()

const { formAction, isUpdateForm } = useFormAction()

/** 校验密码 */
const validateCode = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入角色标识！')
  } else {
    if (value.indexOf('ROLE_') !== 0) {
      return Promise.reject('角色标识必须以ROLE_开头！')
    }
    return Promise.resolve()
  }
}

// 表单模型
const formModel = reactive<SysRoleDTO & { scopeResourceList?: number[] }>({
  id: undefined,
  name: '',
  code: '',
  type: 1,
  scopeType: 1,
  scopeResources: undefined,
  remarks: '',

  scopeResourceList: []
})

// 是否是自定义的数据权限类型
const isCustomScopeType = computed(() => formModel.scopeType === 5)

// 表单的校验规则
const formRule = reactive({
  name: [{ required: true, message: '请输入角色名!' }],
  code: [{ validator: validateCode }],
  type: [{ required: true, message: '请选择角色类型!' }],
  scopeType: [{ required: true, message: '请选择数据权限!' }],
  scopeResources: [{ required: isCustomScopeType, message: '请选择权限范围！' }]
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<SysRoleDTO> = {
  [FormAction.CREATE]: createRole,
  [FormAction.UPDATE]: updateRole
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
  model.scopeResources = model.scopeResourceList?.join(',')
  delete model.scopeResourceList
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
  open(newFormAction: FormAction, record?: SysRolePageVO) {
    openModal()
    resetFields()
    if (newFormAction === FormAction.CREATE) {
      title.value = '新建角色'
    } else {
      title.value = '编辑角色'
      overrideProperties(formModel, record)
      formModel.scopeResourceList = record?.scopeResources?.split(',').map(Number)
    }
    formAction.value = newFormAction
  }
})
</script>
