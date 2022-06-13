import { Dropdown } from 'ant-design-vue'
import type { DropdownProps } from 'ant-design-vue/es/dropdown'
import type { VueNode } from '#/types'
import styles from './index.module.less'
import { dropdownProps } from 'ant-design-vue/es/dropdown'

export type HeaderDropdownProps = {
  overlayClassName?: string
  overlay: VueNode | (() => VueNode) | any
  placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter'
} & Omit<DropdownProps, 'overlay'>

const HeaderDropdown = defineComponent({
  props: dropdownProps(),
  setup(props, { slots }) {
    const overlayClassName = computed(() => {
      return props.overlayClassName
        ? `${styles.container} ${props.overlayClassName}`
        : styles.container
    })
    console.log(overlayClassName.value)
    return () => (
      <Dropdown {...props} overlayClassName={overlayClassName.value}>
        {slots}
      </Dropdown>
    )
  }
})

// const HeaderDropdown: FunctionalComponent<HeaderDropdownProps> = (
//   { overlayClassName: cls, ...restProps },
//   { slots }
// ) => {
//   const overlayClassName = cls ? `${styles.container} ${cls}` : styles.container
//   console.log(overlayClassName)
//   console.log(cls)
//   return (
//     <Dropdown overlayClassName={overlayClassName} {...restProps}>
//       {slots}
//     </Dropdown>
//   )
// }

export default HeaderDropdown
