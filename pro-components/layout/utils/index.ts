import type { Slot, Slots } from 'vue'
import type { VueNode, VueNodeOrRender } from '#/types'

export function getVueNode(customRender: VueNodeOrRender, slot?: Slot, props?: any[]): VueNode {
  if (customRender === false) {
    return null
  }
  if (customRender === true || customRender == null) {
    return slot ? slot(props) : null
  }
  if (typeof customRender === 'function') {
    return customRender(props)
  }
  return customRender
}

export function getRender<T>(
  props: Record<string, unknown>,
  slots: Slots,
  key = 'default'
): T | false {
  if (props[key] === false) {
    return false
  }
  return (props[key] || slots[key]) as T
}
