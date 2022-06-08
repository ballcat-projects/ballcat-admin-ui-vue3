import './index.less'

import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons-vue'
import { VueNodeOrRenderPropType, WithFalseVueNodeOrRenderPropType } from '#/types'
import { Layout, Menu, MenuItem } from 'ant-design-vue'
import BaseMenu, { baseMenuProps } from './BaseMenu'

import type { VueNodeOrRender } from '#/types'
import type { WithFalse } from '../../types'
import type { CSSProperties, ExtractPropTypes, FunctionalComponent, PropType, Slots } from 'vue'
import type { SiderProps } from 'ant-design-vue'
import type {
  CollapsedButtonRender,
  MenuContentRender,
  MenuExtraReander,
  MenuFootRender,
  MenuHeaderRender
} from '../../renderTypes'
import { getVueNode, getRender } from '../../utils'

export const siderMenuProps = () => ({
  ...baseMenuProps(),

  logo: {
    type: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,
    default: undefined
  },
  siderWidth: { type: Number, default: 208 },

  /**
   * 菜单 logo 和 title 区域的渲染
   *
   * @example 不要logo : menuHeaderRender={(logo,title)=> title}
   * @example 不要title : menuHeaderRender={(logo,title)=> logo}
   * @example 展开的时候显示title,收起显示 logo： menuHeaderRender={(logo,title,props)=> props.collapsed ? logo : title}
   * @example 不要这个区域了 : menuHeaderRender={false}
   */
  menuHeaderRender: {
    type: WithFalseVueNodeOrRenderPropType as PropType<WithFalse<MenuHeaderRender>>,
    default: undefined
  },

  /**
   * 侧边菜单底部的配置，可以增加一些底部操作
   *
   * @example 底部增加超链接 menuFooterRender={()=><a href="https://pro.ant.design">pro.ant.design</a>}
   * @example 根据收起展开配置不同的 dom  menuFooterRender={()=>collapsed? null :<a href="https://pro.ant.design">pro.ant.design</a>}
   */
  menuFooterRender: {
    type: WithFalseVueNodeOrRenderPropType as PropType<WithFalse<MenuFootRender>>,
    default: undefined
  },

  /**
   * 侧边菜单，菜单区域的处理,可以单独处理菜单的dom
   *
   * @example 增加菜单区域的背景颜色 menuContentRender={(props,defaultDom)=><div style={{backgroundColor:"red"}}>{defaultDom}</div>}
   * @example 某些情况下不显示菜单 menuContentRender={(props)=> return <div>不显示菜单</div>}
   */
  menuContentRender: {
    type: WithFalseVueNodeOrRenderPropType as PropType<WithFalse<MenuContentRender>>,
    default: undefined
  },
  /**
   * 侧边菜单 title 和 logo 下面区域的渲染，一般会增加个搜索框
   *
   * @example  增加一个搜索框 menuExtraRender={()=>(<Search placeholder="请输入" />)}
   * @example  根据收起展开配置不同的 dom： menuExtraRender={()=>collapsed? null : <Search placeholder="请输入" />}
   */
  menuExtraRender: {
    type: WithFalseVueNodeOrRenderPropType as PropType<WithFalse<MenuExtraReander>>,
    default: false
  },

  /**
   * 自定义展开收起按钮的渲染
   *
   * @example 使用文字渲染 collapsedButtonRender={(collapsed)=>collapsed?"展开":"收起"})}
   * @example 使用icon渲染 collapsedButtonRender={(collapsed)=>collapsed?<MenuUnfoldOutlined />:<MenuFoldOutlined />}
   * @example 不渲染按钮 collapsedButtonRender={false}
   */
  collapsedButtonRender: {
    type: WithFalseVueNodeOrRenderPropType as PropType<WithFalse<CollapsedButtonRender>>,
    default: undefined
  },

  /**
   * 菜单是否收起的断点，设置成false 可以禁用
   *
   * @example 禁用断点  breakpoint={false}
   * @example 最小的屏幕再收起 breakpoint={'xs'}
   */
  breakpoint: {
    type: [String, Boolean] as PropType<SiderProps['breakpoint'] | false>,
    default: 'lg'
  },

  /**
   * 菜单顶部logo 和 title 区域的点击事件
   *
   * @example 点击跳转到首页 onMenuHeaderClick={()=>{ history.push('/') }}
   */
  onMenuHeaderClick: {
    type: Function as PropType<(e: MouseEvent) => void>,
    default: undefined
  },

  /**
   * 侧边菜单底部的一些快捷链接
   *
   * @example links={[<a href="ant.design"> 访问官网 </a>,<a href="help.ant.design"> 帮助 </a>]}
   */
  links: {
    type: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,
    default: undefined
  },

  // TODO 这个放到事件里面
  onOpenChange: {
    type: Function as PropType<(openKeys: WithFalse<string[]>) => void>,
    default: undefined
  },
  getContainer: { type: Boolean, default: false },
  logoStyle: {
    type: Object as PropType<CSSProperties>,
    default: () => undefined
  },
  hide: { type: Boolean, default: undefined }
})

export type SiderMenuProps = Partial<ExtractPropTypes<ReturnType<typeof siderMenuProps>>>

export const privateSiderMenuProps = () => ({
  matchMenuKeys: Array as PropType<string[]>
})

export type PrivateSiderMenuProps = Partial<
  ExtractPropTypes<ReturnType<typeof privateSiderMenuProps>>
>

export const defaultRenderLogo = (
  logo: VueNodeOrRender | (() => VueNodeOrRender)
): VueNodeOrRender => {
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" />
  }
  if (typeof logo === 'function') {
    return logo()
  }
  return logo
}

export const defaultRenderLogoAndTitle = (
  props: SiderMenuProps,
  slots: Slots,
  renderKey = 'menuHeaderRender'
): VueNodeOrRender => {
  if (props.layout === 'mix' && renderKey === 'menuHeaderRender') {
    return null
  }

  const renderFunction = getRender<MenuHeaderRender>(props, slots, renderKey)
  if (renderFunction === false) {
    return null
  }

  const logRender = getRender<VueNodeOrRender>(props, slots, 'logo')
  const logoDom = defaultRenderLogo(logRender)

  const titleRender = getVueNode(props.title, slots.title)
  const titleDom = <h1>{titleRender ?? 'Ball Cat'}</h1>

  if (renderFunction) {
    // when collapsed, no render title
    return renderFunction(props, logoDom, props.collapsed ? null : titleDom)
  }

  return (
    <a>
      {logoDom}
      {props.collapsed ? null : titleDom}
    </a>
  )
}

export const defaultRenderCollapsedButton = (collapsed?: boolean) =>
  collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />

function getCollapsedButtonRender(props: SiderMenuProps & PrivateSiderMenuProps, slots: Slots) {
  if (props.collapsedButtonRender == false) {
    return false
  }
  const render = getRender<CollapsedButtonRender>(props, slots, 'collapsedButtonRender')
  return render || defaultRenderCollapsedButton
}

const SiderMenu: FunctionalComponent<SiderMenuProps & PrivateSiderMenuProps> = (
  props,
  { slots, attrs }
) => {
  const baseClassName = `${props.prefixCls}-sider`
  const siderClassName = {
    [`${baseClassName}`]: true,
    [`${baseClassName}-fixed`]: props.fixSiderbar,
    [`${baseClassName}-layout-${props.layout}`]: props.layout && !props.isMobile,
    [`${baseClassName}-light`]: props.theme !== 'dark'
  }

  const headerDom = defaultRenderLogoAndTitle(props, slots)

  // const { flatMenuKeys } = MenuCounter.useContainer()
  const flatMenuKeys: string[] = []
  const extraDom = props.menuExtraRender && props.menuExtraRender(props)
  const menuDom = props.menuContentRender !== false && flatMenuKeys && (
    <BaseMenu
      {...props}
      key="base-menu"
      mode="inline"
      // @ts-ignore
      handleOpenChange={props.onOpenChange}
      style={{ width: '100%' }}
      class={`${baseClassName}-menu`}
    />
  )

  const menuRenderDom = props.menuContentRender ? props.menuContentRender(props, menuDom) : menuDom

  const collapsedButtonRender = getCollapsedButtonRender(props, slots)

  const menuFooterRender = getRender<MenuFootRender>(props, slots, 'menuFooterRender')

  return (
    <>
      {props.fixSiderbar && (
        <div
          class={`${baseClassName}-fix-place`}
          style={{
            width: `${props.collapsed ? 48 : props.siderWidth}px`,
            overflow: 'hidden',
            flex: `0 0 ${props.collapsed ? 48 : props.siderWidth}px`,
            maxWidth: `${props.collapsed ? 48 : props.siderWidth}px`,
            minWidth: `${props.collapsed ? 48 : props.siderWidth}px`,
            transition: `background-color 0.3s, min-width 0.3s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`,
            ...(attrs.style as CSSProperties)
          }}
        />
      )}
      <Layout.Sider
        collapsible
        trigger={null}
        collapsed={props.collapsed}
        breakpoint={props.breakpoint === false ? undefined : props.breakpoint}
        onCollapse={collapse => {
          if (props.isMobile) return
          props.onCollapse?.(collapse)
        }}
        collapsedWidth={48}
        style={{
          overflow: 'hidden',
          paddingTop:
            props.layout === 'mix' && !props.isMobile ? `${props.headerHeight}px` : undefined,
          ...(attrs.style as CSSProperties)
        }}
        width={props.siderWidth}
        theme={props.theme}
        class={siderClassName}
      >
        {headerDom && (
          <div
            class={[
              `${baseClassName}-logo`,
              {
                [`${baseClassName}-collapsed`]: props.collapsed
              }
            ]}
            onClick={props.layout !== 'mix' ? props.onMenuHeaderClick : undefined}
            id="logo"
            style={props.logoStyle}
          >
            {headerDom}
          </div>
        )}
        {extraDom && (
          <div class={`${baseClassName}-extra ${!headerDom && `${baseClassName}-extra-no-logo`}`}>
            {extraDom}
          </div>
        )}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {menuRenderDom}
        </div>
        <div class={`${baseClassName}-links`}>
          {collapsedButtonRender !== false && (
            <Menu
              theme={props.theme}
              inlineIndent={16}
              class={`${baseClassName}-link-menu`}
              selectedKeys={[]}
              openKeys={[]}
              mode="inline"
            >
              <MenuItem
                key={'collapsed'}
                class={`${baseClassName}-collapsed-button`}
                title={false}
                onClick={() => {
                  if (props.onCollapse) {
                    props.onCollapse(!props.collapsed)
                  }
                }}
              >
                {collapsedButtonRender(props.collapsed)}
              </MenuItem>
            </Menu>
          )}
        </div>
        {menuFooterRender && (
          <div
            class={[
              `${baseClassName}-footer`,
              { [`${baseClassName}-footer-collapsed`]: !props.collapsed }
            ]}
          >
            {menuFooterRender(props)}
          </div>
        )}
      </Layout.Sider>
    </>
  )
}

export default SiderMenu
