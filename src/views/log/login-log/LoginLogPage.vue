<template>
  <!-- 查询表单 -->
  <login-log-page-search :loading="tableRef?.loading" @search="searchTable" />

  <pro-table
    ref="tableRef"
    header-title="登录日志"
    row-key="id"
    :request="tableRequest"
    :columns="columns"
    :scroll="{ x: 1100 }"
  >
  </pro-table>
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProColumns } from '#/table'
import type { ProTableInstanceExpose, TableRequest } from '#/table'
import { mergePageParam } from '@/utils/page-utils'
import type { LoginLogPageParam } from '@/api/log/login-log/types'
import { pageLoginLogs } from '@/api/log/login-log'
import LoginLogPageSearch from './LoginLogPageSearch.vue'
import { DictText, DictTag } from '@/components/Dict'

defineOptions({ name: 'LoginLogPage' })

// 表格组件引用
const tableRef = ref<ProTableInstanceExpose>()
// 查询参数
let searchParams: LoginLogPageParam = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  return pageLoginLogs({ ...pageParam, ...searchParams })
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/* 查询表格 */
const searchTable = (params: LoginLogPageParam) => {
  searchParams = params
  reloadTable(true) // 会调用 tableRequest
}

const columns: ProColumns[] = [
  {
    title: '追踪ID',
    dataIndex: 'traceId',
    width: 205
  },
  {
    title: '用户名',
    dataIndex: 'username',
    width: 100,
    ellipsis: true
  },
  {
    title: '事件',
    dataIndex: 'eventType',
    align: 'center',
    width: 60,
    customRender: function ({ text }) {
      return h(DictTag, { dictCode: 'login_event_type', value: text })
    }
  },
  {
    title: '登陆IP',
    dataIndex: 'ip',
    width: 120
  },
  {
    title: '浏览器',
    dataIndex: 'browser',
    width: 100,
    ellipsis: true
  },
  {
    title: '操作系统',
    dataIndex: 'os',
    width: 110,
    ellipsis: true
  },
  {
    title: '操作信息',
    dataIndex: 'msg',
    width: 180,
    ellipsis: true
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 50,
    customRender: function ({ text }) {
      return h(DictText, { dictCode: 'log_status', value: text })
    }
  },
  {
    title: '登录/登出时间',
    dataIndex: 'loginTime',
    width: 150,
    sorter: true
  }
]
</script>
