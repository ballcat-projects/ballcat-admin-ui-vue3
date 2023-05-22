import type { DictItem, DictValue } from '@/api/system/dict/types'
import type { BadgeProps } from 'ant-design-vue'
import { selectProps } from 'ant-design-vue/es/select'
import type { ExtractPropTypes, PropType } from 'vue'
import { checkboxGroupProps } from 'ant-design-vue/es/checkbox'
import { radioGroupProps } from 'ant-design-vue/es/radio/Group'

/** 字典组件 */
const dictCommonProps = () => ({
  // 字典标识
  dictCode: String as PropType<string>,
  // 用于过滤出指定的字典项
  itemFilter: Function as PropType<(dictItem: DictItem) => boolean>,
  // 给字典项添加是否禁用的属性
  itemDisabledChecker: Function as PropType<(dictItem: DictItem) => boolean>
})

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

/** 字典文字回显组件属性 */
export type DictTextProps = DictDisplayComponentProps

/** 字典标签回显组件属性 */
export type DictTagProps = DictDisplayComponentProps

/** 字典标签组回显组件属性 */
export type DictTagGroupProps = {
  dictCode: string
  dictValues: DictValue[]
}

/** 字典徽章组件属性 */
export type DictBadgeProps = DictDisplayComponentProps & Omit<BadgeProps, 'text' | 'status'>

/** 字典组的组件：如选择框，checkbox 等，支持多选 */
export interface DictGroupComponentProps extends DictComponentProps {
  // 字典的值
  value: DictValue | DictValue[] | null
}

/** 字典选择器 Prop 类型 */
export const dictSelectProps = () => ({
  ...selectProps(),
  ...dictCommonProps(),
  // 显示搜索
  showSearch: {
    type: Boolean as PropType<boolean>,
    default: true
  }
})

export type DictSelectProps = Partial<ExtractPropTypes<ReturnType<typeof dictSelectProps>>>

/** 字典复选框组 Prop 类型 */
export const dictCheckboxGroupProps = () => ({
  ...checkboxGroupProps(),
  ...dictCommonProps()
})

export type DictCheckboxGroupProps = Partial<
  ExtractPropTypes<ReturnType<typeof dictCheckboxGroupProps>>
>

/** 字典单选框组 Prop 类型 */
export const dictRadioGroupProps = () => ({
  ...radioGroupProps(),
  ...dictCommonProps(),
  // 显示类型
  type: {
    type: String as PropType<'radio' | 'button'>,
    default: 'radio'
  }
})

export type DictRadioGroupProps = Partial<ExtractPropTypes<ReturnType<typeof dictRadioGroupProps>>>
