import { Dropdown, Menu, Space, Tabs } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import './index.less'
import type { VueKey, VueNode } from '../../../types'
import type { ExtractPropTypes, PropType } from 'vue'
import { computed, defineComponent } from 'vue'

export type ListToolBarMenuItem = {
  key: VueKey
  label: VueNode
  disabled?: boolean
}

// export type ListToolBarHeaderMenuProps = {
//   type?: 'inline' | 'dropdown' | 'tab'
//   activeKey?: VueKey
//   items?: ListToolBarMenuItem[]
//   onChange?: (activeKey?: VueKey) => void
//   prefixCls?: string
// }

export const listToolBarHeaderMenuProps = () => ({
  type: { type: String as PropType<'inline' | 'dropdown' | 'tab'>, default: 'inline' },
  activeKey: { type: [String, Number] as PropType<VueKey>, default: undefined },
  items: { type: Array as PropType<ListToolBarMenuItem[]>, default: () => [] },
  prefixCls: String,
  onChange: { type: Function as PropType<(activeKey?: VueKey) => void> },
  'onUpdate:activeKey': { type: Function as PropType<(key: VueKey) => void> }
})

export type ListToolBarHeaderMenuProps = Partial<
  ExtractPropTypes<ReturnType<typeof listToolBarHeaderMenuProps>>
>

const HeaderMenu = defineComponent({
  name: 'HeaderMenu',
  props: listToolBarHeaderMenuProps(),
  emits: ['update:activeKey'],
  setup(props, { emit }) {
    const localActiveKey = ref<VueKey | undefined>(props.activeKey)
    const setActiveKey = (key: VueKey) => {
      localActiveKey.value = key
      emit('update:activeKey', key)
      props.onChange?.(key)
    }

    if (props.items.length < 1) {
      return null
    }

    const activeItem = computed(
      () =>
        props.items.find(item => {
          return item.key === localActiveKey.value
        }) || props.items[0]
    )

    return () => {
      if (props.type === 'inline') {
        return (
          <div class={[`${props.prefixCls}-menu`, `${props.prefixCls}-inline-menu`]}>
            {props.items.map((item, index) => (
              <div
                key={item.key || index}
                onClick={() => {
                  setActiveKey(item.key)
                }}
                class={[
                  `${props.prefixCls}-inline-menu-item`,
                  activeItem.value.key === item.key
                    ? `${props.prefixCls}-inline-menu-item-active`
                    : undefined
                ]}
              >
                {item.label}
              </div>
            ))}
          </div>
        )
      }

      if (props.type === 'tab') {
        return (
          <Tabs activeKey={activeItem.value.key as string} onTabClick={key => setActiveKey(key)}>
            {props.items.map(({ label, key, ...rest }, index) => {
              return <Tabs.TabPane tab={label} key={key || index} {...rest} />
            })}
          </Tabs>
        )
      }

      const menuItemDomes = props.items.map((item, index) => {
        if (
          typeof item.label === 'undefined' ||
          typeof item.label === 'boolean' ||
          typeof item.label === 'string'
        ) {
          return <Menu.Item key={item.key || index} title={item.label} disabled={item.disabled} />
        }
        return (
          <Menu.Item key={item.key || index} disabled={item.disabled}>
            {{ title: () => item.label }}
          </Menu.Item>
        )
      })

      return (
        <div class={[`${props.prefixCls}-menu`, `${props.prefixCls}-dropdownmenu`]}>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu
                selectedKeys={[activeItem.value.key as string]}
                onClick={item => {
                  setActiveKey(item.key)
                }}
              >
                {menuItemDomes}
              </Menu>
            }
          >
            <Space class={`${props.prefixCls}-dropdownmenu-label`}>
              {activeItem.value.label}
              <DownOutlined />
            </Space>
          </Dropdown>
        </div>
      )
    }
  }
})

export default HeaderMenu
