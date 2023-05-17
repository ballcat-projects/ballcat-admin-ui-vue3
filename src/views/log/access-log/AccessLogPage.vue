<template>
  <!-- 查询表单 -->
  <access-log-page-search :loading="tableRef?.loading" @search="searchTable" />

  <pro-table
    ref="tableRef"
    header-title="访问日志"
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
        <a-descriptions-item label="Request Params">{{ record.reqParams }}</a-descriptions-item>
        <a-descriptions-item label="Request Body">{{ record.reqBody }}</a-descriptions-item>
        <a-descriptions-item label="Result">{{ record.result }}</a-descriptions-item>
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
import type { AccessLogPageParam } from '@/api/log/access-log/types'
import { pageAccessLogs } from '@/api/log/access-log'
import AccessLogPageSearch from '@/views/log/access-log/AccessLogPageSearch.vue'

defineOptions({ name: 'AccessLogPage' })

// 表格组件引用
const tableRef = ref<ProTableInstanceExpose>()
// 查询参数
let searchParams: AccessLogPageParam = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  return pageAccessLogs({ ...pageParam, ...searchParams })
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/* 查询表格 */
const searchTable = (params: AccessLogPageParam) => {
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
    title: '用户名',
    dataIndex: 'username'
  },
  {
    title: '请求IP',
    dataIndex: 'ip',
    width: '120px'
  },
  {
    title: '请求URI',
    dataIndex: 'uri',
    width: 200,
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
    title: '状态码',
    dataIndex: 'httpStatus'
  },
  {
    title: '错误消息',
    dataIndex: 'errorMsg',
    ellipsis: true
  },
  {
    title: '访问时间',
    dataIndex: 'createTime',
    width: '150px',
    sorter: true
  }
]
</script>
