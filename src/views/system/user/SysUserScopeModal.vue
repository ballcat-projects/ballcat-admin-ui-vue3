<template>
  <a-modal
    title="授权"
    :visible="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOk"
    @cancel="handleClose"
  >
    <a-form :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="用户名">
        <a-input v-model:value="formModel.username" disabled placeholder="用户名" />
      </a-form-item>
      <a-form-item label="角色">
        <a-spin :spinning="confirmLoading">
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
import { Form, message } from 'ant-design-vue'
import type { SysUserPageVO, SysUserScope } from '@/api/system/user/types'
import { queryUserScope, updateUserScope } from '@/api/system/user'
const useForm = Form.useForm

type RoleScopeFormModel = SysUserScope & {
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

const formModel = reactive<RoleScopeFormModel>({
  userId: undefined,
  username: '',
  roleCodes: []
})

const { resetFields } = useForm(formModel)

const handleOk = () => {
  confirmLoading.value = true
  updateUserScope(formModel.userId!, {
    roleCodes: formModel.roleCodes
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

const handleClose = () => {
  visible.value = false
  confirmLoading.value = false
}

defineExpose({
  open(record: SysUserPageVO) {
    visible.value = true

    resetFields()
    formModel.userId = record.userId
    formModel.username = record.username
    formModel.roleCodes = []

    confirmLoading.value = true
    queryUserScope(record.userId).then(res => {
      if (res.data.roleCodes) {
        formModel.roleCodes = res.data.roleCodes
        confirmLoading.value = false
      }
    })
  }
})
</script>

<script lang="ts">
export default {
  name: 'SysUserScopeModal'
}
</script>

<style scoped></style>
