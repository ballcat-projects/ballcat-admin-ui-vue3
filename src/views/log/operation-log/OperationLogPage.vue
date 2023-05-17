<template>
  <!-- 查询表单 -->
  <operation-log-page-search :loading="tableRef?.loading" @search="searchTable" />

  <pro-table
    ref="tableRef"
    header-title="操作日志"
    row-key="id"
    :request="tableRequest"
    :columns="columns"
    :scroll="{ x: 1100 }"
  >
    <!-- 表格展开区域 -->
    <template #expandedRowRender="{ record }">
      <a-descriptions
        size="small"
        layout="vertical"
        :column="1"
        :label-style="{ fontWeight: 500, fontSize: '16px' }"
      >
        <a-descriptions-item label="Params">{{ record.params }}</a-descriptions-item>
        <a-descriptions-item label="UserAgent">{{ record.userAgent }}</a-descriptions-item>
      </a-descriptions>
    </template>
  </pro-table>
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProColumns } from '#/table'
import type { ProTableInstanceExpose, TableRequest } from '#/table'
import { mergePageParam } from '@/utils/page-utils'
import OperationLogPageSearch from './OperationLogPageSearch.vue'
import { DictText, DictTag } from '@/components/Dict'
import { pageOperationLogs } from '@/api/log/operation-log'
import type { OperationLogPageParam } from '@/api/log/operation-log/type'

defineOptions({ name: 'OperationLogPage' })

// 表格组件引用
const tableRef = ref<ProTableInstanceExpose>()
// 查询参数
let searchParams: OperationLogPageParam = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  if (!pageParam.sort || pageParam.sort.length == 0) {
    pageParam.sort = 'id,desc'
  }
  return pageOperationLogs({ ...pageParam, ...searchParams })
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/* 查询表格 */
const searchTable = (params: OperationLogPageParam) => {
  searchParams = params
  reloadTable(true) // 会调用 tableRequest
}

const columns: ProColumns[] = [
  {
    title: '追踪ID',
    dataIndex: 'traceId',
    width: '205px'
  },
  {
    title: '日志消息',
    dataIndex: 'msg',
    ellipsis: true,
    width: '120px'
  },
  {
    title: '类型',
    dataIndex: 'type',
    align: 'center',
    customRender: function ({ text }) {
      return h(DictTag, { dictCode: 'operation_type', value: text })
    }
  },
  {
    title: '请求IP',
    dataIndex: 'ip',
    width: '120px'
  },
  {
    title: '请求URI',
    dataIndex: 'uri',
    ellipsis: true
  },
  {
    title: '方法',
    dataIndex: 'method'
  },
  {
    title: '耗时',
    dataIndex: 'time',
    customRender: function ({ text }) {
      return text + ' ms'
    }
  },
  {
    title: '操作人',
    dataIndex: 'operator'
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: function ({ text }) {
      return h(DictText, { dictCode: 'log_status', value: text })
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '150px',
    sorter: true
  }
]
</script>
