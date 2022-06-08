/* eslint-disable no-param-reassign */
import type { RowProps } from 'ant-design-vue'
import type { FormProps } from 'ant-design-vue/es/form/Form'

import type { ActionsProps } from './Actions'
import type { VueNode } from '../../../types'

export type SpanConfig =
  | number
  | {
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
      xxl: number
    }

export type BaseQueryFilterProps = Omit<ActionsProps, 'submitter' | 'setCollapsed' | 'isForm'> & {
  className?: string
  defaultCollapsed?: boolean
  /**
   * @name layout 的布局设置
   * @type 'horizontal' | 'inline' | 'vertical';
   */
  layout?: FormProps['layout']
  defaultColsNumber?: number
  /**
   * @name 文字标签的宽度
   *
   * @example 文字标签宽 80 ，一般用于只有两个字
   * labelWidth={80}
   * @example 文字标签宽 140 ，一般用于有四个字
   * labelWidth={140}
   * @example 自动计算，会导致不整齐
   * labelWidth="auto"
   */
  labelWidth?: number | 'auto'
  /**
   * @name 每一行之前要不要有分割线
   * @description 只有在 `layout` 为 `vertical` 时生效
   */
  split?: boolean
  /**
   * @name 配置列数，一般而言是 8 的倍数
   *
   * @example 配置一行4个
   * span={6}
   *
   * @example 配置一行3个
   * span={6}
   *
   * @example 根据屏幕宽度配置
   * span={xs: 24, sm: 12, md: 8, lg: 6, xl: 6, xxl: 6}
   * */
  span?: SpanConfig

  /**
   * @name 查询按钮的文本
   *  */
  searchText?: string
  /**
   * @name 重置按钮的文本
   */
  resetText?: string
  /**
   * @name 查询表单栅格间隔
   *
   * @example searchGutter={24}
   * */
  searchGutter?: RowProps['gutter']
  /**
   * @param searchConfig 基础的配置
   * @param props 更加详细的配置 {
   *     type?: 'form' | 'list' | 'table' | 'cardList' | undefined;
   *     form: FormInstance;
   *     submit: () => void;
   *     collapse: boolean;
   *     setCollapse: (collapse: boolean) => void;
   *     showCollapseButton: boolean; }
   * @name 底部操作栏的 render
   *
   *
   * @example 增加一个清空按钮
   * optionRender={(searchConfig, props, dom) =>[ <a key="clear">清空</a>,...dom]}
   *
   * @example 增自定义提交
   *
   * optionRender={(searchConfig) => [<a key="submit" onClick={()=> searchConfig?.form?.submit()}>提交</a>]}
   */
  optionRender?:
    | ((
        searchConfig: Omit<BaseQueryFilterProps, 'submitter' | 'isForm'>,
        props: Omit<BaseQueryFilterProps, 'searchConfig'>,
        dom: VueNode[]
      ) => VueNode[])
    | false
  /**
   * @name 忽略 Form.Item rule规则配置
   */
  ignoreRules?: boolean
  /**
   * @name 是否显示 collapse 隐藏个数
   */
  showHiddenNum?: boolean
}
