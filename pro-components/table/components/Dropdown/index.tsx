import './index.less'

import { DownOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import type { MenuItemProps } from 'ant-design-vue'
import { Dropdown, Menu, Button } from 'ant-design-vue'
import type { VueNode } from '../../../types'
import type { CSSProperties, FunctionalComponent } from 'vue'
import { getPrefixCls } from '../../../layout/RouteContext'

interface MenuItems extends MenuItemProps {
  name: VueNode
  key: string
  title?: string
}

export type DropdownProps = {
  menus?: MenuItems[]
  onSelect?: (key: string) => void
}

/**
 * 一个简单的下拉菜单
 */
const DropdownButton: FunctionalComponent<DropdownProps> = (
  { menus, onSelect },
  { attrs, slots }
) => {
  const tempClassName = getPrefixCls('pro-table-dropdown')
  const menu = (
    <Menu onClick={params => onSelect && onSelect(params.key as string)}>
      {menus?.map(item => (
        <Menu.Item key={item.key}>{item.name}</Menu.Item>
      ))}
    </Menu>
  )
  return (
    <Dropdown overlay={menu} class={[tempClassName, attrs.class]}>
      <Button style={attrs.style}>
        {slots.default?.()} <DownOutlined />
      </Button>
    </Dropdown>
  )
}

const TableDropdown: FunctionalComponent<DropdownProps> & {
  Button: typeof DropdownButton
} = ({ onSelect, menus = [] }, { attrs, slots }) => {
  const className = getPrefixCls('pro-table-dropdown')
  const menu = (
    <Menu
      onClick={params => {
        onSelect?.(params.key as string)
      }}
    >
      {menus.map(({ key, name, ...rest }) => (
        <Menu.Item key={key} {...rest}>
          {name}
        </Menu.Item>
      ))}
    </Menu>
  )
  return (
    <Dropdown overlay={menu} class={[className, attrs.class]}>
      <a style={attrs.style as CSSProperties}>{slots.default?.() || <EllipsisOutlined />}</a>
    </Dropdown>
  )
}

TableDropdown.Button = DropdownButton

export default TableDropdown
