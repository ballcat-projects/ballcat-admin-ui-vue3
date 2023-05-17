<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :centered="true"
    :body-style="{ padding: '24px 40px 8px 40px' }"
    :confirm-loading="submitLoading"
    :width="650"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <a-form :model="formModel" :label-col="labelCol" :wrapper-col="wrapperCol">
      <!-- 原始的菜单ID 用于支持菜单ID 的修改功能-->
      <a-form-item v-if="isUpdateForm" style="display: none">
        <a-input v-model:value="formModel.originalId" />
      </a-form-item>

      <a-form-item label="上级菜单">
        <a-tree-select
          v-model:value="formModel.parentId"
          placeholder="父菜单"
          :dropdown-style="{ maxHeight: '350px', overflow: 'auto' }"
          :tree-data="parentMenuTree"
          :tree-default-expanded-keys="[0]"
          :field-names="{ value: 'id' }"
        >
          <template #title="treeNode">
            <span> 【{{ treeNode.title }}】{{ treeNode.id }} </span>
          </template>
        </a-tree-select>
      </a-form-item>

      <a-form-item label="菜单类型">
        <dict-radio-group v-model:value="formModel.type" class="menu-type" dict-code="menu_type" />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item
            :label-col="rowLabelCol"
            :wrapper-col="rowWrapperCol"
            v-bind="validateInfos.id"
          >
            <template #label>
              菜单ID
              <a-tooltip
                title="菜单ID的长度固定为 6，由三部分构成。前两位是目录序号，中间两位是菜单序号，最后两位是按钮序号。
                例如目录的ID结构应为：XX0000，菜单结构为 XXXX00，按钮ID结构为 XXXXXX"
              >
                <QuestionCircleOutlined />
              </a-tooltip>
            </template>
            <a-input v-model:value="formModel.id" placeholder="请输入" />
          </a-form-item>
        </a-col>

        <a-col :xs="24" :sm="24" :md="12">
          <a-form-item
            label="显示排序"
            :label-col="rowLabelCol"
            :wrapper-col="rowWrapperCol"
            v-bind="validateInfos.sort"
          >
            <a-input-number
              v-model:value="formModel.sort"
              placeholder="排序值(升序)"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="菜单名称" v-bind="validateInfos.title">
        <a-input v-model:value="formModel.title" placeholder="请输入" style="width: 65%" />
        <!--        <a v-if="enableI18n && isCreateForm" style="margin-left: 8px" @click="toggleI18nAdvanced">-->
        <!--          {{ i18nAdvanced ? '收起' : '展开' }}国际化名称-->
        <!--          <a-icon :type="i18nAdvanced ? 'up' : 'down'" />-->
        <!--        </a>-->
      </a-form-item>

      <!-- 开启国际化 && 新建菜单 && 不是按钮时 -->
      <!--      <a-form-item v-show="i18nAdvanced" v-if="enableI18n && isCreateForm && menuType !== 2">-->
      <!--        <span slot="label">-->
      <!--          名称国际化-->
      <!--          <a-tooltip title="菜单标题将作为国际化信息的标识">-->
      <!--            <a-icon type="question-circle" />-->
      <!--          </a-tooltip>-->
      <!--        </span>-->
      <!--        <language-text ref="languageText" />-->
      <!--      </a-form-item>-->

      <template v-if="!isButton">
        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="12">
            <a-form-item label="菜单图标" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
              <a-input v-model:value="formModel.icon" placeholder="请选择">
                <template #prefix>
                  <AntIcon v-if="formModel.icon" :type="formModel.icon" />
                </template>
                <template #addonAfter>
                  <SettingOutlined @click="showIconSelect" />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12">
            <a-form-item
              label="路由地址"
              :label-col="rowLabelCol"
              :wrapper-col="rowWrapperCol"
              v-bind="validateInfos.path"
            >
              <a-input v-model:value="formModel.path" placeholder="请输入" />
            </a-form-item>
          </a-col>
        </a-row>
      </template>

      <template v-if="isMenu">
        <a-row :gutter="16">
          <a-col :xs="24" :sm="24" :md="12">
            <a-form-item label="打开方式" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
              <a-select v-model:value="formModel.targetType">
                <a-select-option :value="1"> 内部组件 </a-select-option>
                <a-select-option :value="2"> 内嵌页面 </a-select-option>
                <a-select-option :value="3"> 外部链接 </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :xs="24" :sm="24" :md="12">
            <a-form-item label="组件缓存" :label-col="rowLabelCol" :wrapper-col="rowWrapperCol">
              <a-radio-group v-model:value="formModel.keepAlive">
                <a-radio :value="1"> 开启 </a-radio>
                <a-radio :value="0"> 关闭 </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="资源路径" v-bind="validateInfos.uri">
          <a-input v-model:value="formModel.uri" placeholder="请输入" />
        </a-form-item>
      </template>

      <!-- 按钮没有显示隐藏一说 -->
      <template v-if="!isButton">
        <a-form-item label="是否可见">
          <a-radio-group v-model:value="formModel.hidden">
            <a-radio :value="0"> 显示 </a-radio>
            <a-radio :value="1"> 隐藏 </a-radio>
          </a-radio-group>
        </a-form-item>
      </template>

      <!-- 按钮才有授权标识 -->
      <template v-if="isButton">
        <a-form-item label="授权标识" v-bind="validateInfos.permission">
          <a-input v-model:value="formModel.permission" placeholder="请输入" />
        </a-form-item>
      </template>

      <a-form-item label="备注信息">
        <a-textarea
          v-model:value="formModel.remarks"
          placeholder="最多输入 200 个字符"
          :auto-size="{ minRows: 3, maxRows: 6 }"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <icon-selector-modal ref="iconSelectorModalRef" @choose="handleIconChoose"></icon-selector-modal>
</template>

<script setup lang="ts">
import { useModal } from '@/hooks/modal'
import { useAdminForm, useFormAction, FormAction } from '@/hooks/form'
import type { FormRequestMapping } from '@/hooks/form'
import { createMenu, updateMenu } from '@/api/system/menu'
import AntIcon from '#/layout/components/AntIcon/index'
import type { ColProps } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { SysMenuType } from '@/api/system/menu/types'
import type { SysMenuVO, SysMenuDTO } from '@/api/system/menu/types'
import { listToTree } from '@/utils/tree-utils'
import { overrideProperties } from '@/utils/bean-utils'
import IconSelectorModal from '@/components/IconSelector/IconSelectorModal.vue'
import type { Icon } from '@/components/IconSelector/types'

const props = defineProps<{
  menuList: SysMenuVO[]
}>()

const emits = defineEmits<{
  (e: 'submit-success'): void
}>()

const labelCol: ColProps = { sm: { span: 24 }, md: { span: 4 } }
const wrapperCol: ColProps = { sm: { span: 24 }, md: { span: 20 } }
const rowLabelCol: ColProps = { sm: { span: 24 }, md: { span: 8 } }
const rowWrapperCol: ColProps = { sm: { span: 24 }, md: { span: 16 } }

type SysMenuTree = Partial<SysMenuVO> & { children?: SysMenuTree[] }

// 有父目录的菜单树
const parentMenuTree: SysMenuTree[] = [{ id: 0, title: '根目录' }]
watchEffect(() => {
  parentMenuTree[0].children = props.menuList
    ? listToTree<SysMenuTree>(
        props.menuList.filter(x => x.type !== SysMenuType.BUTTON),
        0
      )
    : ([] as SysMenuTree[])
})

const { title, visible, openModal, closeModal } = useModal()

const { formAction, isUpdateForm } = useFormAction()

const iconSelectorModalRef = ref()

// 表单模型
const formModel = reactive<SysMenuDTO>({
  id: undefined,
  parentId: 0,
  title: '',
  icon: '',
  permission: '',
  path: '',
  targetType: 1,
  uri: '',
  sort: 1,
  keepAlive: 1,
  hidden: 0,
  type: SysMenuType.DIRECTORY,
  remarks: ''
})

// 是否是菜单类型
const isMenu = computed(() => formModel.type === SysMenuType.MENU)
// 是否是按钮类型
const isButton = computed(() => formModel.type === SysMenuType.BUTTON)

/* 菜单ID 的规则校验 */
const checkMenuId = async (_rule: Rule, value: number) => {
  const idStr = String(value)

  if (!idStr) {
    return Promise.reject('请确认新密码！')
  } else if (idStr.length !== 6) {
    return Promise.reject('菜单长度必须为 6 位！')
  }

  if (formModel.type === SysMenuType.DIRECTORY && !idStr.endsWith('0000')) {
    return Promise.reject('目录类型 ID 格式为 XX0000，xx 为目录编号')
  } else if (formModel.type === SysMenuType.MENU && !idStr.endsWith('00')) {
    return Promise.reject(
      '菜单类型 ID 格式为 XXXX00，前两位 XX 为所属目录编号，后两位 XX 为菜单编号'
    )
  }

  return Promise.resolve()
}
//菜单图标选择
const showIconSelect = () => {
  iconSelectorModalRef.value.show()
}

const handleIconChoose = (icon: Icon) => {
  formModel.icon = icon
}

// 表单的校验规则
const formRule = reactive({
  id: [{ required: true, validator: checkMenuId }],
  title: [{ required: true, message: '请输入菜单名称!' }],
  sort: [{ required: true, message: '请输入一个排序值!' }],
  path: [
    { required: !isButton, message: '请输入路由地址!' },
    { pattern: /^[a-z0-9-]+$/, message: '仅小写字母、中划线、数字' }
  ],
  uri: [{ required: isMenu, message: '请输入资源路径!' }],
  permission: [{ required: isButton, message: '请输入授权标识!' }]
})

// 表单的提交请求
const formRequestMapping: FormRequestMapping<SysMenuDTO> = {
  [FormAction.CREATE]: createMenu,
  [FormAction.UPDATE]: updateMenu
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
  open(newFormAction: FormAction, record?: SysMenuVO) {
    openModal()
    resetFields()
    if (newFormAction === FormAction.CREATE) {
      title.value = '新建菜单'
      formModel.parentId = record?.id || 0
    } else {
      title.value = '编辑菜单'
      overrideProperties(formModel, record)
      formModel.originalId = record?.id
    }
    formAction.value = newFormAction
  }
})
</script>
