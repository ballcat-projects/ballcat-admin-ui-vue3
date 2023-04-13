// Lov 搜索条件控件的类型
// @ts-ignore
import type { LovLocalProps } from '@/components/Lov/LovLocal'

import { pageUsers as getUserPage } from '@/api/system/user'
import { SEARCH_TYPE } from '@/components/Lov/type'
import type { SysUserPageParam, SysUserPageVO } from '@/api/system/user/types'

export const sysUserLov: LovLocalProps<SysUserPageParam, SysUserPageVO> = {
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
      type: SEARCH_TYPE.input,
      placeholder: 'message.pleaseEnter'
    },
    {
      label: '昵称',
      field: 'nickname',
      type: SEARCH_TYPE.input,
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
