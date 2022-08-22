import type { TabPaneProps } from 'ant-design-vue'
import { Tooltip, Space, Tabs } from 'ant-design-vue'
import type { ListToolBarHeaderMenuProps } from './HeaderMenu'
import HeaderMenu from './HeaderMenu'

import './index.less'
import type { CSSProperties, FunctionalComponent } from 'vue'
import type { VueKey, VueNode } from '#/types'
import useMediaQuery from '../../../utils/hooks/useMediaQuery'
import type { LabelTooltipType, SearchProps } from '../../typing'
import { getPrefixCls } from '#/layout/RouteContext'
import { computed } from 'vue'
import LabelIconTip from '../../../utils/components/LabelIconTip'
import { isValidElement } from '#/utils/isValidElement'

export type ListToolBarSetting = {
  icon: VueNode
  tooltip?: LabelTooltipType | string
  key?: string
  onClick?: (key?: string) => void
}

/** Antd 默认直接导出了 rc 组件中的 Tab.Pane 组件。 */
type TabPane = TabPaneProps & {
  key?: string
}

export type ListToolBarTabs = {
  activeKey?: string
  onChange?: (activeKey: VueKey) => void
  items?: TabPane[]
}

export type ListToolBarMenu = ListToolBarHeaderMenuProps

type SearchPropType = SearchProps | VueNode | boolean
type SettingPropType = VueNode | ListToolBarSetting

export type ListToolBarProps = {
  prefixCls?: string
  /** 标题 */
  title?: VueNode
  /** 副标题 */
  subTitle?: VueNode
  /** 标题提示 */
  tooltip?: string | LabelTooltipType
  /** 搜索输入栏相关配置 */
  search?: SearchPropType
  /** 搜索回调 */
  onSearch?: (keyWords: string) => void
  /** 工具栏右侧操作区 */
  actions?: VueNode[]
  /** 工作栏右侧设置区 */
  settings?: SettingPropType[]
  /** 是否多行展示 */
  multipleLine?: boolean
  /** 过滤区，通常配合 LightFilter 使用 */
  filter?: VueNode
  /** 标签页配置，仅当 `multipleLine` 为 true 时有效 */
  tabs?: ListToolBarTabs
  /** 菜单配置 */
  menu?: ListToolBarMenu
}

/**
 * 获取配置区域 DOM Item
 *
 * @param setting 配置项
 */
function getSettingItem(setting: SettingPropType) {
  if (isValidElement(setting)) {
    return setting
  }
  if (setting) {
    const settingConfig: ListToolBarSetting = setting as ListToolBarSetting
    const { icon, tooltip, onClick, key } = settingConfig
    if (icon && tooltip) {
      return (
        <Tooltip title={tooltip as VueNode}>
          <span
            key={key}
            onClick={() => {
              if (onClick) {
                onClick(key)
              }
            }}
          >
            {icon}
          </span>
        </Tooltip>
      )
    }
    return icon
  }
  return null
}

const ListToolBarTabBar: FunctionalComponent<{
  prefixCls: string
  filtersNode: VueNode
  multipleLine: boolean
  tabs: ListToolBarProps['tabs']
}> = ({ prefixCls, tabs = {}, multipleLine, filtersNode }) => {
  if (!multipleLine) return null
  return (
    <div class={`${prefixCls}-extra-line`}>
      {tabs.items && tabs.items.length ? (
        <Tabs activeKey={tabs.activeKey} onChange={tabs.onChange} tabBarExtraContent={filtersNode}>
          {tabs.items.map((tab, index) => (
            <Tabs.TabPane key={tab.key || index} {...tab} />
          ))}
        </Tabs>
      ) : (
        filtersNode
      )}
    </div>
  )
}
const ListToolBar: FunctionalComponent<ListToolBarProps> = (
  {
    prefixCls: customizePrefixCls,
    title,
    subTitle,
    tooltip,
    // search,
    // onSearch,
    multipleLine = false,
    filter,
    actions = [],
    settings = [],
    tabs = {},
    menu
  },
  { attrs }
) => {
  // const intl = useIntl()

  const colSize = useMediaQuery()

  const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs')

  // const placeholder = intl.getMessage('tableForm.inputPlaceholder', '请输入')

  /**
   * 获取搜索栏 DOM
   *
   * @param search 搜索框相关配置
   */
  const searchNode = null
  // const searchNode = useMemo(() => {
  //   if (!search) {
  //     return null
  //   }
  //   if (React.isValidElement(search)) {
  //     return search
  //   }
  //   return (
  //     <Input.Search
  //       style={{ width: 200 }}
  //       placeholder={placeholder}
  //       {...(search as SearchProps)}
  //       onSearch={(...restParams) => {
  //         onSearch?.(restParams?.[0])
  //         ;(search as SearchProps).onSearch?.(...restParams)
  //       }}
  //     />
  //   )
  // }, [placeholder, onSearch, search])

  const prefixCls = getPrefixCls('pro-table-list-toolbar', customizePrefixCls)

  /** 轻量筛选组件 */
  const filtersNode = computed(() => {
    if (filter) return <div class={`${prefixCls}-filter`}>{filter}</div>
    return null
  })

  /** 有没有 title，需要结合多个场景判断 */
  const hasTitle = computed(() => menu || title || subTitle || tooltip)

  /** 没有 key 的时候帮忙加一下 key 不加的话很烦人 */
  const actionDom = computed(() => {
    if (!Array.isArray(actions)) {
      return actions
    }
    if (actions.length < 1) {
      return null
    }
    return <Space align="center">{actions}</Space>
  })

  const hasRight = computed(() => {
    return (
      (hasTitle.value && searchNode) ||
      (!multipleLine && filtersNode) ||
      actionDom ||
      settings?.length
    )
  })

  const hasLeft = computed(
    () => tooltip || title || subTitle || menu || (!hasTitle.value && searchNode)
  )

  const leftTitleDom = computed(() => {
    // 保留dom是为了占位，不然 right 就变到左边了
    if (!hasLeft.value && hasRight.value) {
      return <div class={`${prefixCls}-left`} />
    }

    // 减少 space 的dom，渲染的时候能节省点性能
    if (!menu && (hasTitle.value || !searchNode)) {
      return (
        <div class={`${prefixCls}-left`}>
          <div class={`${prefixCls}-title`}>
            <LabelIconTip tooltip={tooltip} label={title} subTitle={subTitle} />
          </div>
        </div>
      )
    }
    return (
      <Space class={`${prefixCls}-left`}>
        {hasTitle.value && !menu && (
          <div class={`${prefixCls}-title`}>
            <LabelIconTip tooltip={tooltip} label={title} subTitle={subTitle} />
          </div>
        )}
        {menu && <HeaderMenu {...menu} prefixCls={prefixCls} />}
        {!hasTitle.value && searchNode ? (
          <div class={`${prefixCls}-search`}>{searchNode}</div>
        ) : null}
      </Space>
    )
  })

  const rightTitleDom = computed(() => {
    if (!hasRight.value) return null
    return (
      <Space
        class={`${prefixCls}-right`}
        direction={isMobile.value ? 'vertical' : 'horizontal'}
        size={16}
        align={isMobile.value ? 'end' : 'center'}
      >
        {hasTitle.value && searchNode ? (
          <div class={`${prefixCls}-search`}>{searchNode}</div>
        ) : null}
        {!multipleLine ? filtersNode.value : null}
        {actionDom.value}
        {settings?.length ? (
          <Space size={12} align="center" class={`${prefixCls}-setting-items`}>
            {settings.map((setting, index) => {
              const settingItem = getSettingItem(setting)
              return (
                <div key={index} class={`${prefixCls}-setting-item`}>
                  {settingItem}
                </div>
              )
            })}
          </Space>
        ) : null}
      </Space>
    )
  })

  const titleNode = computed(() => {
    if (!hasRight.value && !hasLeft.value) return null
    const containerClassName = [
      `${prefixCls}-container`,
      {
        [`${prefixCls}-container-mobile`]: isMobile.value
      }
    ]
    return (
      <div class={containerClassName}>
        {leftTitleDom.value}
        {rightTitleDom.value}
      </div>
    )
  })

  return (
    <div style={attrs.style as CSSProperties} class={[`${prefixCls}`, attrs.class]}>
      {titleNode.value}
      <ListToolBarTabBar
        filtersNode={filtersNode.value}
        prefixCls={prefixCls}
        tabs={tabs}
        multipleLine={multipleLine}
      />
    </div>
  )
}

export default ListToolBar
