<template>
  <a-modal
    title="角色已绑用户"
    :visible="visible"
    :mask-closable="false"
    :body-style="{ padding: '16px 24px' }"
    :confirm-loading="submitLoading"
    :footer="null"
    :width="900"
    :centered="true"
    @cancel="closeModal"
  >
    <sys-role-user-search
      :role-code="roleCode"
      :loading="tableRef?.loading"
      @search="searchTable"
    />
    <pro-table
      ref="tableRef"
      row-key="userId"
      :request="tableRequest"
      :columns="columns"
      :lazy-load="true"
      :tool-bar-render="false"
      :card-props="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operate'">
          <a-popconfirm
            v-if="hasPermission('system:user:grant')"
            title="确认要解绑吗？"
            @confirm="handleUnbind(record)"
          >
            <a href="javascript:" class="ballcat-text-danger">解绑</a>
          </a-popconfirm>
        </template>
      </template>
    </pro-table>
  </a-modal>
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProColumns } from '#/table'
import type { TableRequest, ProTableInstanceExpose } from '#/table'
import SysRoleUserSearch from './SysRoleUserSearch.vue'
import { useModal } from '@/hooks/modal'
import { useAuthorize } from '@/hooks/permission'
import { mergePageParam } from '@/utils/page-utils'
import { pageRoleUsers, unbindRoleUser } from '@/api/system/role'
import type { SysRolePageVO, SysRoleUserQO } from '@/api/system/role/types'
import type { SysRoleUserVO } from '@/api/system/role/types'
import { doRequest } from '@/utils/axios/request'

const { hasPermission } = useAuthorize()

const tableRef = ref<ProTableInstanceExpose>()

const { visible, openModal, closeModal } = useModal()

const submitLoading = ref(false)

// 当前的角色标识
const roleCode = ref('')

// 查询参数
let searchParams = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  if (!roleCode.value) return Promise.resolve([])
  const pageParam = mergePageParam(params, sorter, filter)
  return pageRoleUsers({ ...pageParam, ...searchParams, roleCode: roleCode.value })
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/* 查询表格 */
const searchTable = (params: SysRoleUserQO) => {
  searchParams = params
  reloadTable(true)
}

const handleUnbind = (record: SysRoleUserVO) => {
  doRequest(unbindRoleUser(record.userId, roleCode.value), {
    successMessage: '解绑成功！',
    onSuccess: () => reloadTable()
  })
}

const columns: ProColumns[] = [
  {
    title: '用户ID',
    dataIndex: 'userId',
    width: '45px'
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: '45px'
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: '45px'
  },
  {
    title: '组织机构',
    dataIndex: 'organizationName',
    width: '45px'
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
    width: 50
  }
]

defineExpose({
  open(record: SysRolePageVO) {
    openModal()
    roleCode.value = record.code
    reloadTable(true)
  }
})
</script>
