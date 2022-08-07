<template>
  <a-row :gutter="14">
    <a-col :xs="24" :md="8" :lg="5">
      <a-card :body-style="{ padding: 0 }" :bordered="false">
        <sys-organization-search-tree
          :style="organizationTreeStyle"
          @select="onOrganizationSelect"
        />
      </a-card>
    </a-col>
    <a-col :xs="24" :md="16" :lg="19">
      <resize-observer @resize="onTableResize">
        <div>
          <sys-user-page-search :loading="tableRef?.loading" @search="searchTable" />
          <pro-table
            ref="tableRef"
            header-title="系统用户"
            row-key="userId"
            :columns="columns"
            :request="tableRequest"
            :scroll="{ x: 800 }"
            :table-style="{ minHeight: '550px' }"
            :row-selection="{}"
          >
            <template #tableAlertOptionRender="{ intl, onCleanSelected, selectedRowKeys }">
              <a-space :size="16">
                <a-dropdown v-if="hasPermission('system:user:edit')">
                  <a @click.prevent> 批量操作&nbsp;<DownOutlined /> </a>
                  <template #overlay>
                    <a-menu @click="(info: MenuInfo) => handleUpdateStatus(selectedRowKeys, info)">
                      <a-menu-item :key="1">
                        <DeleteOutlined style="margin-right: 8px" />开启
                      </a-menu-item>
                      <a-menu-item :key="0">
                        <LockOutlined style="margin-right: 8px" />锁定
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
                <a @click="onCleanSelected">
                  {{ intl.getMessage('alert.clear', '清空') }}
                </a>
              </a-space>
            </template>

            <template #toolBarRender>
              <a-button key="show" v-has="'system:user:add'" type="primary" @click="handleCreate">
                <plus-outlined />
                新建
              </a-button>
            </template>

            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'avatar'">
                <a-avatar
                  shape="square"
                  :src="record.avatar && fileAbsoluteUrl(record.avatar)"
                  size="large"
                  @click="openAvatarModal(record)"
                >
                  <template #icon><UserOutlined /></template>
                </a-avatar>
              </template>
              <template v-else-if="column.key === 'sex'">
                <dict-text dict-code="gender" :value="record.sex" />
              </template>
              <template v-else-if="column.key === 'status'">
                <dict-badge dict-code="user_status" :value="record.status" />
              </template>
              <template v-else-if="column.key === 'operate'">
                <a-dropdown :trigger="['click']">
                  <a class="ant-dropdown-link" @click.prevent> 操作 </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item v-if="hasPermission('system:user:edit')">
                        <a @click="handleUpdate(record)">修改</a>
                      </a-menu-item>
                      <a-menu-item v-if="hasPermission('system:user:grant')">
                        <a @click="handleGrant(record)">授权</a>
                      </a-menu-item>
                      <a-menu-item v-if="hasPermission('system:user:pass')">
                        <a @click="changePass(record)">改密</a>
                      </a-menu-item>
                      <a-menu-item v-if="hasPermission('system:user:del')">
                        <a-popconfirm title="确认要删除吗？" @confirm="handleRemove(record)">
                          <a href="javascript:">删除</a>
                        </a-popconfirm>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </template>
            </template>
          </pro-table>
        </div>
      </resize-observer>
    </a-col>
  </a-row>

  <!-- 新建修改表单弹窗 -->
  <sys-user-form-modal ref="sysUserFormModalRef" @submit-success="reloadTable" />

  <!-- 头像弹窗 -->
  <cropper-modal ref="cropperModalRef" :upload-processor="uploadAvatarProcessor" />

  <!-- 授权弹窗 -->
  <sys-user-scope-modal ref="sysUserScopeModalRef" />

  <!-- 修改密码弹窗 -->
  <change-password-modal ref="changePasswordModalRef" />
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProColumns } from '#/table'
import ResizeObserver from 'ant-design-vue/es/vc-resize-observer'
import type { ProTableInstanceExpose } from '#/table/Table'
import { pageUsers, removeUser, updateUserAvatar, updateUserStatus } from '@/api/system/user'
import { fileAbsoluteUrl } from '@/utils/file-utils'
import CropperModal from '@/components/CropperModal/index.vue'
import { useUserStore } from '@/stores/user-store'
import type { FileObject } from '@/components/CropperModal/types'
import type { SysUserPageVO, SysUserQO } from '@/api/system/user/types'
import SysOrganizationSearchTree from '../organization/SysOrganizationSearchTree.vue'
import SysUserPageSearch from './SysUserPageSearch.vue'
import type { Key } from '@/utils/tree-utils'
import { mergePageParam } from '@/utils/page-utils'
import type { TableRequest } from '#/table/typing'
import type { CSSProperties } from 'vue'
import { useAuthorize } from '@/hooks/permission'
import SysUserScopeModal from '@/views/system/user/SysUserScopeModal.vue'
import ChangePasswordModal from '@/views/system/user/ChangePasswordModal.vue'
import SysUserFormModal from '@/views/system/user/SysUserFormModal.vue'
import useMediaQuery from '#/utils/hooks/useMediaQuery'
import type { SysUserStatus } from '@/api/system/user/types'
import { FormAction } from '@/hooks/form'
import { doRequest } from '@/utils/axios/request'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'

// 鉴权方法
const { hasPermission } = useAuthorize()

// 表格组件引用
const tableRef = ref<ProTableInstanceExpose>()
// 用户表单弹窗引用
const sysUserFormModalRef = ref()
// 头像弹窗引用
const cropperModalRef = ref()
// 用户授权弹窗引用
const sysUserScopeModalRef = ref()
// 修改密码弹窗引用
const changePasswordModalRef = ref()

// 选中的组织机构ids
const organizationIds = ref<number[]>()
// 组织机构查询树的样式
const organizationTreeStyle = ref<CSSProperties>()
// 响应尺寸
const colSize = useMediaQuery()
// 是否是手机设备
const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs')

/* table size 变化时，更新组织机构树高度 */
const onTableResize = ({ height }: { height: number }) => {
  organizationTreeStyle.value = {
    height: isMobile.value ? 'auto' : `${height}px`
  }
}

// 查询参数
let searchParams: SysUserQO = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  searchParams && (searchParams.organizationId = organizationIds.value)
  return pageUsers({ ...pageParam, ...searchParams })
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/* 查询表格 */
const searchTable = (params: SysUserQO) => {
  searchParams = params
  reloadTable(true) // 会调用 tableRequest
}

/* 选中组织机构时，进行查询 */
const onOrganizationSelect = (s: Key[]) => {
  organizationIds.value = s as number[]
  reloadTable()
}

/* 新建用户 */
const handleCreate = () => {
  sysUserFormModalRef.value.open(FormAction.CREATE)
}

/* 修改用户 */
const handleUpdate = (record: SysUserPageVO) => {
  sysUserFormModalRef.value.open(FormAction.UPDATE, record)
}

/* 删除用户 */
const handleRemove = (record: SysUserPageVO) => {
  doRequest(removeUser(record.userId), {
    successMessage: '删除成功！',
    onSuccess: () => reloadTable()
  })
}

/* 修改用户状态 */
const handleUpdateStatus = (userIds: number[], info: MenuInfo) => {
  const status = info.key as SysUserStatus
  doRequest(updateUserStatus(userIds, status), {
    successMessage: '修改状态成功！',
    onSuccess: () => reloadTable()
  })
}

/* 修改权限 */
const handleGrant = (record: SysUserPageVO) => {
  sysUserScopeModalRef.value.open(record)
}

/* 修改密码 */
const changePass = (record: SysUserPageVO) => {
  changePasswordModalRef.value.open(record)
}

/* 打开头像模态框 */
const openAvatarModal = (record: SysUserPageVO) => {
  cropperModalRef.value.open(fileAbsoluteUrl(record.avatar), record)
}

/* 修改头像 */
const uploadAvatarProcessor = (fileObj: FileObject, record: SysUserPageVO) => {
  return updateUserAvatar(record.userId, fileObj).then(res => {
    // 更新表格头像
    const avatar = res.data
    record.avatar = avatar
    // 更新当前登陆用户
    const { userInfo } = useUserStore()
    if (userInfo && userInfo.userId === record.userId) {
      userInfo.avatar = avatar
    }
    return res
  })
}

// 表格列配置
const columns: ProColumns[] = [
  {
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '昵称',
    dataIndex: 'nickname'
  },
  {
    title: '头像',
    dataIndex: 'avatar'
  },
  {
    title: '性别',
    dataIndex: 'sex'
  },
  {
    title: '组织',
    dataIndex: 'organizationName'
  },
  {
    title: '电话',
    dataIndex: 'phone'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: '80px'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '150px',
    sorter: true
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
    width: '70px'
  }
]
</script>

<script lang="ts">
export default {
  name: 'SysUserPage'
}
</script>

<style scoped></style>
