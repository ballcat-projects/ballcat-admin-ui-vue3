import type { DictItem, DictValue } from '@/api/system/dict/types'
import { selectProps } from 'ant-design-vue/es/select'
import type { ExtractPropTypes, PropType } from 'vue'

/** 字典组件 */
export interface DictComponentProps {
  // 字典标识
  dictCode: string
  // 用于过滤出指定的字典项
  itemFilter?: (dictItem: DictItem) => boolean
  // 给字典项添加是否禁用的属性
  itemDisabledChecker?: (dictItem: DictItem) => boolean
}

/** 字典回显组件：如 Text，徽章等 */
export interface DictDisplayComponentProps extends DictComponentProps {
  // 字典的值
  value: DictValue | null
}

/** 字典组的组件：如选择框，checkbox 等，支持多选 */
export interface DictGroupComponentProps extends DictComponentProps {
  // 字典的值
  value: DictValue | DictValue[] | null
}

/** 字典选择器 Prop 类型 */
export const dictSelectProps = () => ({
  ...selectProps(),
  // 显示搜索
  showSearch: {
    type: Boolean,
    default: true
  },
  // 字典标识
  dictCode: String,
  // 用于过滤出指定的字典项
  itemFilter: Function as PropType<(dictItem: DictItem) => boolean>,
  // 给字典项添加是否禁用的属性
  itemDisabledChecker: Function as PropType<(dictItem: DictItem) => boolean>
})

export type DictSelectProps = Partial<ExtractPropTypes<ReturnType<typeof dictSelectProps>>>
