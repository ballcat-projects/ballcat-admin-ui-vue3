<template>
  <pro-table
    ref="tableRef"
    :columns="columns"
    :request="request"
    row-key="key"
    :pagination="{
      showQuickJumper: true
    }"
    :search="false"
    date-formatter="string"
    header-title="表格标题"
    table-prop-keys="tablePropKeys"
  >
    <template #toolBarRender="{ rows }">
      <a-button key="show" @click="onclick"> 刷新表格</a-button>
      <a-button key="out">
        导出数据
        <DownOutlined />
      </a-button>
      <a-button key="primary" type="primary" @click="() => handleClick(rows)"> 创建应用</a-button>
    </template>
  </pro-table>
</template>

<script setup lang="ts">
import ProTable from '#/table'
import { DownOutlined } from '@ant-design/icons-vue'
import type { ProTableInstanceExpose } from '#/table/Table'
import type { ProColumns } from '#/table/typing'

const tableRef = ref<ProTableInstanceExpose>()
const onclick = () => {
  tableRef.value?.actionRef?.reload()
}

// @ts-ignore
const request = (params, sorter, filter) => {
  // 表单搜索项会从 params 传入，传递给后端接口。
  console.log(params, sorter, filter)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        data: tableListDataSource,
        success: true
      })
    }, 200)
  })
}

const handleClick = (value: any) => {
  console.log(value)
}

// const toolBarRender = (props, rows) => [
//   <a-button key="show">查看日志</a-button>,
//   <a-button key="out">
//     导出数据
//     <DownOutlined />
//   </a-button>,
//   <a-button type="primary" key="primary" onClick={() => handleClick(rows)}>
//     创建应用
//   </a-button>
// ]

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error'
}

type TableListItem = {
  key: number
  name: string
  containers: number
  creator: string
  status: string
  createdAt: number
  memo: string
}
const tableListDataSource: TableListItem[] = []

const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某']

for (let i = 0; i < 5; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    containers: Math.floor(Math.random() * 20),
    creator: creators[Math.floor(Math.random() * creators.length)],
    // @ts-ignore
    status: valueEnum[Math.floor(Math.random() * 10) % 4],
    createdAt: Date.now() - Math.floor(Math.random() * 100000),
    memo: i % 2 === 1 ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴' : '简短备注文案'
  })
}

const columns: ProColumns[] = [
  {
    title: '应用名称',
    width: 80,
    dataIndex: 'name'
  },
  {
    title: '容器数量',
    dataIndex: 'containers',
    align: 'right'
  },
  {
    title: '状态',
    width: 80,
    dataIndex: 'status',
    initialValue: 'all',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      close: { text: '关闭', status: 'Default' },
      running: { text: '运行中', status: 'Processing' },
      online: { text: '已上线', status: 'Success' },
      error: { text: '异常', status: 'Error' }
    }
  },
  {
    title: '创建者',
    width: 80,
    dataIndex: 'creator',
    valueEnum: {
      all: { text: '全部' },
      付小小: { text: '付小小' },
      曲丽丽: { text: '曲丽丽' },
      林东东: { text: '林东东' },
      陈帅帅: { text: '陈帅帅' },
      兼某某: { text: '兼某某' }
    }
  },
  {
    title: '创建时间',
    width: 140,
    key: 'since',
    dataIndex: 'createdAt',
    valueType: 'date'
  },
  {
    title: '备注',
    dataIndex: 'memo',
    ellipsis: true,
    copyable: true
  },
  {
    title: '操作',
    width: 180,
    key: 'option',
    valueType: 'option'
  }
]
</script>

<script lang="ts">
export default {
  name: 'TestProTable'
}
</script>
