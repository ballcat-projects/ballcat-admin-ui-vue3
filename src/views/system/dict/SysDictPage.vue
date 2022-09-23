<template>
  <!-- 查询组件 -->
  <sys-dict-page-search :loading="tableRef?.loading" @search="searchTable" />

  <!-- 表格区域 -->
  <pro-table
    ref="tableRef"
    header-title="数据字典"
    row-key="id"
    :request="tableRequest"
    :columns="columns"
    :scroll="{ x: 800 }"
  >
    <template #toolBarRender>
      <a-button key="show" v-has="'system:dict:add'" type="primary" @click="handleCreate">
        <plus-outlined />
        新建
      </a-button>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'valueType'">
        <dict-tag :value="record.valueType" dict-code="dict_value_type" />
      </template>
      <template v-else-if="column.key === 'operate'">
        <a v-has="'system:dict:edit'" @click="handleUpdate(record)">修改</a>
        <a-divider type="vertical" />
        <a v-has="'system:dict:read'" @click="openDictItemModal(record)">字典项</a>
        <a-divider type="vertical" />
        <a-popconfirm
          v-if="hasPermission('system:dict:del')"
          title="确认要删除吗？"
          @confirm="handleRemove(record)"
        >
          <a href="javascript:" class="ballcat-text-danger">删除</a>
        </a-popconfirm>
      </template>
    </template>
  </pro-table>

  <!-- 字典新建修改的表单弹窗 -->
  <sys-dict-form-modal ref="sysDictFormModalRef" @submit-success="reloadTable" />

  <!-- 字典项的弹窗 -->
  <sys-dict-item-modal ref="sysDictItemModalRef" />
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProColumns } from '#/table'
import type { ProTableInstanceExpose } from '#/table/Table'
import type { TableRequest } from '#/table/typing'
import { mergePageParam } from '@/utils/page-utils'
import { useAuthorize } from '@/hooks/permission'
import type { SysDictPageVO, SysDictQO } from '@/api/system/dict/types'
import { pageDicts, removeDict } from '@/api/system/dict'
import { FormAction } from '@/hooks/form'
import { doRequest } from '@/utils/axios/request'
import SysDictPageSearch from '@/views/system/dict/SysDictPageSearch.vue'
import SysDictFormModal from '@/views/system/dict/SysDictFormModal.vue'
import SysDictItemModal from '@/views/system/dict/SysDictItemModal.vue'

// 鉴权方法
const { hasPermission } = useAuthorize()

// 表格组件引用
const tableRef = ref<ProTableInstanceExpose>()
const sysDictFormModalRef = ref()
const sysDictItemModalRef = ref()

// 查询参数
let searchParams: SysDictQO = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  return pageDicts({ ...pageParam, ...searchParams })
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/* 查询表格 */
const searchTable = (params: SysDictQO) => {
  searchParams = params
  reloadTable(true) // 会调用 tableRequest
}

/* 创建角色 */
const handleCreate = () => {
  sysDictFormModalRef.value.open(FormAction.CREATE)
}

/* 修改角色 */
const handleUpdate = (record: SysDictPageVO) => {
  sysDictFormModalRef.value.open(FormAction.UPDATE, record)
}

/* 删除角色 */
const handleRemove = (record: SysDictPageVO) => {
  doRequest(removeDict(record.id), {
    successMessage: '删除成功！',
    onSuccess: () => reloadTable()
  })
}

const openDictItemModal = (record: SysDictPageVO) => {
  sysDictItemModalRef.value.open(record)
}

const columns: ProColumns[] = [
  {
    title: '标识',
    dataIndex: 'code',
    width: 180,
    ellipsis: true
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: 180,
    ellipsis: true
  },
  {
    title: '数据类型',
    dataIndex: 'valueType',
    width: 180
  },
  {
    title: '备注',
    dataIndex: 'remarks',
    width: 250,
    ellipsis: true
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150,
    sorter: true
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
    width: 160
  }
]
</script>

<script lang="ts">
export default {
  name: 'SysDictPage'
}
</script>

<style scoped></style>
