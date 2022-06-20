<template>
  <sys-role-page-search :loading="tableRef?.loading" @search="searchTable" />
  <pro-table
    ref="tableRef"
    header-title="角色管理"
    row-key="id"
    :request="tableRequest"
    :columns="columns"
    :scroll="{ x: 1100 }"
  >
    <template #toolBarRender>
      <a-button key="show" v-has="'system:role:add'" type="primary" @click="handleCreate">
        <plus-outlined />
        新建
      </a-button>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'type'">
        <dict-tag :value="record.type" dict-code="role_type"></dict-tag>
      </template>
      <template v-else-if="column.key === 'operate'">
        <a v-has="'system:role:edit'" @click="handleUpdate(record)">修改</a>
        <a-divider type="vertical" />
        <a v-has="'system:role:grant'" @click="handleGrant(record)">授权</a>
        <a-divider type="vertical" />
        <a v-has="'system:role:grant'" @click="handleBind(record)">绑定</a>
        <a-divider type="vertical" />
        <a-popconfirm
          v-if="hasPermission('system:role:del')"
          title="确认要删除吗？"
          @confirm="handleRemove(record)"
        >
          <a href="javascript:" class="ballcat-text-danger">删除</a>
        </a-popconfirm>
      </template>
    </template>
  </pro-table>

  <!-- 角色新建修改的表单弹窗 -->
  <sys-role-form-modal ref="sysRoleFormModalRef" @submit-success="reloadTable" />

  <!-- 角色授权弹窗 -->
  <sys-role-grant-drawer ref="sysRoleGrantDrawerRef" />

  <!-- 角色和用户的绑定管理弹窗 -->
  <sys-role-user-modal ref="sysRoleUserModalRef" />
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProColumns } from '#/table'
import type { ProTableInstanceExpose } from '#/table/Table'
import type { TableRequest } from '#/table/typing'
import { mergePageParam } from '@/utils/page-utils'
import { pageRoles, removeRole } from '@/api/system/role'
import type { SysRolePageVO, SysRoleQO } from '@/api/system/role/types'
import { useAuthorize } from '@/hooks/permission'
import SysRolePageSearch from '@/views/system/role/SysRolePageSearch.vue'
import SysRoleFormModal from '@/views/system/role/SysRoleFormModal.vue'
import SysRoleGrantDrawer from '@/views/system/role/SysRoleGrantDrawer.vue'
import SysRoleUserModal from '@/views/system/role/SysRoleUserModal.vue'
import { FormAction } from '@/hooks/form'
import { doRequest } from '@/utils/axios/request'

// 鉴权方法
const { hasPermission } = useAuthorize()

// 表格组件引用
const tableRef = ref<ProTableInstanceExpose>()
const sysRoleFormModalRef = ref()
const sysRoleGrantDrawerRef = ref()
const sysRoleUserModalRef = ref()

// 查询参数
let searchParams: SysRoleQO = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  return pageRoles({ ...pageParam, ...searchParams })
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/* 查询表格 */
const searchTable = (params: SysRoleQO) => {
  searchParams = params
  reloadTable(true) // 会调用 tableRequest
}

/* 创建角色 */
const handleCreate = () => {
  sysRoleFormModalRef.value.open(FormAction.CREATE)
}

/* 修改角色 */
const handleUpdate = (record: SysRolePageVO) => {
  sysRoleFormModalRef.value.open(FormAction.UPDATE, record)
}

/* 删除角色 */
const handleRemove = (record: SysRolePageVO) => {
  doRequest(removeRole(record.id), {
    successMessage: '删除成功！',
    onSuccess: () => reloadTable()
  })
}

/* 角色授权权限 */
const handleGrant = (record: SysRolePageVO) => {
  sysRoleGrantDrawerRef.value.open(record)
}

/* 管理角色绑定的用户 */
const handleBind = (record: SysRolePageVO) => {
  sysRoleUserModalRef.value.open(record)
}

const columns: ProColumns[] = [
  {
    title: '角色名称',
    dataIndex: 'name',
    sorter: true,
    width: 150,
    ellipsis: true
  },
  {
    title: '角色标识',
    dataIndex: 'code',
    sorter: true,
    width: 180,
    ellipsis: true
  },
  {
    title: '类型',
    dataIndex: 'type',
    sorter: true,
    width: 80
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    sorter: true,
    width: 150,
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    sorter: true
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 150,
    sorter: true
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
    width: 180
  }
]
</script>

<script lang="ts">
export default {
  name: 'SysRolePage'
}
</script>

<style scoped></style>
