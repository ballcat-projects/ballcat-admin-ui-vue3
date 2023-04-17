// Lov 搜索条件控件的类型
// @ts-ignore
import type { LovProps } from '@/components/Lov/Lov.vue'

import { pageUsers as getUserPage } from '@/api/system/user'
import { LOV_SEARCH_TYPE_ENUM } from '@/components/Lov/type'
import type { SysUserPageParam, SysUserPageVO } from '@/api/system/user/types'

export const sysUserLov: LovProps<SysUserPageParam, SysUserPageVO> = {
  multiple: true,
  isNumberValue: true,
  modalTitle: '用户',
  dataKey: 'userId',
  // 自定义选择项的展示标题
  customOptionTitle(record: SysUserPageVO) {
    return record.nickname
  },
  getPageData: getUserPage,
  // 搜索配置
  searchOptions: [
    {
      label: '用户名',
      field: 'username',
      type: LOV_SEARCH_TYPE_ENUM.INPUT,
      placeholder: 'message.pleaseEnter'
    },
    {
      label: '昵称',
      field: 'nickname',
      type: LOV_SEARCH_TYPE_ENUM.INPUT,
      placeholder: 'message.pleaseEnter'
    }
  ],
  // 表格列
  tableColumns: [
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '昵称',
      dataIndex: 'nickname'
    },
    {
      title: '组织',
      dataIndex: 'organizationName'
    }
  ]
}
