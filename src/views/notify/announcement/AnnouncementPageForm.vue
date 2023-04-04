<template>
  <a-card :bordered="false" :title="title">
    <a-form ref="formRef" :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-model:value="formModel.id" />
      </a-form-item>

      <a-form-item label="标题" v-bind="validateInfos.title">
        <a-input v-model:value="formModel.title" placeholder="标题" />
      </a-form-item>

      <a-form-item label="内容" v-bind="validateInfos.content">
        <wang-editor v-model="formModel.content" :upload-img-req="uploadImage" />
      </a-form-item>

      <a-form-item label="筛选类型" v-bind="validateInfos.recipientFilterType">
        <dict-select
          v-model:value="formModel.recipientFilterType"
          dict-code="recipient_filter_type"
          @change="recipientFilterTypeChange"
        />
      </a-form-item>

      <a-form-item
        v-if="recipientFilterType && recipientFilterType !== 1"
        label="筛选条件"
        v-bind="validateInfos.recipientFilterCondition"
      >
        <a-select
          v-if="recipientFilterType === 2"
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
          v-if="recipientFilterType === 3"
          v-model:value="formModel.recipientFilterCondition"
          placeholder="请选择组织"
          allow-clear
          multiple
        />
        <dict-select
          v-if="recipientFilterType === 4"
          v-model:value="formModel.recipientFilterCondition"
          dict-code="user_type"
          mode="multiple"
          placeholder="请选择用户类型"
        />
        <!--        <lov-local-->
        <!--          v-if='recipientFilterType === 5'-->
        <!--          v-decorator="['recipientFilterCondition', formRules.recipientFilterType]"-->
        <!--          v-bind='sysUserLov'-->
        <!--        />-->
      </a-form-item>

      <a-form-item label="接收方式" v-bind="validateInfos.receiveMode">
        <dict-checkbox-group v-model:value="formModel.receiveMode" dict-code="notify_channel" />
      </a-form-item>

      <a-form-item label="永久有效">
        <a-row>
          <a-col :xs="5" :md="2">
            <a-switch v-model:checked="isImmortal" />
          </a-col>
          <a-col :xs="16" :md="16">
            <a-form-item label="">
              <a-date-picker
                v-if="!isImmortal"
                v-model:value="formModel.deadline"
                format="YYYY-MM-DD HH:mm:ss"
                value-format="YYYY-MM-DD HH:mm:ss"
                :show-time="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 7 }">
        <a-button type="dashed" @click="preview">预览</a-button>
        <a-button style="margin-left: 8px" type="primary" :loading="submitLoading" @click="save"
          >仅保存
        </a-button>
        <a-button
          style="margin-left: 8px"
          type="primary"
          :loading="submitLoading"
          @click="saveAndPublish"
          >保存并发布
        </a-button>
        <a-button style="margin-left: 8px" @click="showTable">取消</a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import type { FormRequestMapping } from '@/hooks/form'
import { FormAction, labelCol, useAdminForm, useFormAction } from '@/hooks/form'
import { addAnnouncement, updateAnnouncement, uploadImage } from '@/api/notify/announcement'
import { listRoleSelectData } from '@/api/system/role'
// import { sysUserLov } from '@/components/Lov/lovOptions'
import type { SelectData } from '@/api/types'
import type { AnnouncementDTO, AnnouncementPageVO } from '@/api/notify/announcement/types'
import { overrideProperties } from '@/utils/bean-utils'
import WangEditor from '@/components/Editor/index.vue'
import SysOrganizationTreeSelect from '@/views/system/organization/SysOrganizationTreeSelect.vue'
import type { ColProps } from 'ant-design-vue'

const wrapperCol: ColProps = {
  sm: { span: 24 },
  md: { span: 16 }
}

const { formAction, isUpdateForm } = useFormAction()
const emits = defineEmits<{
  (e: 'submit-success'): void
  (e: 'show-table'): void
  (e: 'preview-announcement', form: AnnouncementDTO): void
}>()

const formModel = reactive<AnnouncementDTO>({
  id: undefined,
  //标题
  title: '',
  //内容
  content: '',
  //接收人筛选方式
  recipientFilterType: 1,
  //对应接收人筛选方式的条件信息。如角色标识，组织ID，用户类型，用户ID等
  recipientFilterCondition: [],
  //接收方式
  receiveMode: [],
  //状态
  status: 0,
  //永久有效的
  immortal: 0,
  //截止日期
  deadline: ''
})
const title = ref<string>()
const formRef = ref()
const reqFunctions: FormRequestMapping<AnnouncementDTO> = {
  [FormAction.CREATE]: addAnnouncement,
  [FormAction.UPDATE]: updateAnnouncement
}
const isImmortal = ref<boolean>(false)

const formRules = reactive({
  title: [{ required: true, message: '请输入公告标题!' }],
  content: [{ required: true, message: '请输入公告内容!' }],
  recipientFilterType: [{ required: true, message: '请选择接收人!' }],
  receiveMode: [{ required: true, message: '请选择接收方式!' }]
})

const { submitLoading, validateAndSubmit, resetFields, validateInfos } = useAdminForm(
  formAction,
  reqFunctions,
  formModel,
  formRules
)

// 接收人筛选类型
const recipientFilterType = ref<number>()
// 角色选择框数据
const roleSelectData = ref<SelectData[]>([])
onMounted(() => {
  listRoleSelectData().then(res => {
    roleSelectData.value = res.data
  })
})

defineExpose({
  open(newFormAction: FormAction, record?: AnnouncementPageVO) {
    resetFields()
    if (newFormAction === FormAction.CREATE) {
      title.value = '新建公告'
    } else {
      title.value = '编辑公告'
      overrideProperties(formModel, record)
      formModel.id = record?.id
      echoDataProcess(formModel)
    }
    formAction.value = newFormAction
  }
})

function echoDataProcess(data) {
  recipientFilterType.value = data.recipientFilterType
  isImmortal.value = data.immortal === 1
  recipientFilterTypeChange(recipientFilterType.value)
}

const showTable = () => {
  emits('show-table')
}

function recipientFilterTypeChange(val) {
  recipientFilterType.value = val
  if (recipientFilterType.value === 1) {
    formRules.recipientFilterCondition = [{ required: false, message: '请指定接收人范围!' }]
  } else {
    formRules.recipientFilterCondition = [{ required: true, message: '请指定接收人范围!' }]
  }
  // 筛选方式变更时，清空之前选中的条件数据
  formModel.recipientFilterCondition = undefined

  formRef.value.resetFields({ recipientFilterCondition: undefined })
}

function preview() {
  emits('preview-announcement', formModel)
}

/* 表单提交处理 */
const handleSubmit = () => {
  validateAndSubmit(toRaw(formModel), {
    onSuccess: () => {
      emits('submit-success')
      showTable()
    }
  })
}

function save() {
  formModel.immortal = isImmortal.value ? 1 : 0
  formModel.status = 2
  nextTick(() => {
    handleSubmit()
  })
}

function saveAndPublish() {
  formModel.immortal = isImmortal.value ? 1 : 0
  formModel.status = 1
  nextTick(() => {
    handleSubmit()
  })
}
</script>

<script lang="ts">
export default {
  name: 'AnnouncementPageForm'
}
</script>
