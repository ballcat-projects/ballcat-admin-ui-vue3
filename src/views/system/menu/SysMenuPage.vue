<template>
  <sys-menu-page-search
    v-model:search-title="searchTitle"
    :loading="tableRef?.loading"
    @search="searchTable"
  />
  <pro-table
    ref="tableRef"
    v-model:expanded-row-keys="expandedRowKeys"
    header-title="菜单权限"
    row-key="id"
    :request="tableRequest"
    :columns="columns"
    :expand-icon-column-index="1"
    :pagination="false"
    :scroll="{ x: 1100 }"
    table-class-name="menu-tree-table"
  >
    <!-- 操作按钮区域 -->
    <template #toolBarRender>
      <a-button v-has="'system:role:add'" type="primary" @click="handleCreate()">
        <plus-outlined />新建
      </a-button>
    </template>

    <!-- 数据表格区域 -->
    <template #bodyCell="{ column, record }">
      <!-- 菜单标题 -->
      <template v-if="column.key === 'title'">
        <AntIcon v-if="record.icon" :type="record.icon" style="margin-right: 6px" />
        <a-tooltip placement="top">
          <template #title>
            <span>{{ enableI18n ? record.i18nTitle : record.title }}</span>
          </template>
          {{ enableI18n ? record.i18nTitle : record.title }}
        </a-tooltip>
      </template>
      <!-- 菜单可见性 -->
      <template v-else-if="column.key === 'hidden'">
        <dict-text dict-code="yes_or_no" :value="record.hidden ? 0 : 1" />
      </template>
      <!-- 操作栏 -->
      <template v-else-if="column.key === 'operate'">
        <a v-has="'system:menu:add'" @click="handleCreate(record)">添加</a>
        <a-divider type="vertical" />
        <a v-has="'system:menu:edit'" @click="handleUpdate(record)">修改</a>
        <a-divider type="vertical" />
        <a-popconfirm
          v-if="hasPermission('system:menu:del')"
          title="确认要删除吗？"
          @confirm="() => handleRemove(record)"
        >
          <a href="javascript:" class="ballcat-text-danger">删除</a>
        </a-popconfirm>
      </template>
    </template>
  </pro-table>

  <!-- 菜单新建/修改弹窗 -->
  <sys-menu-form-modal
    ref="sysMenuFormModalRef"
    :menu-list="menuList"
    @submit-success="reloadTable"
  />
</template>

<script setup lang="ts">
import ProTable from '#/table'
import type { ProTableInstanceExpose } from '#/table'
import type { TableRequest } from '#/table'
import type { ProColumns } from '#/table'
import { useAuthorize } from '@/hooks/permission'
import { listMenus, removeMenu } from '@/api/system/menu'
import type { SysMenuVOTree, SysMenuVO, SysMenuQO } from '@/api/system/menu/types'
import { listToTree, matchedParentKeys, pruneTree } from '@/utils/tree-utils'
import type { Key } from '@/utils/tree-utils'
import AntIcon from '#/layout/components/AntIcon/index'
import SysMenuPageSearch from '@/views/system/menu/SysMenuPageSearch.vue'
import SysMenuFormModal from '@/views/system/menu/SysMenuFormModal.vue'
import { FormAction } from '@/hooks/form'
import { doRequest } from '@/utils/axios/request'

const enableI18n = false

const { hasPermission } = useAuthorize()

// 表格组件引用
const tableRef = ref<ProTableInstanceExpose>()
const sysMenuFormModalRef = ref()

// 当前展开的节点 key
const expandedRowKeys = ref<Key[]>()

// 菜单列表，用于透传到子组件，减少查询开销
const menuList = ref<SysMenuVO[]>([])

// 搜索菜单标题，由前端进行数据检索过滤
const searchTitle = ref('')

/* 菜单标题的匹配逻辑 */
const titleMatcher = (node: SysMenuVOTree) => {
  const title = enableI18n ? node.i18nTitle : node.title
  return searchTitle.value ? title.indexOf(searchTitle.value) > -1 : true
}

// 远程搜索参数
let searchParams: SysMenuQO = {}

/* 远程加载表格数据 */
const tableRequest: TableRequest = async () => {
  const res = await listMenus({ ...searchParams })
  if (res?.data) {
    const data = res.data
    menuList.value = data
    const tree = listToTree<SysMenuVOTree>(data as SysMenuVOTree[], 0)

    // 展开树
    if (searchTitle.value) {
      expandedRowKeys.value = matchedParentKeys<SysMenuVOTree>(tree, titleMatcher)
    }

    return {
      data: {
        records: pruneTree<SysMenuVOTree>(tree, titleMatcher)
      }
    }
  }
  return []
}

/* 刷新表格 */
const reloadTable = (resetPageIndex?: boolean) => {
  tableRef.value?.actionRef?.reload(resetPageIndex)
}

/* 查询表格 */
const searchTable = (params: SysMenuQO) => {
  searchParams = params
  reloadTable(true) // 会调用 tableRequest
}

/* 新建菜单 */
const handleCreate = (record?: SysMenuVO) => {
  sysMenuFormModalRef.value.open(FormAction.CREATE, record)
}

/* 修改菜单 */
const handleUpdate = (record: SysMenuVO) => {
  sysMenuFormModalRef.value.open(FormAction.UPDATE, record)
}

/* 删除菜单 */
const handleRemove = (record: SysMenuVO) => {
  doRequest(removeMenu(record.id), {
    successMessage: '删除成功！',
    onSuccess: () => reloadTable()
  })
}

const columns: ProColumns[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '菜单名称',
    dataIndex: 'title',
    width: 200,
    ellipsis: true
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    width: 150,
    ellipsis: true
  },
  {
    title: '路由地址',
    dataIndex: 'path',
    width: 120,
    ellipsis: true
  },
  {
    title: '资源路径',
    dataIndex: 'uri',
    width: 180,
    ellipsis: true
  },
  {
    title: '排序',
    dataIndex: 'sort',
    width: 50
  },
  {
    title: '可见',
    dataIndex: 'hidden',
    width: 50
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 150
  },
  {
    key: 'operate',
    title: '操作',
    align: 'center',
    width: 150,
    fixed: 'right'
  }
]
</script>

<script lang="ts">
export default {
  name: 'SysMenuPage'
}
</script>

<style scoped></style>
