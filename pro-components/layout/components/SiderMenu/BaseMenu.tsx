import './index.less'

import { menuProps } from 'ant-design-vue/es/menu/src/Menu'
import { pureSettingsProps, defaultSettings } from '../../defaultSettings'
import { isImg, isUrl } from '../../utils/checkUtils'
import { Menu, Skeleton } from 'ant-design-vue'
import Icon, { createFromIconfontCN } from '@ant-design/icons-vue'

import type { MenuDataItem, MessageDescriptor, WithFalse } from '../../types'
import type { MenuProps, MenuTheme } from 'ant-design-vue'
import type { MenuItemRender, SubMenuItemRender } from '../../renderTypes'
import type { PropType, ExtractPropTypes } from 'vue'
import type { SelectEventHandler, SelectInfo } from 'ant-design-vue/es/menu/src/interface'
import type { Key } from 'ant-design-vue/es/_util/type'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import omit from 'ant-design-vue/es/_util/omit'
import { WithFalseVueNodeOrRenderPropType } from '#/types'
import type { VueNodeOrRender } from '#/types'
import { redirectPath } from '@/config'
import AntIcon from '#/layout/components/AntIcon/index'

export const baseMenuProps = () => ({
  ...omit(menuProps(), ['openKeys', 'onOpenChange']),
  ...pureSettingsProps,

  /** 默认的是否展开，会受到 breakpoint 的影响 */
  defaultCollapsed: { type: Boolean, default: undefined },
  collapsed: { type: Boolean, default: undefined },
  splitMenus: { type: Boolean, default: undefined },
  isMobile: { type: Boolean, default: undefined },
  menuData: Array as PropType<MenuDataItem[]>,
  onCollapse: Function as PropType<(collapsed: boolean) => void>,
  openKeys: [Array, Boolean] as PropType<WithFalse<string[]> | undefined>,
  handleOpenChange: Function as PropType<(openKeys: Key[]) => void>,
  iconPrefixes: String,
  /** 要给菜单的props, 参考antd-menu的属性。https://ant.design/components/menu-cn/ */
  menuProps: Object as PropType<MenuProps>,
  theme: String as PropType<MenuTheme>,
  formatMessage: Function as PropType<(message: MessageDescriptor) => string>,

  /**
   * 处理父级菜单的 props，可以复写菜单的点击功能，一般用于埋点
   * @see 子级的菜单要使用 menuItemRender 来处理
   *
   * @example 使用 a 标签跳转到特殊的地址 subMenuItemRender={(item, defaultDom) => { return <a onClick={()=> history.push(item.path) }>{defaultDom}</a> }}
   * @example 增加埋点 subMenuItemRender={(item, defaultDom) => { return <a onClick={()=> log.click(item.name) }>{defaultDom}</a> }}
   */
  subMenuItemRender: WithFalseVueNodeOrRenderPropType as PropType<SubMenuItemRender>,

  /**
   * 处理菜单的 props，可以复写菜单的点击功能，一般结合 Router 框架使用
   * @see 非子级的菜单要使用 subMenuItemRender 来处理
   *
   * @example 使用 a 标签 menuItemRender={(item, defaultDom) => { return <a onClick={()=> history.push(item.path) }>{defaultDom}</a> }}
   * @example 使用 Link 标签 menuItemRender={(item, defaultDom) => { return <Link to={item.path}>{defaultDom}</Link> }}
   */
  menuItemRender: WithFalseVueNodeOrRenderPropType as PropType<MenuItemRender>,

  /**
   * 处理 menuData 的方法，与 menuDataRender 不同，postMenuData处理完成后会直接渲染，不再进行国际化和拼接处理
   *
   * @example 增加菜单图标 postMenuData={(menuData) => { return menuData.map(item => { return { ...item, icon: <Icon type={item.icon} /> } }) }}
   */
  postMenuData: {
    type: Function as PropType<(menusData?: MenuDataItem[]) => MenuDataItem[]>,
    default: (data?: MenuDataItem[]) => data || []
  }
})

export type BaseMenuProps = Partial<ExtractPropTypes<ReturnType<typeof baseMenuProps>>>

let IconFont = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl
})

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'icon-geren' #For Iconfont ,
//   icon: 'http://demo.com/icon.png',
//   icon: '/favicon.png',
//   icon: <Icon type="setting" />,
const getIcon = (icon?: string | VueNodeOrRender, iconPrefixes = 'icon-'): VueNodeOrRender => {
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      return (
        <Icon component={() => <img src={icon} alt="icon" class="ant-pro-sider-menu-icon" />} />
      )
    }
    if (icon.startsWith(iconPrefixes)) {
      return <IconFont type={icon} />
    }
    // @ts-ignore
    return <AntIcon type={icon} />
  }
  return icon
}

class MenuUtil {
  constructor(props: BaseMenuProps) {
    this.props = props
  }

  props: BaseMenuProps

  getNavMenuItems = (menusData: MenuDataItem[] = [], isChildren: boolean) =>
    menusData.map(item => this.getSubMenuOrItem(item, isChildren)).filter(item => item)

  /** Get SubMenu or Item */
  getSubMenuOrItem = (item: MenuDataItem, isChildren: boolean): any => {
    const children = item?.children || item?.routes
    if (Array.isArray(children) && children.length > 0) {
      const name = this.getIntlName(item)
      const { subMenuItemRender, prefixCls, menu, iconPrefixes } = this.props
      //  get defaultTitle by menuItemRender
      const defaultTitle = item.icon ? (
        <span class={`${prefixCls}-menu-item`} title={name}>
          {getIcon(item.icon, iconPrefixes)}
          <span class={`${prefixCls}-menu-item-title`}>{name}</span>
        </span>
      ) : (
        <span class={`${prefixCls}-menu-item`} title={name}>
          {name}
        </span>
      )

      // subMenu only title render
      const title = subMenuItemRender
        ? subMenuItemRender({ ...item, isUrl: false }, defaultTitle, this.props)
        : defaultTitle

      const MenuParent = menu?.type === 'group' ? Menu.ItemGroup : Menu.SubMenu
      return (
        <MenuParent key={item.key || item.path} title={title} onTitleClick={item.onTitleClick}>
          {this.getNavMenuItems(children, true)}
        </MenuParent>
      )
    }

    return (
      <Menu.Item
        key={item.key || item.path}
        disabled={item.disabled}
        onClick={(e: Event) => {
          if (isUrl(item?.path)) {
            window.open(item.path, '_blank')
          }
          item.onTitleClick?.(e)
        }}
      >
        {{
          default: () => this.getMenuItemPath(item),
          icon: () => getIcon(item.icon, this.props.iconPrefixes)
        }}
      </Menu.Item>
    )
  }

  getIntlName = (item: MenuDataItem) => {
    const { name, locale } = item
    const { menu, formatMessage } = this.props
    if (locale && menu?.locale !== false) {
      return formatMessage?.({
        id: locale,
        defaultMessage: name
      })
    }
    return name
  }

  /**
   * 判断是否是http链接.返回 Link 或 a Judge whether it is http link.return a or Link
   *
   * @memberof SiderMenu
   */
  getMenuItemPath = (item: MenuDataItem): VueNodeOrRender => {
    const itemPath = this.conversionPath(item.path || '/')

    // TODO 这个 location 的传递问题
    //const { location = { pathname: '/' } } = this.props
    const location = { pathname: '/' }
    // if local is true formatMessage all name。
    const name = this.getIntlName(item)
    const { prefixCls } = this.props
    const isHttpUrl = isUrl(itemPath)
    const defaultItem = (
      <span class={[`${prefixCls}-menu-item`, { [`${prefixCls}-menu-item-link`]: isHttpUrl }]}>
        <span class={`${prefixCls}-menu-item-title`}>{name}</span>
      </span>
    )

    if (this.props.menuItemRender) {
      const renderItemProps = {
        ...item,
        isUrl: isHttpUrl,
        itemPath,
        isMobile: this.props.isMobile,
        replace: itemPath === location.pathname,
        onClick: () => {
          if (isHttpUrl) window.open(itemPath)
          if (this.props.onCollapse) this.props.onCollapse(true)
        },
        children: undefined
      }
      return this.props.menuItemRender(renderItemProps, defaultItem, this.props)
    }
    return defaultItem
  }

  conversionPath = (path: string) => {
    if (path && path.indexOf('http') === 0) {
      return path
    }
    return `/${path || ''}`.replace(/\/+/g, '/')
  }
}

function getOpenKeys(props: BaseMenuProps, route: RouteLocationNormalizedLoaded) {
  // 折叠的时候，或者 top 菜单模式的时候，openKeys 需要置空
  if (!props.collapsed && ['side', 'mix'].includes(props.layout || 'mix')) {
    return route.matched.filter(r => r.path !== route.path && r.path !== '/').map(r => r.path)
  }

  return []
}

export default defineComponent({
  name: 'BaseMenu',
  inheritAttrs: false,
  props: baseMenuProps(),
  setup(props, { attrs }) {
    // TODO defaultOpenAll 支持，目前 react 版本的示例中是无效果的，所以这里暂时不处理
    // const initOpenKeys = () => {
    //   if (props.menu?.defaultOpenAll) {
    //     return getOpenKeysFromMenuData(props.menuData) || []
    //   }
    //   return props.openKeys || []
    // }
    // 根据路由赋值当前选中和打开的菜单
    const route = useRoute()
    const localOpenKeys = ref<Key[]>([])
    const localSelectedKeys = ref<string[]>([])
    watchEffect(() => {
      // 进行 redirect 的时候不处理，如果要把高级组件剥离，这个前缀不能写死需要透传过来
      if (route.path.startsWith(redirectPath)) return
      localOpenKeys.value = getOpenKeys(props, route)
      localSelectedKeys.value = route.matched.filter(x => x.path !== '/').map(x => x.path)
    })

    console.log(props.menuData)

    // 选中菜单的时候进行路由切换
    const router = useRouter()
    const handleSelect: SelectEventHandler = (args: SelectInfo): void => {
      // 忽略外链类型
      if (isUrl(args.key as string)) {
        return
      }
      router.push(args.key as string)
      localSelectedKeys.value = args.selectedKeys as string[]
      // emit('update:selectedKeys', args.selectedKeys)
    }

    // 打开菜单时候的触发事件 TODO 支持排他展开
    const defaultHandleOpenChange = (openKeys: Key[]) => {
      localOpenKeys.value = openKeys
    }
    const handleOpenChange = props.handleOpenChange ?? defaultHandleOpenChange

    watchEffect(() => {
      // reset IconFont
      if (props.iconfontUrl) {
        IconFont = createFromIconfontCN({
          scriptUrl: props.iconfontUrl
        })
      }
    })

    const cls = computed(() => [attrs.class, { 'top-nav-menu': props.mode === 'horizontal' }])

    // sync props
    const menuUtils = new MenuUtil(props)

    return () => {
      if (props.menu?.loading) {
        return (
          <div
            style={
              props.mode?.includes('inline')
                ? { padding: 24 }
                : {
                    marginTop: 16
                  }
            }
          >
            <Skeleton
              active
              title={false}
              paragraph={{
                rows: props.mode?.includes('inline') ? 6 : 1
              }}
            />
          </div>
        )
      }

      const finallyData = props.postMenuData ? props.postMenuData(props.menuData) : props.menuData
      if (finallyData && finallyData?.length < 1) {
        return null
      }
      return (
        <Menu
          key="Menu"
          mode={props.mode}
          inlineIndent={16}
          theme={props.theme}
          style={attrs.style}
          class={cls.value}
          openKeys={localOpenKeys.value}
          selectedKeys={localSelectedKeys.value}
          onSelect={handleSelect}
          onOpenChange={handleOpenChange}
          {...props.menuProps}
        >
          {menuUtils.getNavMenuItems(finallyData, false)}
        </Menu>
      )
    }
  }
})
