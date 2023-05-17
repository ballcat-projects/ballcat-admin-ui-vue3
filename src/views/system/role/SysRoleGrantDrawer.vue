<template>
  <a-drawer title="角色授权" placement="right" :visible="visible" :width="600" @close="closeModal">
    <div style="margin-bottom: 60px">
      <a-spin :spinning="submitLoading">
        <a-tree :checkable="true" v-bind="grantTreeState" />
      </a-spin>
    </div>

    <div
      :style="{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e8e8e8',
        padding: '10px 16px',
        textAlign: 'right',
        left: 0,
        background: '#fff',
        borderRadius: '0 0 4px 4px'
      }"
    >
      <a-popconfirm title="确定放弃编辑？" ok-text="确定" cancel-text="取消" @confirm="closeModal">
        <a-button style="margin-right: 0.8rem">取消</a-button>
      </a-popconfirm>
      <a-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</a-button>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { useModal } from '@/hooks/modal'
import { getMenuGrantList } from '@/api/system/menu'
import { listToTree } from '@/utils/tree-utils'
import type { Key } from '@/utils/tree-utils'
import type { SysMenuGrantVO } from '@/api/system/menu/types'
import type { SysRolePageVO } from '@/api/system/role/types'
import { listRolePermissionIds, updateRolePermissionIds } from '@/api/system/role'
import type { CheckInfo } from 'ant-design-vue/es/vc-tree/props'
import { message } from 'ant-design-vue'

type SysMenuGrantTree = SysMenuGrantVO & {
  key: Key
  children?: SysMenuGrantTree[]
}

// 当前的角色标识
let roleCode = ''

const { visible, openModal, closeModal } = useModal()

const submitLoading = ref(false)

// 权限树的状态
const grantTreeState = reactive({
  treeData: [] as SysMenuGrantTree[],
  checkedKeys: [] as Key[],
  halfCheckedKeys: [] as Key[],
  expandedKeys: [] as Key[],
  onCheck(checkedKeys: Key[] | { checked: Key[]; halfChecked: Key[] }, e: CheckInfo) {
    grantTreeState.checkedKeys = checkedKeys as Key[]
    grantTreeState.halfCheckedKeys = (e.halfCheckedKeys as Key[]) || []
  },
  onExpand(expandedKeys: Key[]) {
    grantTreeState.expandedKeys = expandedKeys
  }
})

/* 新建时加载授权菜单列表 */
submitLoading.value = true
getMenuGrantList()
  .then(res => {
    grantTreeState.treeData = res.data ? (listToTree(res.data, 0) as SysMenuGrantTree[]) : []
  })
  .finally(() => {
    submitLoading.value = false
  })

/**
 * 解析出所有的太监节点id
 * @param treeData 待解析的treeData
 * @param keyArr 原始节点数组
 * @param resArr 临时存放节点id的数组
 * @return 太监节点id数组
 */
const resolveAllEunuchNodeId = (treeData: SysMenuGrantTree[], keyArr: Key[], resArr: Key[]) => {
  for (let i = 0; i < treeData.length; i++) {
    const item = treeData[i]
    // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
    if (item.children && item.children.length !== 0) {
      resolveAllEunuchNodeId(item.children, keyArr, resArr)
    } else if (keyArr.indexOf(item.key) !== -1) {
      resArr.push(item.key)
    }
  }
  return resArr
}

/* 提交 */
const handleSubmit = () => {
  // 权限ID 求并集
  const checkedKeySet = new Set(grantTreeState.checkedKeys)
  const halfCheckedKeySet = new Set(grantTreeState.halfCheckedKeys)
  const permissionIds = [...new Set([...checkedKeySet, ...halfCheckedKeySet])]

  submitLoading.value = true
  updateRolePermissionIds(roleCode, permissionIds as number[])
    .then(res => {
      message.success(res.message)
      closeModal()
    })
    .finally(() => {
      submitLoading.value = false
    })
}

defineExpose({
  open(record: SysRolePageVO) {
    openModal()
    roleCode = record.code
    submitLoading.value = true
    listRolePermissionIds(roleCode)
      .then(res => {
        // 由于 AntDesign 的默认父子关联，直接选中所有权限，会导致半选节点变为全选
        // 所以这里筛选出所有太监节点，进行勾选
        grantTreeState.checkedKeys = resolveAllEunuchNodeId(grantTreeState.treeData, res.data, [])
        // 默认的半选节点为全部权限，防止未作修改直接保存导致的权限丢失
        grantTreeState.halfCheckedKeys = res.data
        grantTreeState.expandedKeys = res.data
      })
      .finally(() => {
        submitLoading.value = false
      })
  }
})
</script>
