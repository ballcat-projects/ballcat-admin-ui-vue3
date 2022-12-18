import type { TabsProps, TooltipProps } from 'ant-design-vue'
import type { TabPaneProps } from 'ant-design-vue'
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue'
import type { VueNode } from '../types'
import { VueNodePropType } from '../types'

export type Breakpoint = 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
export type Gutter = number | Partial<Record<Breakpoint, number>>
// eslint-disable-next-line @typescript-eslint/ban-types
export type ProCardTabsProps = {} & TabsProps

export type ColSpanType = number | string

export const cardProps = () => ({
  /** 标题样式 */
  headStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  /** 内容样式 */
  bodyStyle: { type: Object as PropType<CSSProperties>, default: () => ({}) },
  /** 页头是否有分割线 */
  headerBordered: { type: Boolean, default: false },
  /** 卡片标题 */
  title: VueNodePropType as PropType<VueNode>,
  /** 副标题 */
  subTitle: VueNodePropType as PropType<VueNode>,

  /** 标题说明 */
  tooltip: [Object, String] as PropType<string | TooltipProps>,
  /** @deprecated 你可以使用 tooltip，这个更改是为了与 antd 统一 */
  tip: String,
  /** 右上角自定义区域 */
  extra: VueNodePropType as PropType<VueNode>,
  /** 布局，center 代表垂直居中 */
  layout: String as PropType<'default' | 'center'>,
  /** 卡片类型 */
  type: String as PropType<'default' | 'inner'>,
  /** 指定 Flex 方向，仅在嵌套子卡片时有效 */
  direction: String as PropType<'column' | 'row'>,
  /** 是否自动换行，仅在嵌套子卡片时有效 */
  wrap: { type: Boolean, default: false },
  /** 尺寸 */
  size: String as PropType<'default' | 'small'>,
  /** 加载中 */
  loading: [Boolean, Object, String] as PropType<boolean | VueNode>,
  /** 栅格布局宽度，24 栅格，支持指定宽度或百分，需要支持响应式 colSpan={{ xs: 12, sm: 6 }} */
  colSpan: [Number, String, Object] as PropType<
    ColSpanType | Partial<Record<Breakpoint, ColSpanType>>
  >,
  /** 栅格间距 */
  gutter: {
    type: [Number, Object] as PropType<Gutter | Gutter[]>,
    default: 0
  },
  /** 操作按钮 */
  actions: Array as PropType<VueNode[]>,
  /** 拆分卡片方式 */
  split: String as PropType<'vertical' | 'horizontal'>,
  /** 是否有边框 */
  bordered: { type: Boolean, default: false },
  /**
   * 鼠标移过时可浮起
   *
   * @default false
   */
  hoverable: { type: Boolean, default: false },
  /** 幽灵模式，即是否取消卡片内容区域的 padding 和 背景颜色。 */
  ghost: { type: Boolean, default: false },
  /** 是否可折叠 */
  collapsible: { type: Boolean, default: false },
  /** 受控 collapsed 属性 */
  collapsed: { type: Boolean, default: false },
  /** 折叠按钮自定义节点 */
  collapsibleIconRender: Function as PropType<({ collapsed }: { collapsed: boolean }) => VueNode>,
  /** 收起卡片的事件 */
  onCollapse: Function as PropType<(collapsed: boolean) => void>,
  /** 标签栏配置 */
  tabs: Object as PropType<ProCardTabsProps>,
  /** 前缀 */
  prefixCls: String,
  /** ProCard 的 ref */
  // ref: React.Ref<HTMLDivElement | undefined>
  /** 是否展示选中样式 */
  checked: { type: Boolean, default: false },
  /** 选中改变 */
  onChecked: Function as PropType<(e: MouseEvent) => void>,
  /** 点击事件 */
  onClick: Function as PropType<(e: MouseEvent) => void>
})

export type CardProps = Partial<ExtractPropTypes<ReturnType<typeof cardProps>>>

export type ProCardTabPaneProps = {
  /** Key */
  key?: string
  /** ProCard 相关属性透传 */
  cardProps?: CardProps
} & TabPaneProps

export type CardType = CardProps
