import './index.less'

import { getRender } from '../../utils'
import {
  defaultRenderCollapsedButton,
  defaultRenderLogo,
  defaultRenderLogoAndTitle,
  privateSiderMenuProps
} from '../SiderMenu/SiderMenu'
import { pureSettingsProps } from '../../defaultSettings'

import type { MenuDataItem, WithFalse } from '../../types'
import type { PureSettings } from '../../defaultSettings'
import type { HeaderViewProps } from '../../Header'
import type { CSSProperties, PropType, ExtractPropTypes } from 'vue'
import type { SiderMenuProps } from '../SiderMenu/SiderMenu'
import type { HeaderContentRender, MenuRender, RightContentRender } from '../../renderTypes'
import { VueNodeOrRenderPropType } from '#/types'
import type { VueNodeOrRender } from '#/types'
import TopNavHeader from '#/layout/components/TopNavHeader'
import { clearMenuItem } from '#/layout/utils/utils'

export const globalHeaderProps = () => ({
  ...privateSiderMenuProps(),
  ...pureSettingsProps,
  // 覆盖下默认值
  headerTheme: {
    type: String as PropType<PureSettings['headerTheme']>,
    default: 'dark'
  },

  // 自有属性
  collapsed: { type: Boolean, default: undefined },
  onCollapse: {
    type: Function as PropType<(collapsed: boolean) => void>,
    default: undefined
  },
  isMobile: { type: Boolean, default: undefined },
  logo: {
    type: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,
    default: () => undefined
  },
  /**
   * 虽然叫menuRender，但是其实是整个 SiderMenu 面板的渲染函数
   *
   * @example 收起时完成不展示菜单 menuRender={(props,defaultDom)=> props.collapsed ? null : defaultDom}
   * @example 不展示菜单 menuRender={false}
   */
  menuRender: {
    type: [Function, Boolean] as PropType<WithFalse<MenuRender>>,
    default: () => undefined
  },
  /**
   * 右侧顶部操作区域的渲染逻辑,一般会展示一个头像和一些操作
   *
   * @example 展示一个头像: rightRender={(props) => <Avatar shape="square" size="small" icon={<UserOutlined />} />}
   * @example 展示一些操作: rightRender={(props) => [<Button type="primary">操作</Button>,<Button type="primary">管理控制台</Button>]}
   */
  rightContentRender: {
    type: [Function, Boolean] as PropType<WithFalse<RightContentRender>>,
    default: () => undefined
  },
  prefixCls: { type: String, default: undefined },
  menuData: {
    type: Array as PropType<MenuDataItem[]>,
    default: () => undefined
  },
  onMenuHeaderClick: Function as PropType<(e: MouseEvent) => void>,

  menuHeaderRender: {
    type: [Function, Boolean] as PropType<SiderMenuProps['menuHeaderRender']>,
    default: undefined
  },

  /**
   *顶部区域的渲染，包含内部的 menu
   *
   * @example headerContentRender={(props) => <div>管理控制台 </div>}
   */
  headerContentRender: {
    type: [Function, Boolean] as PropType<WithFalse<HeaderContentRender>>,
    default: undefined
  },
  collapsedButtonRender: {
    type: [Function, Boolean] as PropType<SiderMenuProps['collapsedButtonRender']>,
    default: () => defaultRenderCollapsedButton
  },
  splitMenus: { type: Boolean, default: undefined }
})

export type GlobalHeaderProps = Partial<ExtractPropTypes<ReturnType<typeof globalHeaderProps>>>

const renderLogo = (
  props: SiderMenuProps,
  menuHeaderRender: SiderMenuProps['menuHeaderRender'],
  logoDom: VueNodeOrRender
) => {
  if (menuHeaderRender === false) {
    return null
  }
  if (menuHeaderRender) {
    return menuHeaderRender(props, logoDom, null)
  }
  return logoDom
}

export default defineComponent({
  name: 'GlobalHeader',
  props: globalHeaderProps(),
  setup(props, { slots, attrs }) {
    // TODO 布局方向支持
    const direction = undefined

    const baseClassName = `${props.prefixCls}-global-header`
    const className = computed(() => [
      attrs.class,
      baseClassName,
      { [`${baseClassName}-layout-${props.layout}`]: props.layout && props.headerTheme === 'dark' }
    ])

    return () => {
      if (props.layout === 'mix' && !props.isMobile && props.splitMenus) {
        const noChildrenMenuData = (props.menuData || []).map(item => ({
          ...item,
          children: undefined
        }))
        const clearMenuData = clearMenuItem(noChildrenMenuData)
        return (
          <TopNavHeader
            mode="horizontal"
            {...props}
            splitMenus={false}
            menuData={clearMenuData}
            theme={props.headerTheme as 'light' | 'dark'}
          >
            {slots}
          </TopNavHeader>
        )
      }

      const logoClassNames = [
        `${baseClassName}-logo`,
        { [`${baseClassName}-logo-rtl`]: direction === 'rtl' }
      ]

      // 添加 slots 支持
      const logoRender = getRender<VueNodeOrRender>(props, slots, 'logo')
      const logoDom = (
        <span class={logoClassNames} key="logo">
          <a>{defaultRenderLogo(logoRender)}</a>
        </span>
      )

      const rightContentRender = getRender<RightContentRender>(props, slots, 'rightContentRender')

      return (
        <div class={className.value} style={attrs.style as CSSProperties}>
          {props.isMobile && renderLogo(props, props.menuHeaderRender, logoDom)}
          {props.isMobile && props.collapsedButtonRender && (
            <span
              class={`${baseClassName}-collapsed-button`}
              onClick={() => {
                if (props.onCollapse) {
                  props.onCollapse(!props.collapsed)
                }
              }}
            >
              {props.collapsedButtonRender(props.collapsed)}
            </span>
          )}
          {props.layout === 'mix' && !props.isMobile && (
            <>
              <div class={logoClassNames} onClick={props.onMenuHeaderClick}>
                {defaultRenderLogoAndTitle(
                  { ...props, collapsed: false },
                  slots,
                  'headerTitleRender'
                )}
              </div>
            </>
          )}
          <div style={{ flex: 1 }}>{slots.default?.()}</div>
          {rightContentRender && rightContentRender(props as HeaderViewProps)}
        </div>
      )
    }
  }
})
