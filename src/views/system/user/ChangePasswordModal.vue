<template>
  <a-modal
    title="修改密码"
    :visible="visible"
    :confirm-loading="submitLoading"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-spin :spinning="submitLoading">
      <a-form :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="用户名">
          <a-input v-model:value="formModel.username" disabled placeholder="用户名" />
        </a-form-item>

        <a-form-item label="新密码" has-feedback v-bind="validateInfos.pass">
          <a-input v-model:value="formModel.pass" type="password" placeholder="新密码" />
        </a-form-item>

        <a-form-item label="确认密码" has-feedback v-bind="validateInfos.confirmPass">
          <a-input v-model:value="formModel.confirmPass" type="password" placeholder="确认密码" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
import { updateUserPassword } from '@/api/system/user'
import type { SysUserPassDTO } from '@/api/system/user/types'
import type { SysUserPageVO } from '@/api/system/user/types'
import { passEncrypt } from '@/utils/password-utils'
import type { Rule } from 'ant-design-vue/es/form'
import { FormAction, useAdminForm } from '@/hooks/form'
import type { FormRequestMapping } from '@/hooks/form'
import { useModal } from '@/hooks/modal'

type ChangePasswordFormModel = SysUserPassDTO & {
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

/** 校验密码 */
const validatePass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请输入新密码！')
  } else {
    if (formModel.confirmPass !== '') {
      validate('confirmPass')
    }
    return Promise.resolve()
  }
}

/** 校验 confirm 密码 */
const validateConfirmPass = async (_rule: Rule, value: string) => {
  if (value === '') {
    return Promise.reject('请确认新密码！')
  } else if (value !== formModel.pass) {
    return Promise.reject('两次输入的密码不一致！')
  } else {
    return Promise.resolve()
  }
}

// 表单模型
const formModel = reactive<ChangePasswordFormModel>({
  username: '',
  pass: '',
  confirmPass: ''
})

// 表单校验规则
const formRule = reactive({
  pass: [{ required: true, validator: validatePass, trigger: 'change' }],
  confirmPass: [{ required: true, validator: validateConfirmPass, trigger: 'change' }]
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<ChangePasswordFormModel> = {
  [FormAction.OTHER]: () => {
    return updateUserPassword(formModel.userId!, {
      pass: passEncrypt(formModel.pass),
      confirmPass: passEncrypt(formModel.confirmPass)
    })
  }
}

const formAction = FormAction.OTHER

const { submitLoading, validateAndSubmit, resetFields, validate, validateInfos } = useAdminForm(
  formAction,
  formRequestMapping,
  formModel,
  formRule
)

/** 表单提交方法 */
const handleSubmit = () => {
  validateAndSubmit(
    { ...formModel },
    {
      onSuccess: () => {
        closeModal()
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
  open(record: SysUserPageVO) {
    resetFields()
    openModal()
    formModel.userId = record.userId
    formModel.username = record.username
  }
})
</script>
