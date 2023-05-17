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

      <a-form-item label="父级组织" v-bind="validateInfos.parentId">
        <sys-organization-tree-select
          v-model:value="formModel.parentId"
          placeholder="父级组织"
          :tree-data="hasRootOrganizationTree"
          tree-default-expand-all
          allow-clear
        />
      </a-form-item>

      <a-form-item label="组织名称" v-bind="validateInfos.name">
        <a-input v-model:value="formModel.name" placeholder="组织名称" />
      </a-form-item>

      <a-form-item label="排序">
        <a-input-number
          v-model:value="formModel.sort"
          style="width: 60%"
          placeholder="按数值由小到大升序"
        />
      </a-form-item>

      <a-form-item label="备注信息" v-bind="validateInfos.remarks">
        <a-textarea
          v-model:value="formModel.remarks"
          placeholder="备注信息"
          :rows="3"
          :max-length="512"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import SysOrganizationTreeSelect from './SysOrganizationTreeSelect.vue'
import { useModal } from '@/hooks/modal'
import type { FormRequestMapping } from '@/hooks/form'
import { FormAction, useAdminForm, useFormAction, labelCol, wrapperCol } from '@/hooks/form'
import { overrideProperties } from '@/utils/bean-utils'
import type {
  SysOrganizationTree,
  SysOrganizationVO,
  SysOrganizationDTO
} from '@/api/system/organization/types'
import { createOrganization, updateOrganization } from '@/api/system/organization'

const emits = defineEmits<{
  (e: 'submit-success'): void
}>()

const props = defineProps<{
  organizationTree: SysOrganizationTree[]
}>()

const hasRootOrganizationTree = computed<SysOrganizationTree[]>(() => [
  { id: 0, key: 0, name: '根组织', children: props.organizationTree } as SysOrganizationTree
])

const { title, visible, openModal, closeModal } = useModal()

const { formAction, isUpdateForm } = useFormAction()

// 表单的提交请求
const formRequestMapping: FormRequestMapping<SysOrganizationDTO> = {
  [FormAction.CREATE]: createOrganization,
  [FormAction.UPDATE]: updateOrganization
}

// 表单模型
const formModel = reactive<SysOrganizationDTO>({
  id: undefined,
  parentId: 0,
  name: '',
  sort: 1,
  remarks: ''
})

// 表单的校验规则
const formRule = reactive({
  parentId: [
    {
      required: true,
      type: 'number',
      message: '请选择父级组织'
    }
  ],
  name: [{ required: true, message: '请输入组织名称!' }],
  remarks: [{ max: 512 }]
})

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
  open(newFormAction: FormAction, record?: SysOrganizationVO) {
    openModal()
    resetFields()
    formAction.value = newFormAction
    if (newFormAction === FormAction.CREATE) {
      title.value = '新建组织'
    } else {
      title.value = '编辑组织'
      overrideProperties(formModel, record)
    }
  }
})
</script>
