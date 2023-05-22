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
    <!-- 操作按钮区域 -->
    <template #toolBarRender>
      <new-button v-if="hasPermission('system:role:add')" @click="handleNew" />
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operate'">
        <operation-group>
          <a v-if="hasPermission('system:role:edit')" @click="handleEdit(record)">编辑</a>
          <a v-if="hasPermission('system:role:grant')" @click="handleGrant(record)">授权</a>
          <a v-if="hasPermission('system:role:grant')" @click="handleBind(record)">绑定</a>
          <delete-text-button
            v-if="hasPermission('system:role:del')"
            @confirm="handleDelete(record)"
          />
        </operation-group>
      </template>
    </template>
  </pro-table>

  <!-- 角色新建编辑的表单弹窗 -->
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
import { pageRoles, deleteRole } from '@/api/system/role'
import type { SysRolePageVO, SysRoleQO } from '@/api/system/role/types'
import { useAuthorize } from '@/hooks/permission'
import SysRolePageSearch from '@/views/system/role/SysRolePageSearch.vue'
import SysRoleFormModal from '@/views/system/role/SysRoleFormModal.vue'
import SysRoleGrantDrawer from '@/views/system/role/SysRoleGrantDrawer.vue'
import SysRoleUserModal from '@/views/system/role/SysRoleUserModal.vue'
import { FormAction } from '@/hooks/form'
import { doRequest } from '@/utils/axios/request'
import { DictTag } from '@/components/Dict'
import { OperationGroup } from '@/components/Operation'
import { NewButton, DeleteTextButton } from '@/components/Button'

// 如果需要被多页签缓存，必须要设置组件名称
defineOptions({ name: 'SysRolePage' })

// 鉴权方法
const { hasPermission } = useAuthorize()

// 表格组件引用
const tableRef = ref<ProTableInstanceExpose>()
const sysRoleFormModalRef = ref<InstanceType<typeof SysRoleFormModal>>()
const sysRoleGrantDrawerRef = ref<InstanceType<typeof SysRoleGrantDrawer>>()
const sysRoleUserModalRef = ref<InstanceType<typeof SysRoleUserModal>>()

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

/* 新建角色 */
const handleNew = () => {
  sysRoleFormModalRef.value?.open(FormAction.CREATE)
}

/* 编辑角色 */
const handleEdit = (record: SysRolePageVO) => {
  sysRoleFormModalRef.value?.open(FormAction.UPDATE, record)
}

/* 删除角色 */
const handleDelete = (record: SysRolePageVO) => {
  doRequest(deleteRole(record.id), {
    successMessage: '删除成功！',
    onSuccess: () => reloadTable()
  })
}

/* 角色授权权限 */
const handleGrant = (record: SysRolePageVO) => {
  sysRoleGrantDrawerRef.value?.open(record)
}

/* 管理角色绑定的用户 */
const handleBind = (record: SysRolePageVO) => {
  sysRoleUserModalRef.value?.open(record)
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
    width: 80,
    customRender: function ({ value }) {
      return h(DictTag, { dictCode: 'role_type', value: value })
    }
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
