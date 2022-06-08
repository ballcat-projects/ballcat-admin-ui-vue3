import type { VNode, VNodeChild } from 'vue'

export type VueKey = string | number
export type VueText = string | number
export type VueNode = VNodeChild | VNode | VNode[] | JSX.Element | string | null | undefined
export type VueRender = (...args: any[]) => VueNode
export type VueNodeOrRender = VueNode | VueRender

export const VueNodePropType = [Object, String]
export const VueNodeOrRenderPropType = [Object, Function, String]
export const WithFalseVueNodeOrRenderPropType = [Object, Function, String, Boolean]
