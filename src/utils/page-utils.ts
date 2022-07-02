import type { SortOrder } from 'ant-design-vue/lib/table/interface'
import type { VueKey } from '#/types'

export type MergePageParamFunction = <U>(
  params: U & {
    pageSize?: number
    current?: number
    keyword?: string
  },
  sorter: Record<string, SortOrder>,
  filter: Record<string, VueKey[] | null>
) => Record<string, any>

export const mergePageParam: MergePageParamFunction = (params, sorter, filter) => {
  const sort = []
  for (const key in sorter) {
    sort.push(sorter[key] === 'ascend' ? `${key},asc` : `${key},desc`)
  }
  const { pageSize, current, ...rest } = params
  return {
    size: pageSize,
    page: current,
    ...rest,
    ...filter,
    sort
  }
}
