<template>
  <a-modal
    title="授权"
    :visible="visible"
    :confirm-loading="submitLoading"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="用户名">
        <a-input v-model:value="formModel.username" disabled placeholder="用户名" />
      </a-form-item>
      <a-form-item label="角色">
        <a-spin :spinning="submitLoading">
          <sys-role-select
            v-model:value="formModel.roleCodes"
            mode="multiple"
            allow-clear
            placeholder="无角色"
          />
        </a-spin>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import SysRoleSelect from '../role/SysRoleSelect.vue'
import type { SysUserPageVO, SysUserScope } from '@/api/system/user/types'
import { queryUserScope, updateUserScope } from '@/api/system/user'
import { useModal } from '@/hooks/modal'
import { FormAction, useAdminForm } from '@/hooks/form'
import type { FormRequestMapping } from '@/hooks/form'

type RoleScopeFormModel = SysUserScope & {
  userId?: number
  username: string
}

const { visible, openModal, closeModal } = useModal()

const labelCol = {
  xs: { span: 24 },
  sm: { span: 5 }
}
const wrapperCol = {
  xs: { span: 24 },
  sm: { span: 16 }
}

// 表单模型
const formModel = reactive<RoleScopeFormModel>({
  userId: undefined,
  username: '',
  roleCodes: []
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<RoleScopeFormModel> = {
  [FormAction.OTHER]: () =>
    updateUserScope(formModel.userId!, {
      roleCodes: formModel.roleCodes
    })
}

// 表单行为类型
const formAction = FormAction.OTHER

const { submitLoading, validateAndSubmit, resetFields } = useAdminForm(
  formAction,
  formRequestMapping,
  formModel
)

/* 表单提交处理 */
const handleSubmit = () => {
  validateAndSubmit(
    { ...formModel },
    {
      onSuccess: () => closeModal()
    }
  )
}

/* 弹窗关闭方法 */
const handleClose = () => {
  closeModal()
  submitLoading.value = false
}

defineExpose({
  open(record: SysUserPageVO) {
    openModal()

    resetFields()
    formModel.userId = record.userId
    formModel.username = record.username
    formModel.roleCodes = []

    submitLoading.value = true
    queryUserScope(record.userId).then(res => {
      if (res.data.roleCodes) {
        formModel.roleCodes = res.data.roleCodes
        submitLoading.value = false
      }
    })
  }
})
</script>
