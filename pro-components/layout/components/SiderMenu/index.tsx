import { Drawer } from 'ant-design-vue'

import SiderMenu, { privateSiderMenuProps, siderMenuProps } from './SiderMenu'

import type { CSSProperties } from 'vue'

const SiderMenuWrapper = defineComponent({
  name: 'SiderMenuWrapper',
  props: {
    ...siderMenuProps(),
    ...privateSiderMenuProps()
  },
  setup(props, { slots, attrs }) {
    // TODO 计算 flatMenuKeys

    // 当切换设备为手机时，会自动折叠菜单
    watch(
      () => props.isMobile,
      () => {
        if (props.isMobile == true) {
          props.onCollapse?.(true)
        }
      },
      { immediate: true }
    )

    if (props.hide) {
      return null
    }

    const drawerVisible = ref(false)
    watchEffect(() => {
      // @ts-ignore
      drawerVisible.value = !props.collapsed
    })

    // @ts-ignore
    return () =>
      props.isMobile ? (
        <>
          <Drawer
            visible={drawerVisible.value}
            placement="left"
            class={[`${props.prefixCls}-drawer-sider`, attrs.class]}
            onClose={() => props.onCollapse?.(true)}
            style={{
              padding: 0,
              height: '100vh',
              ...(attrs.style as CSSProperties)
            }}
            closable={false}
            getContainer={props.getContainer}
            width={props.siderWidth}
            bodyStyle={{ height: '100vh', padding: 0, display: 'flex', flexDirection: 'row' }}
          >
            <SiderMenu
              {...props}
              // @ts-ignore
              class={[`${props.prefixCls}-sider`, attrs.class]}
              collapsed={props.isMobile ? false : props.collapsed}
              splitMenus={false}
            >
              {slots}
            </SiderMenu>
          </Drawer>
        </>
      ) : (
        <SiderMenu
          class={[`${props.prefixCls}-sider`, attrs.class]}
          {...props}
          // @ts-ignore
          style={attrs.style}
        >
          {slots}
        </SiderMenu>
      )
  }
})

export default SiderMenuWrapper
