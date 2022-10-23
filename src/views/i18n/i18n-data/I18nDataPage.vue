<template>
  <i18n-data-page-search :loading="tableRef?.loading" @search="searchTable" />
  <pro-table
    ref="tableRef"
    row-key="id"
    header-title="国际化信息"
    :request="tableRequest"
    :columns="columns"
    :scroll="{ x: 1100 }"
  >
    <template #toolBarRender>
      <a-button @click="handleExport">
        <DownloadOutlined />
        导出
      </a-button>
      <a-button @click="handleImport">
        <UploadOutlined />
        导入
      </a-button>
      <a-button type="primary" @click="handleCreate">
        <PlusOutlined />
        新建
      </a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operate'">
        <a-space>
          <template #split>
            <a-divider type="vertical" style="margin: 0" />
          </template>
          <a v-if="hasPermission('i18n:i18n-data:edit')" @click="handleUpdate(record)">编辑</a>
          <a-popconfirm
            v-if="hasPermission('i18n:i18n-data:del')"
            title="确认要删除吗？"
            @confirm="handleRemove(record)"
          >
            <a class="ballcat-text-danger">删除</a>
          </a-popconfirm>
        </a-space>
      </template>
    </template>
  </pro-table>

  <i18n-data-form-modal ref="i18nDataFormModalRef" @submit-success="reloadTable" />
  <i18n-data-update-modal ref="i18nDataEditFormModalRef" @submit-success="reloadTable" />
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProTableInstanceExpose, ProColumns, TableRequest } from '#/table'
import { pageI18nData, removeI18nData, exportExcel } from '@/api/i18n/i18n-data'
import type { I18nDataPageVO, I18nDataQO } from '@/api/i18n/types'
import I18nDataPageSearch from './I18nDataPageSearch.vue'
import I18nDataFormModal from './I18nDataFormModal.vue'
import { mergePageParam } from '@/utils/page-utils'
import { useAuthorize } from '@/hooks/permission'
import { doRequest } from '@/utils/axios/request'
import I18nDataUpdateModal from './I18nDataUpdateModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// 鉴权方法
const { hasPermission } = useAuthorize()

const tableRef = ref<ProTableInstanceExpose>()

const i18nDataFormModalRef = ref()
const i18nDataEditFormModalRef = ref()

// 远程搜索参数
let searchParams: I18nDataQO = {}

const tableRequest: TableRequest = async (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  return pageI18nData({ ...pageParam, ...searchParams })
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/** 查询表格 */
const searchTable = (params: I18nDataQO) => {
  searchParams = params
  reloadTable(true)
}

/** 创建数据 */
const handleCreate = () => {
  i18nDataFormModalRef.value.open()
}

/**修改数据 */
const handleUpdate = (record: I18nDataPageVO) => {
  i18nDataEditFormModalRef.value.open(record)
}

/* 删除数据 */
const handleRemove = (record: I18nDataPageVO) => {
  doRequest(removeI18nData(record.code, record.languageTag), {
    successMessage: '删除成功！',
    onSuccess: () => reloadTable()
  })
}

/** 导出数据 */
const handleExport = (params: I18nDataQO) => {
  doRequest(exportExcel(params), {
    successMessage: '导出成功'
  })
}

/** 导入数据 */
const handleImport = () => {}

const columns = computed<ProColumns[]>(
  () =>
    [
      {
        title: 'ID',
        dataIndex: 'id'
      },
      {
        title: t('i18n.i18nData.languageTag.text'),
        dataIndex: 'languageTag'
      },
      {
        title: t('i18n.i18nData.code.text'),
        dataIndex: 'code'
      },
      {
        title: t('i18n.i18nData.message.text'),
        dataIndex: 'message'
      },
      {
        title: t('common.remarks'),
        dataIndex: 'remarks'
      },
      {
        title: t('common.createTime'),
        dataIndex: 'createTime',
        width: '150px',
        sorter: true
      },
      {
        key: 'operate',
        title: t('common.operation'),
        align: 'center',
        width: '150px'
      }
    ] as ProColumns[]
)
</script>

<script lang="ts">
export default {
  name: 'I18nDataPage'
}
</script>
