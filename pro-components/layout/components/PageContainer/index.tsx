import './index.less'

import { PageHeader, Tabs, Affix, Breadcrumb } from 'ant-design-vue'
import 'ant-design-vue/es/page-header/style/index.less'
import 'ant-design-vue/es/tabs/style/index.less'
import 'ant-design-vue/es/affix/style/index.less'
import 'ant-design-vue/es/breadcrumb/style/index.less'

import type {
  TabsProps,
  AffixProps,
  PageHeaderProps,
  TabPaneProps,
  SpinProps,
  BreadcrumbProps
} from 'ant-design-vue'

import GridContent from '../GridContent'
import FooterToolbar from '../FooterToolbar'

import PageLoading from '../PageLoading'
import type { WithFalse } from '../../types'
import type { WaterMarkProps } from '../WaterMark'
import WaterMark from '../WaterMark'
import type { CSSProperties, ExtractPropTypes, FunctionalComponent, PropType } from 'vue'
import type { VueNode } from 'ant-design-vue/es/_util/type'
import { getPrefixCls, routeContextInjectKey } from '../../RouteContext'
import { reactiveOmit, reactivePick } from '@vueuse/core'

import type { VueNodeOrRender } from '#/types'
import { VueNodeOrRenderPropType, WithFalseVueNodeOrRenderPropType } from '#/types'
import { pageHeaderProps } from 'ant-design-vue/es/page-header'
import omit from 'ant-design-vue/es/_util/omit'

const antvPageHeaderPropsKeys = Object.keys(pageHeaderProps())

export const pageHeaderTabConfig = () => ({
  /**  tabs 的列表 */
  tabList: Array as PropType<(TabPaneProps & { key?: string | number })[]>,

  /**  当前选中 tab 的 key */
  tabActiveKey: [String, Number] as PropType<TabsProps['activeKey']>,

  /**  tab 修改时触发 */
  onTabChange: Function as PropType<TabsProps['onChange']>,

  /**  tab 上额外的区域 */
  tabBarExtraContent: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,

  /**  tabs 的其他配置 */
  tabProps: Object as PropType<TabsProps>,

  /**  固定 PageHeader 到页面顶部 */
  fixedHeader: { type: Boolean, default: undefined }
})

export type PageHeaderTabConfig = Partial<ExtractPropTypes<ReturnType<typeof pageHeaderTabConfig>>>

type PageHeaderRender = (props: PageContainerProps) => VueNodeOrRender

export const pageContainerProps = () => ({
  ...pageHeaderTabConfig(),
  ...omit(pageHeaderProps(), ['title', 'footer', 'breadcrumb']),

  title: {
    type: WithFalseVueNodeOrRenderPropType as PropType<WithFalse<VueNodeOrRender>>,
    default: undefined
  },
  content: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,
  extraContent: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,
  prefixCls: String,
  footer: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,

  /** 是否显示背景色 */
  ghost: { type: Boolean, default: undefined },

  /**
   * PageHeader 的配置(与 antd 完全相同 )
   */
  header: Object as PropType<Partial<PageHeaderProps>>,

  /** pageHeader */
  pageHeaderRender: {
    type: WithFalseVueNodeOrRenderPropType as PropType<WithFalse<PageHeaderRender>>,
    default: undefined
  },

  /** 固钉的配置 (与 antd 完全相同) */
  affixProps: Object as PropType<AffixProps>,

  /** 内容是否加载中 (只加载内容区域) */
  loading: {
    type: [Object, Function, Boolean] as PropType<boolean | SpinProps | VueNodeOrRender>,
    default: false
  },

  // TODO 由于 ant-design-vue 暂时不支持这个属性，所以先注释
  /** 自定义 breadcrumb,返回false不展示 */
  // breadcrumbRender: {
  //   type: WithFalseCustomRenderPropType as PropType<WithFalse<PageHeaderProps['breadcrumb']>>,
  //   default: undefined
  // },

  /** 水印的配置 */
  waterMarkProps: Object as PropType<WaterMarkProps>,

  /**  配置面包屑 */
  breadcrumb: Object as PropType<BreadcrumbProps>
})

export type PageContainerProps = Partial<ExtractPropTypes<ReturnType<typeof pageContainerProps>>>

function genLoading(spinProps: boolean | SpinProps) {
  if (typeof spinProps === 'object') {
    return spinProps
  }
  return { spinning: spinProps }
}

/**
 * Render Footer tabList In order to be compatible with the old version of the PageHeader basically
 * all the functions are implemented.
 */
const renderFooter = (props: Omit<PageContainerProps & { prefixedClassName: string }, 'title'>) => {
  if (Array.isArray(props.tabList) || props.tabBarExtraContent) {
    return (
      <Tabs
        class={`${props.prefixedClassName}-tabs`}
        activeKey={props.tabActiveKey}
        onChange={key => {
          if (props.onTabChange) {
            props.onTabChange(key)
          }
        }}
        tabBarExtraContent={props.tabBarExtraContent}
        {...props.tabProps}
      >
        {props.tabList?.map((item, index) => (
          <Tabs.TabPane {...item} tab={item.tab} key={item.key || index} />
        ))}
      </Tabs>
    )
  }
  return null
}

const renderPageHeader = (
  content: VueNodeOrRender,
  extraContent: VueNodeOrRender,
  prefixedClassName: string
): VueNode => {
  if (!content && !extraContent) {
    return null
  }
  return (
    <div class={`${prefixedClassName}-detail`}>
      <div class={`${prefixedClassName}-main`}>
        <div class={`${prefixedClassName}-row`}>
          {content && <div class={`${prefixedClassName}-content`}>{content}</div>}
          {extraContent && <div class={`${prefixedClassName}-extraContent`}>{extraContent}</div>}
        </div>
      </div>
    </div>
  )
}

/**
 * 配置与面包屑相同，只是增加了自动根据路由计算面包屑的功能。此功能必须要在 ProLayout 中使用。
 *
 * @param props
 * @returns
 */
const ProBreadcrumb: FunctionalComponent<BreadcrumbProps> = props => {
  const routeContext = inject(routeContextInjectKey)
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* @ts-ignore TODO 面包屑透传处理 */}
      <Breadcrumb {...routeContext?.breadcrumb} {...routeContext?.breadcrumbProps} {...props} />
    </div>
  )
}

// eslint-disable-next-line vue/one-component-per-file
const ProPageHeader = defineComponent({
  name: 'ProPageHeader',
  inheritAttrs: false,
  props: {
    ...pageContainerProps(),
    prefixedClassName: { type: String, default: '' }
  },
  setup(props, { slots }) {
    const routeContext = inject(routeContextInjectKey, {})

    const restProps = reactiveOmit(
      props,
      'title',
      'content',
      'pageHeaderRender',
      'header',
      'prefixedClassName',
      'extraContent',
      'prefixCls'
    )

    if (props.pageHeaderRender === false) {
      return null
    }
    if (props.pageHeaderRender) {
      return <> {props.pageHeaderRender({ ...props, ...routeContext })}</>
    }

    const pageHeaderTitle = computed(() => {
      if (!props.title && props.title !== false) {
        return routeContext.title
      } else {
        return props.title
      }
    })

    // @ts-ignore
    const antdPageHeaderProps = reactivePick(restProps, antvPageHeaderPropsKeys)
    // @ts-ignore
    const localPageHeaderProps: PageHeaderProps = {
      ...antdPageHeaderProps,
      footer: renderFooter({
        ...restProps,
        prefixedClassName: props.prefixedClassName
      }),
      ...props.header,
      title: pageHeaderTitle.value
    }

    const { breadcrumb } = localPageHeaderProps as {
      breadcrumb: BreadcrumbProps
    }

    const noHasBreadCrumb = !breadcrumb || (!breadcrumb?.itemRender && !breadcrumb?.routes?.length)

    if (
      ['title', 'subTitle', 'extra', 'tags', 'footer', 'avatar', 'backIcon'].every(
        // @ts-ignore
        item => !localPageHeaderProps[item]
      ) &&
      noHasBreadCrumb &&
      !props.content &&
      !props.extraContent
    ) {
      return null
    }

    return () => (
      <div class={`${props.prefixedClassName}-warp`}>
        <PageHeader
          {...localPageHeaderProps}
          breadcrumb={{ ...localPageHeaderProps.breadcrumb, ...routeContext.breadcrumbProps }}
          prefixCls={props.prefixCls}
        >
          {{
            ...slots,
            default: () =>
              slots.headerContent?.(props) ||
              renderPageHeader(props.content, props.extraContent, props.prefixedClassName)
          }}
        </PageHeader>
      </div>
    )
  }
})

const pageHeaderSlot = [
  'backIcon',
  'avatar',
  'breadcrumb',
  'title',
  'subTitle',
  'tags',
  'extra',
  'footer'
]

// eslint-disable-next-line vue/one-component-per-file
const PageContainer = defineComponent({
  name: 'PageContainer',
  inheritAttrs: false,
  props: pageContainerProps(),
  slots: [...pageHeaderSlot, 'loading', 'pageHeaderRender', 'headerContent', 'extraContent'],
  setup(props, { attrs, slots }) {
    const restProps = reactiveOmit(props, 'loading', 'footer', 'affixProps', 'ghost', 'fixedHeader')

    const value = inject(routeContextInjectKey, {})
    const prefixCls = props.prefixCls || getPrefixCls('pro')

    const prefixedClassName = computed(() => `${prefixCls}-page-container`)

    const containerClassName = computed(() => [
      prefixedClassName.value,
      attrs.class,
      {
        [`${prefixCls}-page-container-ghost`]: props.ghost,
        [`${prefixCls}-page-container-with-footer`]: props.footer
      }
    ])

    const renderLoading = (): VueNode => {
      // 当loading时一个合法的ReactNode时，说明用户使用了自定义loading,直接返回改自定义loading
      if (slots.loading) {
        return slots.loading()
      }
      // 当传递过来的是布尔值，并且为false时，说明不需要显示loading,返回null
      if (typeof props.loading === 'boolean' && !props.loading) {
        return null
      }
      // 如非上述两种情况，那么要么用户传了一个true,要么用户传了loading配置，使用genLoading生成loading配置后返回PageLoading
      const spinProps = genLoading(props.loading as boolean | SpinProps)
      // 如果传的是loading配置，但spinning传的是false，也不需要显示loading
      return spinProps.spinning ? <PageLoading {...spinProps} /> : null
    }

    function renderContent(loadingDom: VueNode, content: VueNode): VueNode {
      // 只要loadingDom非空我们就渲染loadingDom,否则渲染内容
      const dom = loadingDom || content
      if (props.waterMarkProps || value.waterMarkProps) {
        const waterMarkProps = {
          ...value.waterMarkProps,
          ...props.waterMarkProps
        }
        return <WaterMark {...waterMarkProps}>{dom}</WaterMark>
      }
      return dom
    }

    return () => {
      const pageHeaderDom = (
        <ProPageHeader
          {...restProps}
          ghost={props.ghost}
          prefixCls={undefined}
          prefixedClassName={prefixedClassName.value}
        >
          {reactiveOmit(slots, 'default', 'loading')}
        </ProPageHeader>
      )

      const content = slots.default ? (
        <>
          <div class={`${prefixedClassName.value}-children-content`}>{slots.default()}</div>
          {value.hasFooterToolbar && <div style={{ height: '48px', marginTop: '24px' }} />}
        </>
      ) : null

      const loadingDom = renderLoading()

      const renderContentDom = renderContent(loadingDom, content)

      return (
        <div style={attrs.style as CSSProperties} class={containerClassName.value}>
          {props.fixedHeader && pageHeaderDom ? (
            // 在 hasHeader 且 fixedHeader 的情况下，才需要设置高度
            // @ts-ignore
            <Affix
              {...props.affixProps}
              offsetTop={value.hasHeader && value.fixedHeader ? value.headerHeight : 0}
            >
              {pageHeaderDom}
            </Affix>
          ) : (
            pageHeaderDom
          )}
          {renderContentDom && <GridContent>{renderContentDom}</GridContent>}
          {props.footer && <FooterToolbar prefixCls={prefixCls}>{props.footer}</FooterToolbar>}
        </div>
      )
    }
  }
})

export { ProPageHeader, ProBreadcrumb }

export default PageContainer
