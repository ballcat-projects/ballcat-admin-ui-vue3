import './Header.less'

import { Layout } from 'ant-design-vue'

import GlobalHeader, { globalHeaderProps } from './components/GlobalHeader'

import TopNavHeader from './components/TopNavHeader'
import { clearMenuItem } from './utils/utils'
import { getRender } from './utils'

import { VueNodeOrRenderPropType, WithFalseVueNodeOrRenderPropType } from '#/types'
import type { VueNodeOrRender } from '#/types'
import type { HeaderContentRender, HeaderRender, HeaderTitleRender } from './renderTypes'

import type { WithFalse } from './types'
import type { PropType, CSSProperties, Slots, ExtractPropTypes } from 'vue'
import type { PrivateSiderMenuProps } from './components/SiderMenu/SiderMenu'

export const headerViewProps = () => ({
  // 集成
  ...globalHeaderProps(),

  isMobile: {
    type: Boolean,
    default: undefined
  },
  logo: {
    type: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,
    default: () => undefined
  },
  headerRender: {
    type: WithFalseVueNodeOrRenderPropType as PropType<WithFalse<HeaderRender>>,
    default: () => undefined
  },
  headerTitleRender: {
    type: [Function, Boolean] as PropType<WithFalse<HeaderTitleRender>>,
    default: () => undefined
  },
  headerContentRender: {
    type: [Function, Boolean] as PropType<WithFalse<HeaderContentRender>>,
    default: () => undefined
  },
  siderWidth: {
    type: Number,
    default: 208
  },
  hasSiderMenu: Boolean,
  visible: Boolean
})

export type HeaderViewProps = Partial<ExtractPropTypes<ReturnType<typeof headerViewProps>>>

// TODO slots 支持
const renderContent = (props: HeaderViewProps & PrivateSiderMenuProps, slots: Slots) => {
  const clearMenuData = clearMenuItem(props.menuData || [])

  const headerContentRender = getRender<HeaderContentRender>(props, slots, 'headerContentRender')

  let defaultDom
  if (props.layout === 'top' && !props.isMobile) {
    defaultDom = (
      <TopNavHeader
        theme={props.navTheme as 'light' | 'dark'}
        mode="horizontal"
        onCollapse={props.onCollapse}
        {...props}
        menuData={clearMenuData}
      >
        {slots}
      </TopNavHeader>
    )
  } else {
    defaultDom = (
      <GlobalHeader onCollapse={props.onCollapse} {...props} menuData={clearMenuData}>
        {{
          ...slots,
          default: () => headerContentRender && headerContentRender(props, null)
        }}
      </GlobalHeader>
    )
  }

  const headerRender = getRender<HeaderRender>(props, slots, 'headerRender')
  if (headerRender && typeof headerRender === 'function') {
    return headerRender(props, defaultDom)
  }
  return defaultDom
}

export default defineComponent({
  name: 'BasicHeader',
  props: headerViewProps(),
  setup(props, { slots, attrs }) {
    const needFixedHeader = computed(() => props.fixedHeader || props.layout === 'mix')
    const isTop = computed(() => props.layout === 'top')

    const className = computed(() => [
      attrs.class,
      {
        [`${props.prefixCls}-fixed-header`]: needFixedHeader.value,
        [`${props.prefixCls}-fixed-header-action`]: !props.collapsed,
        [`${props.prefixCls}-top-menu`]: isTop.value,
        [`${props.prefixCls}-header-${props.navTheme}`]: props.navTheme && props.layout !== 'mix'
      }
    ])

    /** 计算侧边栏的宽度，不然导致左边的样式会出问题 */
    const width = computed(() => {
      const needSettingWidth =
        needFixedHeader.value && props.hasSiderMenu && !isTop.value && !props.isMobile
      return props.layout !== 'mix' && needSettingWidth
        ? `calc(100% - ${props.collapsed ? 48 : props.siderWidth}px)`
        : '100%'
    })

    const right = computed(() => (needFixedHeader.value ? 0 : undefined))

    return () => (
      <>
        {needFixedHeader.value && (
          <Layout.Header
            style={{
              height: `${props.headerHeight}px`,
              lineHeight: `${props.headerHeight}px`,
              background: 'transparent'
            }}
          />
        )}
        <Layout.Header
          style={{
            padding: 0,
            height: `${props.headerHeight}px`,
            lineHeight: `${props.headerHeight}px`,
            width: width.value,
            zIndex: props.layout === 'mix' ? 100 : 19,
            right: right.value,
            ...(attrs.style as CSSProperties)
          }}
          class={className.value}
        >
          {renderContent(props as any, slots)}
        </Layout.Header>
      </>
    )
  }
})
