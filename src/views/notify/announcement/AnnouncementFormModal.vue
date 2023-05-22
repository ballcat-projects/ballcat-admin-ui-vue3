<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :width="1000"
    :body-style="{ paddingBottom: '8px' }"
    :confirm-loading="submitLoading"
    @cancel="handleClose"
  >
    <a-form ref="formRef" :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-model:value="formModel.id" />
      </a-form-item>

      <a-form-item label="标题" v-bind="validateInfos.title">
        <a-input v-model:value="formModel.title" placeholder="标题" />
      </a-form-item>

      <a-form-item label="内容" v-bind="validateInfos.content">
        <wang-editor v-model="formModel.content" :upload-img-req="uploadAnnouncementImage" />
      </a-form-item>

      <a-form-item label="筛选类型" v-bind="validateInfos.recipientFilterType">
        <dict-select
          v-model:value="formModel.recipientFilterType"
          dict-code="recipient_filter_type"
          @change="onRecipientFilterTypeChange"
        />
      </a-form-item>

      <a-form-item
        v-if="notAllFilterType"
        label="筛选条件"
        v-bind="validateInfos.recipientFilterCondition"
      >
        <a-select
          v-if="formModel.recipientFilterType === 2"
          v-model:value="formModel.recipientFilterCondition"
          mode="multiple"
          style="width: 100%"
          placeholder="请选择角色"
          :allow-clear="true"
        >
          <a-select-option v-for="selectData in roleSelectData" :key="selectData.value">
            {{ selectData.name }}
          </a-select-option>
        </a-select>
        <sys-organization-tree-select
          v-if="formModel.recipientFilterType === 3"
          v-model:value="formModel.recipientFilterCondition"
          placeholder="请选择组织"
          allow-clear
          multiple
        />
        <dict-select
          v-if="formModel.recipientFilterType === 4"
          v-model:value="formModel.recipientFilterCondition"
          dict-code="user_type"
          mode="multiple"
          placeholder="请选择用户类型"
        />
        <lov-local
          v-if="formModel.recipientFilterType === 5"
          v-model="formModel.recipientFilterCondition"
          v-bind="sysUserLov"
        />
      </a-form-item>

      <a-form-item label="接收方式" v-bind="validateInfos.receiveMode">
        <dict-checkbox-group v-model:value="formModel.receiveMode" dict-code="notify_channel" />
      </a-form-item>

      <a-form-item label="永久有效">
        <a-row>
          <a-col :xs="5" :md="2">
            <a-switch
              v-model:checked="formModel.immortal"
              :checked-value="1"
              :un-checked-value="0"
            />
          </a-col>
          <a-col :xs="16" :md="16">
            <a-form-item label="" v-bind="validateInfos.deadline">
              <a-date-picker
                v-if="notImmortal"
                v-model:value="formModel.deadline"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :show-time="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>
    </a-form>

    <template #footer>
      <a-space>
        <a-button type="dashed" @click="preview">预览</a-button>
        <a-button type="primary" :loading="submitLoading" @click="onlySave">仅保存</a-button>
        <a-button type="primary" :loading="submitLoading" @click="saveAndPublish"
          >保存并发布
        </a-button>
        <a-button @click="closeModal">取消</a-button>
      </a-space>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { useModal } from '@/hooks/modal'
import { useAdminForm, useFormAction, FormAction } from '@/hooks/form'
import type { FormRequestMapping } from '@/hooks/form'
import {
  createAnnouncement,
  updateAnnouncement,
  uploadAnnouncementImage
} from '@/api/notify/announcement'
import type { AnnouncementDTO, AnnouncementPageVO } from '@/api/notify/announcement/types'
import { sysUserLov } from '@/components/Lov/lov-options'
import { LovLocal } from '@/components/Lov'
import WangEditor from '@/components/Editor/index.vue'
import SysOrganizationTreeSelect from '@/views/system/organization/SysOrganizationTreeSelect.vue'
import type { SelectData } from '@/api/types'
import { listRoleSelectData } from '@/api/system/role'
import { overrideProperties } from '@/utils/bean-utils'
import type { ColProps } from 'ant-design-vue'
import { AnnouncementStatusEnum } from '@/api/notify/announcement/types'

const labelCol: ColProps = { sm: { span: 24 }, md: { span: 2 } }
const wrapperCol: ColProps = { sm: { span: 24 }, md: { span: 22 } }

// 角色下拉数据
const roleSelectData = ref<SelectData[]>([])
listRoleSelectData().then(res => {
  roleSelectData.value = res.data
})

const emits = defineEmits<{
  (e: 'submit-success'): void
  (e: 'preview-announcement', form: AnnouncementDTO): void
}>()

const { title, visible, openModal, closeModal } = useModal()

const { formAction, isUpdateForm } = useFormAction()

const formModel = reactive<AnnouncementDTO>({
  id: undefined,
  //标题
  title: '',
  //内容
  content: '',
  //接收人筛选方式
  recipientFilterType: 1,
  //对应接收人筛选方式的条件信息。如角色标识，组织ID，用户类型，用户ID等
  recipientFilterCondition: undefined,
  //接收方式
  receiveMode: [],
  //状态
  status: 0,
  //永久有效的
  immortal: 0,
  //截止日期
  deadline: ''
})

// 筛选条件不是全部
const notAllFilterType = computed(() => formModel.recipientFilterType !== 1)
// 非永久有效的公告
const notImmortal = computed(() => formModel.immortal !== 1)

// 表单的校验规则
const formRule = reactive({
  title: [{ required: true, message: '请输入公告标题!' }],
  content: [{ required: true, message: '请输入公告内容!' }],
  recipientFilterType: [{ required: true, message: '请选择接收人!' }],
  recipientFilterCondition: [{ required: notAllFilterType, message: '请指定接收人范围!' }],
  receiveMode: [{ required: true, message: '请选择接收方式!' }],
  deadline: [{ required: notImmortal, message: '请指定失效时间!' }]
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<AnnouncementDTO> = {
  [FormAction.CREATE]: createAnnouncement,
  [FormAction.UPDATE]: updateAnnouncement
}

const { submitLoading, validateAndSubmit, resetFields, validateInfos } = useAdminForm(
  formAction,
  formRequestMapping,
  formModel,
  formRule
)

/* 表单提交处理 */
const handleSubmit = () => {
  // 永久有效时，不需要过期事件
  if (formModel.immortal === 1) {
    formModel.deadline = undefined
  }
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

/* 预览公告 */
function preview() {
  emits('preview-announcement', toRaw(formModel))
}

/* 仅保存公告 */
function onlySave() {
  formModel.status = AnnouncementStatusEnum.UNPUBLISHED
  handleSubmit()
}

/* 保存并立刻发布公告 */
function saveAndPublish() {
  formModel.status = AnnouncementStatusEnum.ENABLED
  handleSubmit()
}

/* 监听筛选方式变更 */
function onRecipientFilterTypeChange() {
  // 筛选方式变更时，清空之前选中的条件数据
  formModel.recipientFilterCondition = []
}

defineExpose({
  open(newFormAction: FormAction, record?: AnnouncementPageVO) {
    openModal()
    resetFields()
    if (newFormAction === FormAction.CREATE) {
      title.value = '新建公告'
    } else {
      title.value = '编辑公告'
      overrideProperties(formModel, record)
    }
    formAction.value = newFormAction
  }
})
</script>
