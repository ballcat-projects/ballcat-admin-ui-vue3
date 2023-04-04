<template>
  <div class="ant-pro-page-container-children-content">
    <div v-if="tableShow">
      <announcement-page-search
        :loading="tableRef?.loading"
        @search="searchTable"
      ></announcement-page-search>
      <pro-table
        ref="tableRef"
        toolbar-title="公告信息"
        :row-key="rowKey"
        :request="tableRequest"
        :columns="columns"
        :scroll="{ x: 1000 }"
      >
        <!-- 操作按钮区域 -->
        <template #toolBarRender>
          <a-button v-has="'notify:announcement:add'" type="primary" @click="handleAdd">
            <PlusOutlined />
            新建
          </a-button>
        </template>

        <!--数据表格区域-->
        <template #bodyCell="{ record, column }">
          <template v-if="column.key === 'content'">
            <a href="javascript:;" @click="previewAnnouncement(record)">预览</a>
          </template>
          <template v-if="column.key === 'status'">
            <a-badge
              :status="statusTypeFilter(record.status)"
              :text="statusFilter(record.status)"
            />
          </template>
          <template v-else-if="column.key === 'operate'">
            <a
              v-has="'notify:announcement:edit'"
              :class="record.status !== 2 ? 'disabled' : ''"
              @click="handleEdit(record)"
              >编辑</a
            >
            <a-divider type="vertical" />
            <a-popconfirm title="确认要发布吗？" @confirm="() => handlePublish(record)">
              <a
                v-has="'notify:announcement:edit'"
                :class="record.status !== 2 ? 'disabled' : ''"
                href="javascript:"
                >发布</a
              >
            </a-popconfirm>
            <a-divider type="vertical" />
            <a-popconfirm title="确认要关闭吗？" @confirm="() => handleClose(record)">
              <a
                v-has="'notify:announcement:edit'"
                :class="record.status === 0 ? 'disabled' : ''"
                href="javascript:"
                >关闭</a
              >
            </a-popconfirm>

            <a-divider
              v-if="
                hasPermission('notify:announcement:edit') ||
                hasPermission('notify:announcement:del')
              "
              type="vertical"
            />
            <a-popconfirm
              v-if="hasPermission('notify:announcement:del')"
              title="确认要删除吗？"
              @confirm="() => handleDel(record)"
            >
              <a href="javascript:" class="ballcat-text-danger">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </pro-table>
    </div>
    <!--表单页面-->
    <announcement-page-form
      v-if="!tableShow"
      ref="pageFormRef"
      @show-table="setTableShow(true)"
      @submit-success="reloadTable"
      @preview-announcement="previewAnnouncement"
    />

    <!-- 公共弹窗，预览用 -->
    <announcement-modal ref="announcementModalRef" />
  </div>
</template>

<script lang="ts" setup>
import { getAnnouncementPage, delAnnouncement, publish, close } from '@/api/notify/announcement'
import ProTable from '#/table'
import type { ProTableInstanceExpose } from '#/table'
import type { TableRequest } from '#/table'
import type { ProColumns } from '#/table'
import { doRequest } from '@/utils/axios/request'
import { DictTag } from '@/components/Dict'
import { useAuthorize } from '@/hooks/permission'
import AnnouncementPageSearch from '@/views/notify/announcement/AnnouncementPageSearch.vue'
import type { AnnouncementPageVO, AnnouncementQO } from '@/api/notify/announcement/types'
import { mergePageParam } from '@/utils/page-utils'
import { FormAction } from '@/hooks/form'
import AnnouncementPageForm from '@/views/notify/announcement/AnnouncementPageForm.vue'
import { AnnouncementModal } from '@/components/Notify/AnnouncementModal'
import { useToggle } from '@vueuse/core'

const statusFilterArr = [
  {
    state: 'default',
    text: '已关闭',
    value: 0
  },
  {
    state: 'processing',
    text: '已发布',
    value: 1
  },
  {
    state: 'warning',
    text: '待发布',
    value: 2
  }
]

const statusFilter = computed(() => {
  return val => statusFilterArr[val].text
})
const statusTypeFilter = computed(() => {
  return val => statusFilterArr[val].state
})

const { hasPermission } = useAuthorize()

const [tableShow, setTableShow] = useToggle(true)

const rowKey = ref<string>('id')
const announcementModalRef = ref()

const tableRef = ref<ProTableInstanceExpose>()
const pageFormRef = ref()

let searchParams: AnnouncementQO = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  return getAnnouncementPage({ ...pageParam, ...searchParams })
}

/* 查询表格 */
const searchTable = (params: AnnouncementQO) => {
  searchParams = params
  reloadTable(true) // 会调用 tableRequest
}

// 刷新表格
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}
// 新增
function handleAdd() {
  switchPage()
  nextTick(() => {
    pageFormRef.value.open(FormAction.CREATE)
  })
}

// 编辑
function handleEdit(record: AnnouncementPageVO) {
  switchPage()
  nextTick(() => {
    pageFormRef.value.open(FormAction.UPDATE, record)
  })
}

// 删除
function handleDel(record) {
  doRequest(delAnnouncement(record[this.rowKey]), {
    onSuccess: () => {
      reloadTable(false)
    }
  })
}

// 切换表格/表单
function switchPage() {
  window.scrollTo(0, 0)
  tableShow.value = !tableShow.value
}

/**
 * 发布公告
 * @param record 公告对象
 */
function handlePublish(record) {
  doRequest(publish(record.id), {
    onSuccess: () => {
      reloadTable(false)
    }
  })
}

/**
 * 关闭公告
 * @param record 公告对象
 */
function handleClose(record) {
  doRequest(close(record.id), {
    onSuccess: () => {
      reloadTable(false)
    }
  })
}

/**
 * 预览公告
 */
function previewAnnouncement(record) {
  announcementModalRef.value.show(record, true)
}

const columns: ProColumns[] = [
  {
    title: '#',
    dataIndex: 'id'
  },
  {
    title: '标题',
    dataIndex: 'title'
  },
  {
    title: '内容',
    dataIndex: 'content'
  },
  {
    title: '接收人范围',
    dataIndex: 'recipientFilterType',
    customRender: function ({ text }) {
      return h(DictTag, { dictCode: 'recipient_filter_type', value: text })
    }
  },
  {
    title: '接收方式',
    dataIndex: 'receiveMode',
    customRender: function ({ text }) {
      return h(DictTag, { dictCode: 'notify_channel', value: text })
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    filters: statusFilterArr
  },
  {
    title: '失效时间',
    dataIndex: 'deadline',
    customRender: function ({ text, record }) {
      return record.immortal ? '永久有效' : text
    }
  },
  {
    title: '创建人',
    dataIndex: 'createUsername'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: '150px',
    sorter: true
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
    width: '185px',
    customRender: () => {
      return 'action-slot'
    }
  }
]
</script>

<script lang="ts">
export default {
  name: 'AnnouncementPage'
}
</script>

<style scoped>
a.disabled {
  pointer-events: none;
  filter: alpha(opacity=0.5);
  -moz-opacity: 0.5;
  opacity: 0.5;
}
</style>
