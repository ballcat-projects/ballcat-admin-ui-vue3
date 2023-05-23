<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{ paddingBottom: '8px' }"
    :confirm-loading="submitLoading"
    :width="650"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-row>
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item v-if="isUpdateForm" style="display: none">
            <a-input v-model:value="formModel.userId" />
          </a-form-item>

          <a-form-item label="用户名" v-bind="validateInfos.username">
            <a-input v-model:value="formModel.username" placeholder="请输入" />
          </a-form-item>

          <a-form-item v-if="isCreateForm" label="密码" v-bind="validateInfos.pass">
            <a-input-password v-model:value="formModel.pass" placeholder="请输入" />
          </a-form-item>

          <a-form-item label="昵称" v-bind="validateInfos.nickname">
            <a-input v-model:value="formModel.nickname" placeholder="请输入" />
          </a-form-item>

          <a-form-item label="组织">
            <sys-organization-tree-select
              v-model:value="formModel.organizationId"
              placeholder="请选择"
            />
          </a-form-item>

          <a-form-item label="状态">
            <dict-radio-group v-model:value="formModel.status" dict-code="user_status" />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item label="性别">
            <dict-select v-model:value="formModel.gender" dict-code="gender" />
          </a-form-item>

          <a-form-item label="电话">
            <a-input v-model:value="formModel.phoneNumber" placeholder="请输入" />
          </a-form-item>

          <a-form-item label="邮箱">
            <a-input v-model:value="formModel.email" placeholder="请输入" />
          </a-form-item>

          <a-form-item v-if="isCreateForm" label="角色">
            <sys-role-select
              v-model:value="formModel.roleCodes"
              mode="multiple"
              allow-clear
              placeholder="请选择"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import SysRoleSelect from '../role/SysRoleSelect.vue'
import SysOrganizationTreeSelect from '../organization/SysOrganizationTreeSelect.vue'
import type { SysUserDTO, SysUserPageVO } from '@/api/system/user/types'
import { overrideProperties } from '@/utils/bean-utils'
import { createUser, updateUser } from '@/api/system/user'
import { passEncrypt } from '@/utils/password-utils'
import { useAdminForm, useFormAction, FormAction, labelCol, wrapperCol } from '@/hooks/form'
import type { FormRequestMapping } from '@/hooks/form'
import { useModal } from '@/hooks/modal'

const emits = defineEmits<{
  (e: 'submit-success'): void
}>()

const { title, visible, openModal, closeModal } = useModal()

const { formAction, isCreateForm, isUpdateForm } = useFormAction()

// 表单模型
const formModel = reactive<SysUserDTO>({
  userId: undefined,
  username: '',
  pass: '',
  nickname: '',
  organizationId: 0,
  status: 1,
  gender: 1,
  phoneNumber: '',
  email: '',
  roleCodes: []
})

// 表单校验规则
const formRule = reactive({
  username: [{ required: true, message: '请输入用户名!' }],
  pass: [{ required: isCreateForm, message: '请输入密码!' }],
  nickname: [{ required: true, message: '请输入昵称!' }]
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<SysUserDTO> = {
  [FormAction.CREATE]: createUser,
  [FormAction.UPDATE]: updateUser
}

const { submitLoading, validateAndSubmit, resetFields, validateInfos } = useAdminForm(
  formAction,
  formRequestMapping,
  formModel,
  formRule
)

/* 表单提交处理 */
const handleSubmit = () => {
  validateAndSubmit(
    {
      ...formModel,
      pass: passEncrypt(formModel.pass)
    },
    {
      onSuccess: () => {
        closeModal()
        emits('submit-success')
      }
    }
  )
}

/* 弹窗关闭方法 */
const handleClose = () => {
  closeModal()
  submitLoading.value = false
}

defineExpose({
  open(newFormAction: FormAction, record?: SysUserPageVO) {
    openModal()
    resetFields()
    if (newFormAction === FormAction.CREATE) {
      title.value = '新建用户'
    } else {
      title.value = '编辑用户'
      overrideProperties(formModel, record)
    }
    formAction.value = newFormAction
  }
})
</script>
