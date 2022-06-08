import type { VueKey } from '../../types'

export type RowEditableType = 'single' | 'multiple'

export type RecordKey = VueKey | VueKey[]

export const recordKeyToString = (rowKey: RecordKey): VueKey => {
  if (Array.isArray(rowKey)) return rowKey.join(',')
  return rowKey
}

export type AddLineOptions = {
  position?: 'top' | 'bottom'
  recordKey?: RecordKey
  newRecordType?: 'dataSource' | 'cache'
  /** 要增加到哪个节点下，一般用于多重嵌套表格 */
  parentKey?: RecordKey
}

export type NewLineConfig<T> = {
  defaultValue: T | undefined
  options: AddLineOptions
}
