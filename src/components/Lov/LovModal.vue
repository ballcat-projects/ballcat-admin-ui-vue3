<template>
  <a-modal
    :mask-closable="false"
    class="lov-model"
    :confirm-loading="pageLoading"
    :centered="true"
    :title="enableI18n ? rawI18nText(modalTitle | '') : modalTitle"
    :width="modalWidth"
    :visible="visible"
    :body-style="modalStyle"
    :closable="modalTitle && modalTitle.length > 0"
    @ok="handleChoose"
    @cancel="handleClose"
  >
    <lov-search
      v-if="searchOptions && searchOptions.length > 0"
      ref="lovSearchRef"
      :domains="props.searchOptions"
      :loading="tableRef?.loading"
      @search="searchTable"
    ></lov-search>
    <!-- 已选数据展示 -->
    <div class="lov-selected-pool-wrapper">
      <a-select
        class="lov-select"
        style="width: 100%"
        :value="selectedRowKeys"
        :open="false"
        :mode="multiple ? 'tags' : 'default'"
        :options="selectOptions"
        :placeholder="enableI18n ? rawI18nText('lov.selectedData') : '已选数据'"
        :show-search="false"
        allow-clear
        @change="handleDeselect"
      ></a-select>
    </div>
    <pro-table
      ref="tableRef"
      :tool-bar-render="false"
      :row-key="dataKey"
      :columns="tableColumns"
      :request="tableRequest"
      :pagination="false"
      :default-sort-field="sortField"
      :custom-row="multiple ? onClickRowMulti : onClickRow"
      :row-selection="rowSelection"
      :toolbar-enabled="false"
      :table-alert-render="false"
      :card-props="{ bodyStyle: { padding: 0 } }"
      search-form-class-name="lov-search-wrapper"
    >
    </pro-table>

    <template #footer>
      <div class="lov-pagination-wrapper">
        <a-pagination
          v-model:current="pagination.current"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :show-total="pagination.showTotal"
          show-size-changer
          size="small"
          style="margin-left: 3%"
          @change="tableRef.actionRef.reload()"
        />
      </div>

      <a-button @click="closeModal">
        {{ enableI18n ? rawI18nText('action.cancel') : '取消' }}
      </a-button>
      <a-button type="primary" :loading="pageLoading" @click="handleChoose">
        {{ enableI18n ? rawI18nText('action.choose') : '选择' }}
      </a-button>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
// @ts-nocheck TODO 优化 Lov 类型

import { littleCamelToUnderline } from '@/utils/str-utils'
import ProTable, { type ProColumns, type TableRequest } from '#/table'
import { useModal } from '@/hooks/modal'
import { LovSearch } from '@/components/Lov'
import { mergePageParam } from '@/utils/page-utils'
import type { ApiResult } from '@/api/types'
import type { Key } from 'ant-design-vue/lib/table/interface'
import type { Domain } from '@/components/Lov/LovSearch.vue'
import { useAdminI18n } from '@/hooks/i18n'

const { rawI18nText } = useAdminI18n()
const enableI18n = false

const { visible, openModal, closeModal } = useModal()

const props = withDefaults(defineProps<LovModalProps>(), {
  multiple: false,
  customOptionTitle: undefined,
  modalTitle: '',
  modalWidth: '600px',
  searchOptions: undefined,
  tableSize: 'middle'
})

const tableRef = ref()
const lovSearchRef = ref()
// 默认排序字段
const sortField = computed(() => littleCamelToUnderline(props.dataKey ? props.dataKey : ''))
// 已选中数据
const selectedRows = ref([])
const selectedRowKeys = ref<Key[]>([])

let searchParams = {}
// 分页器
const pagination = reactive({
  total: 0,
  current: 1,
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total, range) => {
    const rangeBegin = range[0]
    const rangeEnd = range[1]
    if (enableI18n) {
      return rawI18nText('pagination.pageInfo', {
        rangeBegin: rangeBegin,
        rangeEnd: rangeEnd,
        total: total
      })
    } else {
      return rangeBegin + '-' + rangeEnd + ' ' + '共' + total + '条'
    }
  }
})

const pageLoading = computed(() => {
  return tableRef.value ? tableRef.value.loading : false
})

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  params.pageSize = pagination.pageSize
  params.current = pagination.current
  const pageParam = mergePageParam(params, sorter, filter)
  return props.getPageData({ ...pageParam, ...searchParams }).then(res => {
    pagination.total = res.data.total
    res.data.records.forEach(item => {
      item[props.dataKey] = String(item[props.dataKey])
    })
    console.log(res)
    return Promise.resolve(res)
  })
}

const rowSelection = computed(() => {
  return {
    type: props.multiple ? 'checkbox' : 'radio',
    selectedRowKeys: unref(selectedRowKeys),
    onChange: (rowKeys, rows) => {
      selectedRowKeys.value = rowKeys
      selectedRows.value = rows
    }
  }
})

const selectOptions = computed(() => {
  return selectedRows.value.map(x => {
    return {
      value: x[props.dataKey],
      label: props.customOptionTitle(x)
    }
  })
})

const modalStyle = computed(() => {
  const screenHeight = document.body.clientHeight * 0.75
  return { padding: '0', maxHeight: screenHeight + 'px', overflowY: 'scroll' }
})

const searchTable = (params: Record<string, any>) => {
  searchParams = params
  reloadTable(true) // 会调用 tableRequest
}

// 刷新表格
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

// watch(
//   () => selectedRows.value,
//   () => {
//     tableRef.value && tableRef.value.onSelectChange(selectedRowKeys, selectedRows)
//   }
// )
// watch(
//   () => selectedRowKeys.value,
//   () => {
//     tableRef.value && tableRef.value.onSelectChange(selectedRowKeys, selectedRows)
//   }
// )

onMounted(() => {
  // 禁止 select 框输入
  const element = document.querySelector('.lov-select .ant-select-selection-search-input')
  element && (element['readOnly'] = true)
})

// ============ 模态框使用方法 ===========

defineExpose({
  open(selectValue: Key | Key[], selectRow: []) {
    selectedRowKeys.value = props.multiple ? selectValue : [selectValue]
    selectedRows.value = selectRow ? selectRow : []
    openModal()
  }
})

const emits = defineEmits<{
  (e: 'lov-choose', { selectedValue, selectedRows }): void
}>()

const handleChoose = () => {
  emits('lov-choose', {
    selectedValue: props.multiple
      ? selectedRowKeys.value
      : selectedRowKeys.value instanceof Array
      ? selectedRowKeys.value[0]
      : '',
    selectedRows: selectedRows.value
  })
  handleClose()
}

const handleClose = () => {
  lovSearchRef?.value.clearForm()
  closeModal()
}

//  ===== 已选数据展示池 ======
const handleDeselect = value => {
  selectedRowKeys.value = value
}

// ======  表格使用方法 =============
const onClickRow = (record: Record<string, any>) => {
  return {
    on: {
      click: () => {
        selectedRowKeys.value = [record[props.dataKey]]
        selectedRows.value = [record]
      }
    }
  }
}

const onClickRowMulti = (record: Record<string, any>) => {
  return {
    on: {
      click: () => {
        // 当前记录的 rowKey
        const recordRowKey = record[props.dataKey]
        const index = selectedRowKeys.value.indexOf(recordRowKey)
        // 是否已选中
        if (index === -1) {
          selectedRowKeys.value.push(recordRowKey)
          selectedRows.value.push(record)
        } else {
          selectedRowKeys.value.splice(index, 1)
          selectedRows.value.splice(index, 1)
        }
      }
    }
  }
}

interface LovModalProps<T = Record<string, any>, R = Record<string, any>> {
  // 是否多选
  multiple?: boolean

  // 表格数据唯一值对应的属性名
  dataKey: string

  // 自定义选择项的展示标题(obj:object) => void
  customOptionTitle?: (raw: R) => string

  // 弹出框的标题
  modalTitle?: string

  // 弹出框的宽度
  modalWidth?: string

  // 搜索组件
  searchOptions?: Domain[]

  // 表格分页查询条件
  getPageData: (params: T) => Promise<ApiResult<R>>

  // 表格列配置
  tableColumns: ProColumns[]

  // 表格大小
  tableSize?: string
}
</script>
<script lang="ts">
export default {
  name: 'LovModal'
}
</script>

<style scoped>
.lov-search-wrapper {
  text-align: left;
  padding: 0 20px;
  margin-top: 15px;
  margin-bottom: 0;
}

.lov-selected-pool-wrapper {
  padding: 0 20px;
  margin-bottom: 14px;
}

.lov-pagination-wrapper {
  width: 100%;
  background: #fff;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  left: 0;
  padding-bottom: 15px;
}
</style>
