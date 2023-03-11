<template>
  <a-modal
    :title="title"
    :visible="visible"
    :mask-closable="false"
    :body-style="{ padding: '18px 15px' }"
    :confirm-loading="tableLoading"
    :footer="null"
    :width="1000"
    @cancel="handleClose"
  >
    <!-- 表格区域 -->
    <pro-table
      v-show="tableShow"
      ref="tableRef"
      row-key="id"
      :request="tableRequest"
      :columns="columns"
      :scroll="{ x: 920 }"
      :card-props="{ bodyStyle: { padding: 0 } }"
    >
      <template #headerTitle>
        <a-button key="show" v-has="'system:dict:add'" type="primary" @click="handleCreate">
          <plus-outlined />
          新建
        </a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-switch
            :checked-value="DictItemStatus.ENABLED"
            :un-checked-value="DictItemStatus.DISABLED"
            :checked="record.status"
            @change="checked => handleUpdateStatus(record, checked)"
          />
        </template>
        <template v-else-if="column.key === 'operate'">
          <a v-has="'system:dict:edit'" @click="handleUpdate(record)">修改</a>
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

    <sys-dict-item-form
      v-show="!tableShow"
      ref="sysDictItemFormRef"
      @show-table="setTableShow(true)"
      @submit-success="reloadTable"
    />
  </a-modal>
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProColumns } from '#/table'
import { useModal } from '@/hooks/modal'
import { DictItemStatus } from '@/api/system/dict/types'
import type { SysDictItemPageVO, SysDictPageVO } from '@/api/system/dict/types'
import type { TableRequest } from '#/table'
import { mergePageParam } from '@/utils/page-utils'
import { pageDictItems, removeDictItem, updateDictItemStatus } from '@/api/system/dict'
import { useAuthorize } from '@/hooks/permission'
import { doRequest } from '@/utils/axios/request'
import SysDictItemForm from '@/views/system/dict/SysDictItemForm.vue'
import { useToggle } from '@vueuse/core'

// 鉴权方法
const { hasPermission } = useAuthorize()

const tableRef = ref()
const sysDictItemFormRef = ref()

// 显示表格
const [tableShow, setTableShow] = useToggle(true)
const tableLoading = ref(false)

const { title, visible, openModal, closeModal } = useModal()

// 当前的字典标识
let dictCode = ''

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  return pageDictItems({ ...pageParam, dictCode })
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/* 查询表格 */
const searchTable = () => {
  reloadTable(true) // 会调用 tableRequest
}

/* 创建字典项 */
const handleCreate = () => {
  setTableShow(false)
  sysDictItemFormRef.value.create(dictCode)
}

/* 修改字典项 */
const handleUpdate = (record: SysDictItemPageVO) => {
  setTableShow(false)
  sysDictItemFormRef.value.update(record)
}

/* 删除字典项 */
const handleRemove = (record: SysDictItemPageVO) => {
  doRequest(removeDictItem(record.id), {
    successMessage: '删除成功！',
    onSuccess: () => reloadTable()
  })
}

/* 修改字典项状态 */
const handleUpdateStatus = (record: SysDictItemPageVO, checked: unknown) => {
  const status = checked as DictItemStatus
  doRequest(updateDictItemStatus(record.id, status), {
    onSuccess: () => reloadTable()
  })
}

/* 弹窗关闭方法 */
const handleClose = () => {
  closeModal()
  tableLoading.value = false
}

const columns: ProColumns[] = [
  {
    title: '#',
    dataIndex: 'id',
    width: '45px'
  },
  {
    title: '字典标识',
    dataIndex: 'dictCode'
  },
  {
    title: '文本值',
    dataIndex: 'name'
  },
  {
    title: '数据值',
    dataIndex: 'value'
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: '45px',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    align: 'center'
  },
  {
    title: '备注',
    dataIndex: 'remarks',
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
    width: 100
  }
]

defineExpose({
  open: (record: SysDictPageVO) => {
    dictCode = record.code
    title.value = `字典项：${record.title}`
    reloadTable(true)
    openModal()
  }
})
</script>

<script lang="ts">
export default {
  name: 'SysDictItemModal'
}
</script>

<style scoped>
/** 保证切换时的高度不要相差太多 */
:deep(.ant-table-content) {
  height: 400px;
  overflow: auto;
}
:deep(.ant-pro-table-list-toolbar-container) {
  padding: 0 0 16px;
}
</style>
