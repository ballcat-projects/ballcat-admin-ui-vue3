<template>
  <announcement-page-search :loading="tableRef?.loading" @search="searchTable" />
  <pro-table
    ref="tableRef"
    header-title="公告信息"
    row-key="id"
    :request="tableRequest"
    :columns="columns"
    :scroll="{ x: 1100 }"
  >
    <!-- 操作按钮区域 -->
    <template #toolBarRender>
      <new-button v-if="hasPermission('notify:announcement:add')" @click="handleNew" />
    </template>

    <!--数据表格区域-->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operate'">
        <operation-group>
          <a
            v-if="hasPermission('notify:announcement:edit')"
            :disabled="record.status !== AnnouncementStatusEnum.UNPUBLISHED || null"
            @click="handleEdit(record)"
            >编辑
          </a>
          <a-popconfirm
            v-if="hasPermission('notify:announcement:edit')"
            title="确认要发布吗？"
            :disabled="record.status !== AnnouncementStatusEnum.UNPUBLISHED"
            @confirm="() => handlePublish(record)"
          >
            <a :disabled="record.status !== AnnouncementStatusEnum.UNPUBLISHED || null">发布</a>
          </a-popconfirm>
          <a-popconfirm
            v-if="hasPermission('notify:announcement:edit')"
            title="确认要关闭吗？"
            :disabled="record.status === AnnouncementStatusEnum.DISABLED"
            @confirm="() => handleClose(record)"
          >
            <a :disabled="record.status === AnnouncementStatusEnum.DISABLED || null">关闭</a>
          </a-popconfirm>
          <delete-text-button
            v-if="hasPermission('notify:announcement:del')"
            @confirm="() => handleDelete(record)"
          />
        </operation-group>
      </template>
    </template>
  </pro-table>

  <!-- 公告新建编辑的表单弹窗 -->
  <announcement-form-modal
    ref="announcementFormModalRef"
    @submit-success="() => reloadTable()"
    @preview-announcement="previewAnnouncement"
  />

  <!-- 公共弹窗，预览用 -->
  <announcement-modal ref="announcementModalRef" />
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProColumns, ProTableInstanceExpose, TableRequest } from '#/table'
import { mergePageParam } from '@/utils/page-utils'
import { DictText, DictTagGroup } from '@/components/Dict'
import { Badge } from 'ant-design-vue'
import { useAuthorize } from '@/hooks/permission'
import type {
  AnnouncementDTO,
  AnnouncementPageVO,
  AnnouncementQO
} from '@/api/notify/announcement/types'
import AnnouncementPageSearch from './AnnouncementPageSearch.vue'
import { AnnouncementModal } from '@/components/Notify/AnnouncementModal'
import { doRequest } from '@/utils/axios/request'
import {
  pageAnnouncements,
  deleteAnnouncement,
  publishAnnouncement,
  closeAnnouncement
} from '@/api/notify/announcement'
import { AnnouncementStatusEnum } from '@/api/notify/announcement/types'
import AnnouncementFormModal from '@/views/notify/announcement/AnnouncementFormModal.vue'
import { FormAction } from '@/hooks/form'
import { NewButton, DeleteTextButton } from '@/components/Button'
import { OperationGroup } from '@/components/Operation'

// 如果需要被多页签缓存，必须要设置组件名称
defineOptions({ name: 'AnnouncementPage' })

// 鉴权方法
const { hasPermission } = useAuthorize()

// 组件引用
const tableRef = ref<ProTableInstanceExpose>()
const announcementFormModalRef = ref<InstanceType<typeof AnnouncementFormModal>>()
const announcementModalRef = ref()

// 查询参数
let searchParams: AnnouncementQO = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = (params, sorter, filter) => {
  const pageParam = mergePageParam(params, sorter, filter)
  return pageAnnouncements({ ...pageParam, ...searchParams })
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/* 查询表格 */
const searchTable = (params: AnnouncementQO) => {
  searchParams = params
  reloadTable(true) // 会调用 tableRequest
}

/* 新建公告 */
function handleNew() {
  announcementFormModalRef.value?.open(FormAction.CREATE)
}

/* 编辑公告 */
function handleEdit(record: AnnouncementPageVO) {
  announcementFormModalRef.value?.open(FormAction.UPDATE, record)
}

/** 删除公告 */
function handleDelete(record: AnnouncementPageVO) {
  doRequest(deleteAnnouncement(record.id), {
    successMessage: '删除成功！',
    onSuccess: () => reloadTable()
  })
}

/** 发布公告 */
function handlePublish(record: AnnouncementPageVO) {
  doRequest(publishAnnouncement(record.id), {
    successMessage: '发布成功！',
    onSuccess: () => reloadTable()
  })
}

/** 关闭公告 */
function handleClose(record: AnnouncementPageVO) {
  doRequest(closeAnnouncement(record.id), {
    successMessage: '关闭成功！',
    onSuccess: () => reloadTable()
  })
}

/**  预览公告 */
function previewAnnouncement(record: AnnouncementPageVO | AnnouncementDTO) {
  announcementModalRef.value?.show(record, true)
}

const statusBadgePropMap: Record<AnnouncementStatusEnum, Record<string, any>> = {
  [AnnouncementStatusEnum.DISABLED]: {
    status: 'default',
    text: '已关闭'
  },
  [AnnouncementStatusEnum.ENABLED]: {
    status: 'processing',
    text: '已发布'
  },
  [AnnouncementStatusEnum.UNPUBLISHED]: {
    status: 'warning',
    text: '待发布'
  }
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
    dataIndex: 'content',
    customRender: function ({ record }) {
      return h('a', { onClick: () => previewAnnouncement(record) }, '预览')
    }
  },
  {
    title: '接收人范围',
    dataIndex: 'recipientFilterType',
    customRender: function ({ value }) {
      return h(DictText, { dictCode: 'recipient_filter_type', value: value })
    }
  },
  {
    title: '接收方式',
    dataIndex: 'receiveMode',
    customRender: function ({ value }) {
      return h(DictTagGroup, { dictCode: 'notify_channel', dictValues: value })
    }
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: function ({ value }) {
      const badgeProp = statusBadgePropMap[value as AnnouncementStatusEnum]
      return h(Badge, badgeProp)
    }
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
    width: 150,
    sorter: true
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
    width: 185
  }
]
</script>
