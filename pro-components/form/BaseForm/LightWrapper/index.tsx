import './index.less'
import type { VueNode } from '../../../types'
import type { Placement } from 'ant-design-vue/es/vc-select/BaseSelect'

export type SizeType = 'small' | 'middle' | 'large' | undefined

export type LightWrapperProps = {
  label?: VueNode
  disabled?: boolean
  placeholder?: VueNode
  size?: SizeType
  value?: any
  onChange?: (value?: any) => void
  onBlur?: (value?: any) => void
  valuePropName?: string
  customLightMode?: boolean
  light?: boolean
  /**
   * @name 自定义label的值
   *
   * @example <caption>自定义数组的转化</caption>
   * labelFormatter={(value) =>value.join('-')} }
   */
  labelFormatter?: (value: any) => string
  bordered?: boolean
  otherFieldProps?: any
  valueType?: string
  allowClear?: boolean
  footerRender?: LightFilterFooterRender
  placement?: Placement
}

export type LightFilterFooterRender =
  | ((
      /**
       * 确认选择的值
       */
      onConfirm?: (e?: MouseEvent) => void,
      /**
       * 清除选择
       */
      onClear?: (e?: MouseEvent) => void
    ) => JSX.Element | false)
  | false
