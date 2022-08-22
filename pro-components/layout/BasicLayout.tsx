import './BasicLayout.less'

import { Layout } from 'ant-design-vue'
import 'ant-design-vue/es/layout/style/index.less'

import HeaderView, { headerViewProps } from './Header'
import useMediaQuery from '../utils/hooks/useMediaQuery'
import WrapContent from './WrapContent'
import PageLoading from './components/PageLoading'
import { getRender } from './utils'
import SiderMenuWrapper from './components/SiderMenu'
import { clearMenuItem } from './utils/utils'
import { privateSiderMenuProps, siderMenuProps } from './components/SiderMenu/SiderMenu'
import { transformRouteToMenuItem } from './utils/menuUtils'
import { toRefs } from '@vueuse/core'

import type { CSSProperties, PropType, Slots, VNode, ExtractPropTypes } from 'vue'
import type { MenuDataItem, MessageDescriptor, WithFalse } from './types'
import type { LocaleType } from './locales/types'
import type { WaterMarkProps } from './components/WaterMark'
import type { FooterRender, MenuRender, MultiTabRender } from './renderTypes'
import type { VueNode, VueNodeOrRender } from '#/types'
import { VueNodeOrRenderPropType } from '#/types'

import type { RouteRecordRaw } from 'vue-router'

import { getPrefixCls, routeContextInjectKey } from './RouteContext'
import FooterView from './Footer'

export type LayoutBreadcrumbProps = {
  minLength?: number
}

const basicLayoutProps = () => ({
  ...privateSiderMenuProps(),
  // 侧边菜单属性
  ...siderMenuProps(),
  // 头部相关属性
  ...headerViewProps(),

  /**
   * 路由信息，用来渲染菜单面包屑
   */
  routes: Array as PropType<RouteRecordRaw[]>,

  /**
   * 简约模式，设置了之后不渲染的任何 layout 的东西，但是会有 context，可以获取到当前菜单。
   *
   * @example pure={true}
   */
  pure: { type: Boolean, default: false },

  /**
   * logo 的配置，可以配置url，React 组件 和 false
   *
   * @example 设置 logo 为网络地址  logo="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4"
   * @example 设置 logo 为组件  logo={<img src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4"/>}
   * @example 设置 logo 为 false 不显示 logo  logo={false}
   * @example 设置 logo 为 方法  logo={()=> <img src="https://avatars1.githubusercontent.com/u/8186664?s=460&v=4"/> }
   * */
  logo: {
    type: VueNodeOrRenderPropType as PropType<WithFalse<VueNodeOrRender>>,
    default: undefined
  },

  /**
   * layout 的 loading 效果，设置完成之后只展示一个 loading
   */
  loading: { type: Boolean, default: false },

  /**
   * 当前语言
   *
   * @description "zh-CN" | "zh-TW" | "en-US" | "it-IT" | "ko-KR"
   * @example 中文 layout="zh-CN"
   * @example 英文 layout="en-US"
   */
  locale: { type: String as PropType<LocaleType>, default: 'zh-CN' },

  /**
   * @name layout 是严格受控的，可以 设置为 true，一直收起
   *
   * @example collapsed={true}
   */
  collapsed: { type: Boolean, default: undefined },

  /**
   * 收起和展开的时候触发事件
   *
   * @example onCollapse=(collapsed)=>{ setCollapsed(collapsed) };
   */
  onCollapse: Function as PropType<(collapsed: boolean) => void>,

  /**
   * 页脚的配置， 支持插槽
   *
   * @example 不展示dom footerRender={false}
   * @example 使用 layout 的  DefaultFooter   footerRender={() => (<DefaultFooter copyright="这是一条测试文案"/>}
   */
  footerRender: {
    type: VueNodeOrRenderPropType as PropType<WithFalse<FooterRender>>,
    default: undefined
  },

  /**
   * 处理 menuData 的数据，可以动态的控制数据
   * @see 尽量不要用异步数据来处理，否则可能造成更新不及时，如果异步数据推荐使用 menu.request 和 params。
   *
   * @example 删除一些菜单 menuDataRender=((menuData) => { return menuData.filter(item => item.name !== 'test') })
   * @example 增加一些菜单 menuDataRender={(menuData) => { return menuData.concat({ path: '/test', name: '测试', icon: 'smile' }) }}
   * @example 修改菜单 menuDataRender={(menuData) => { return menuData.map(item => { if (item.name === 'test') { item.name = '测试' } return item }) }}
   * @example 打平数据 menuDataRender={(menuData) => { return menuData.reduce((pre, item) => { return pre.concat(item.children || []) }, []) }}
   */
  menuDataRender: Function as PropType<(menuData: MenuDataItem[]) => MenuDataItem[]>,

  /**
   * 国际化消息处理
   */
  formatMessage: Function as PropType<(message: MessageDescriptor) => string>,

  /**
   *  是否禁用移动端模式
   *
   * @see 有的管理系统不需要移动端模式，此属性设置为true即可
   * @example disableMobile={true}
   */
  disableMobile: { type: Boolean, default: false },

  /**
   * content 的样式
   *
   * @example 背景颜色为红色 contentStyle={{ backgroundColor: 'red '}}
   */
  contentStyle: Object as PropType<CSSProperties>,

  /**
   * 取消 content的 margin
   *
   * @example 取消内容的 margin  disableContentMargin={true}
   */
  disableContentMargin: { type: Boolean, default: false },

  /** 水印的相关配置 */
  waterMarkProps: Object as PropType<WaterMarkProps>,

  /** 是否是子布局 */
  isChildrenLayout: { type: Boolean, default: false }
})

export type BasicLayoutProps = Partial<ExtractPropTypes<ReturnType<typeof basicLayoutProps>>>

const headerRender = (
  props: BasicLayoutProps & { hasSiderMenu: boolean },
  slots: Slots,
  matchMenuKeys: string[] = []
): VNode | null => {
  if (props.headerRender === false || props.pure) {
    return null
  }
  return (
    // @ts-ignore TODO
    <HeaderView matchMenuKeys={matchMenuKeys} {...props}>
      {slots}
    </HeaderView>
  )
}

const footerRender = (props: BasicLayoutProps, slots: Slots): VueNode => {
  if (props.footerRender === false || props.pure) {
    return null
  }

  const render = getRender<FooterRender>(props, slots, 'footerRender')
  if (render) {
    return render({ ...props }, <FooterView>{slots}</FooterView>)
  }
  return null
}

const renderSiderMenu = (
  props: BasicLayoutProps,
  slots: Slots,
  matchMenuKeys: string[] = []
): VueNodeOrRender => {
  // 指定了不渲染或者精简模式直接返回 null
  if (props.menuRender === false || props.pure) {
    return null
  }

  // 如果是顶部导航，且不是手机模式不渲染
  if (props.layout === 'top' && !props.isMobile) {
    return null
  }

  let { menuData } = props

  /** 如果是分割菜单模式，需要专门实现一下 */
  if (props.splitMenus && (props.openKeys !== false || props.layout === 'mix') && !props.isMobile) {
    const [key] = matchMenuKeys
    if (key) {
      menuData = props.menuData?.find(item => item.key === key)?.children || []
    } else {
      menuData = []
    }
  }
  // 这里走了可以少一次循环
  const clearMenuData = clearMenuItem(menuData || [])

  if (clearMenuData && clearMenuData?.length < 1 && props.splitMenus) {
    return null
  }

  const defaultDom = (
    <SiderMenuWrapper
      matchMenuKeys={matchMenuKeys}
      {...props}
      style={
        props.navTheme === 'realDark'
          ? {
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 65%)'
            }
          : {}
      }
      // 这里走了可以少一次循环
      menuData={clearMenuData}
    >
      {slots}
    </SiderMenuWrapper>
  )

  const menuRender = getRender<MenuRender>(props, slots, 'menuRender')
  return menuRender ? menuRender(props, defaultDom) : defaultDom
}

export default defineComponent({
  name: 'BasicLayout',
  props: basicLayoutProps(),
  slots: ['default', 'logo', 'menuHeaderRender', 'menuFooterRender'],
  setup(props, { slots, attrs }) {
    const prefixCls = props.prefixCls ?? getPrefixCls('pro')

    const baseClassName = `${prefixCls}-basicLayout`
    // gen className
    const className = computed(() => [
      'ant-design-pro',
      baseClassName,
      {
        [`screen-${colSize.value}`]: colSize.value,
        [`${baseClassName}-top-menu`]: props.layout === 'top',
        [`${baseClassName}-fix-siderbar`]: props.fixSiderbar,
        [`${baseClassName}-${props.layout}`]: props.layout
      }
    ])

    const contentClassName = computed(() => ({
      [`${baseClassName}-content`]: true,
      [`${baseClassName}-has-header`]: !!headerDom.value,
      [`${baseClassName}-content-disable-margin`]: props.disableContentMargin
    }))

    // TODO，这里处理数据转换为题
    const menuInfoData = computed(() => transformRouteToMenuItem(props.routes || []))

    const colSize = useMediaQuery()

    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs')

    // ToDo collapsed 的双向绑定

    // siderMenuDom 为空的时候，不需要 padding
    const genLayoutStyle: CSSProperties = {
      position: 'relative'
    }

    // if is some layout children, don't need min height
    watchEffect(() => {
      if (props.isChildrenLayout || (props.contentStyle && props.contentStyle.minHeight)) {
        genLayoutStyle.minHeight = '0px'
      }
    })

    // If it is a fix menu, calculate padding
    // don't need padding in phone mode
    const leftSiderWidth = computed(() => {
      const hasLeftPadding = props.layout !== 'top' && !isMobile.value
      if (hasLeftPadding) {
        return props.collapsed ? 48 : props.siderWidth
      }
      return 0
    })

    // render sider dom
    const siderMenuDom = computed(() =>
      renderSiderMenu(
        {
          ...props,
          menuData: menuInfoData.value,
          isMobile: isMobile.value,
          theme: props.navTheme === 'dark' ? 'dark' : 'light',
          prefixCls: prefixCls
        },
        slots,
        props.matchMenuKeys
      )
    )

    // render header dom
    const headerViewProps = computed<BasicLayoutProps & { hasSiderMenu: boolean }>(() => ({
      ...props,
      hasSiderMenu: !!siderMenuDom.value,
      menuData: menuInfoData.value,
      isMobile: isMobile.value,
      theme: props.navTheme === 'dark' ? 'dark' : 'light',
      prefixCls: prefixCls,
      siderWidth: leftSiderWidth.value
    }))
    const headerDom = computed(() =>
      headerRender(headerViewProps.value, slots, props.matchMenuKeys)
    )

    // render footer dom
    const footerDom = computed(() =>
      footerRender(
        {
          ...props,
          isMobile: isMobile.value,
          collapsed: props.collapsed
        },
        slots
      )
    )

    const hasFooterToolbar = ref(false)
    const setHasFooterToolbar = (has: boolean) => {
      hasFooterToolbar.value = has
    }

    // TODO pick 属性，防止传递太多无效数据下去
    const routeContext = reactive({
      ...toRefs(props),
      // breadcrumb: breadcrumbProps,
      // @ts-ignore
      menuDa: menuInfoData.value!,
      isMobile: isMobile.value,
      collapsed: props.collapsed,
      isChildrenLayout: true,
      // title: pageTitleInfo.pageName,
      hasSiderMenu: !!siderMenuDom.value,
      hasHeader: !!headerDom.value,
      siderWidth: leftSiderWidth.value,
      hasFooter: !!footerDom.value,
      hasFooterToolbar: hasFooterToolbar.value,
      setHasFooterToolbar
      // matchMenus,
      // matchMenuKeys,
      // currentMenu,
    })

    provide(routeContextInjectKey, routeContext)

    return () => {
      const multiTabRender = getRender<MultiTabRender>(props, slots, 'multiTabRender')
      const multiTabDom = multiTabRender && multiTabRender(headerViewProps.value)

      return (
        <div class={className.value}>
          <Layout style={{ minHeight: '100%', ...(attrs.style as CSSProperties) }}>
            {siderMenuDom.value}
            <div style={genLayoutStyle} class={'ant-layout'}>
              {headerDom.value}
              {multiTabDom}
              {/*@ts-ignore*/}
              <WrapContent class={contentClassName.value} style={props.contentStyle}>
                {props.loading ? <PageLoading /> : slots.default?.()}
              </WrapContent>
              {footerDom.value}
            </div>
          </Layout>
        </div>
      )
    }
  }
})
