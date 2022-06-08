import { isVNode } from 'vue'

export function isValidElement(el: any) {
  return typeof el === 'object' && el !== null && isVNode(el)
}
