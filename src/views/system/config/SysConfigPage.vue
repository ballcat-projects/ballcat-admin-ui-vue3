<template>
  <!-- 查询表单 -->
  <sys-config-page-search :loading="tableRef?.loading" @search="searchTable" />

  <pro-table
    ref="tableRef"
    header-title="配置信息"
    row-key="id"
    :request="tableRequest"
    :columns="columns"
    :scroll="{ x: 1000 }"
  >
    <!-- 操作按钮区域 -->
    <template #toolBarRender>
      <a-button key="show" v-has="'system:config:add'" type="primary" @click="handleCreate">
        <plus-outlined />
        新建
      </a-button>
    </template>

    <!-- 数据表格区域 -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operate'">
        <a v-has="'system:config:edit'" @click="handleUpdate(record)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm
          v-if="hasPermission('system:config:del')"
          title="确认要删除吗？"
          @confirm="() => handleRemove(record)"
        >
          <a href="javascript:" class="ballcat-text-danger">删除</a>
        </a-popconfirm>
      </template>
    </template>
  </pro-table>

  <!-- 系统配置新建修改的表单弹窗 -->
  <sys-config-form-modal ref="formModalRef" @submit-success="reloadTable" />
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProColumns } from '#/table'
import SysConfigPageSearch from './SysConfigPageSearch.vue'
import { useAuthorize } from '@/hooks/permission'
import type { ProTableInstanceExpose, TableRequest } from '#/table'
import { doRequest } from '@/utils/axios/request'
import { mergePageParam } from '@/utils/page-utils'
import { pageConfigs, removeConfig } from '@/api/system/config'
import type { SysConfigPageVO, SysConfigQO } from '@/api/system/config/types'
import SysConfigFormModal from '@/views/system/config/SysConfigFormModal.vue'
import { FormAction } from '@/hooks/form'

// 鉴权方法
const { hasPermission } = useAuthorize()

// 表格组件引用
const tableRef = ref<ProTableInstanceExpose>()
const formModalRef = ref()

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

// 查询参数
let searchParams: SysConfigQO = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  return pageConfigs({ ...pageParam, ...searchParams })
}

/* 查询表格 */
const searchTable = (params: SysConfigQO) => {
  searchParams = params
  reloadTable(true) // 会调用 tableRequest
}

/* 创建配置 */
const handleCreate = () => {
  formModalRef.value.open(FormAction.CREATE)
}

/* 修改配置 */
const handleUpdate = (record: SysConfigPageVO) => {
  formModalRef.value.open(FormAction.UPDATE, record)
}

/* 删除配置 */
const handleRemove = (record: SysConfigPageVO) => {
  doRequest(removeConfig(record.confKey), {
    successMessage: '删除成功！',
    onSuccess: () => reloadTable()
  })
}

const columns: ProColumns[] = [
  {
    title: '配置名称',
    dataIndex: 'name',
    width: 100,
    ellipsis: true
  },
  {
    title: 'Key',
    dataIndex: 'confKey',
    width: 100,
    ellipsis: true
  },
  {
    title: 'Value',
    dataIndex: 'confValue',
    width: 100,
    ellipsis: true
  },
  {
    title: '分类',
    dataIndex: 'category',
    width: 100
  },
  {
    title: '备注信息',
    dataIndex: 'remarks',
    width: 200,
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
    width: 100
  }
]
</script>

<script lang="ts">
export default {
  name: 'SysConfigPage'
}
</script>

<style scoped></style>
