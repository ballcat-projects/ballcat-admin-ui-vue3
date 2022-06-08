import type { ActionType } from './typing'
import type { VueNode } from '#/types'

export type ToolBarRender<T = unknown> = (
  action: ActionType | undefined,
  rows: {
    selectedRowKeys?: (string | number)[]
    selectedRows?: T[]
  }
) => VueNode[]
