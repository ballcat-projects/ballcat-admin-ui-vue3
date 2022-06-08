<template>
  <a-modal
    title="修改密码"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :mask-closable="false"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <a-spin :spinning="confirmLoading">
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
import { message, Form } from 'ant-design-vue'
import type { SysUserPassDTO } from '@/api/system/user/types'
import type { SysUserPageVO } from '@/api/system/user/types'
import { passEncrypt } from '@/utils/password-utils'
import type { Rule } from 'ant-design-vue/es/form'

const useForm = Form.useForm

type ChangePasswordFormModel = SysUserPassDTO & {
  userId?: number
  username: string
}

const visible = ref(false)

const confirmLoading = ref(false)

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
const formRules = reactive({
  pass: [{ required: true, validator: validatePass, trigger: 'change' }],
  confirmPass: [{ required: true, validator: validateConfirmPass, trigger: 'change' }]
})

const { resetFields, validate, validateInfos } = useForm(formModel, formRules)

/** 表单提交方法 */
const submit = () => {
  confirmLoading.value = true
  updateUserPassword(formModel.userId!, {
    pass: passEncrypt(formModel.pass),
    confirmPass: passEncrypt(formModel.confirmPass)
  })
    .then(res => {
      if (res.code === 200) {
        visible.value = false
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    })
    .catch(e => {
      message.error(e.message)
    })
    .finally(() => {
      confirmLoading.value = false
    })
}

// 弹窗确定方法
const handleOk = () => {
  validate()
    .then(() => {
      submit()
    })
    .catch((e: Error) => {})
}

// 弹窗关闭方法
const handleClose = () => {
  visible.value = false
  confirmLoading.value = false
}

defineExpose({
  open(record: SysUserPageVO) {
    resetFields()
    visible.value = true
    formModel.userId = record.userId
    formModel.username = record.username
  }
})
</script>

<script lang="ts">
export default {
  name: 'ChangePasswordModal'
}
</script>

<style scoped></style>
