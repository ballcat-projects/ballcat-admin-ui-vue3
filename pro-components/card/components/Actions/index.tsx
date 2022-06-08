import './index.less'
import type { FunctionalComponent } from 'vue'
import type { VueNode } from '../../../types'

export type ProCardActionsProps = {
  /**
   * 自定义前缀
   *
   * @ignore
   */
  prefixCls?: string
  /** 操作按钮 */
  actions?: VueNode
}

const ProCardActions: FunctionalComponent<ProCardActionsProps> = props => {
  const { actions, prefixCls } = props
  if (Array.isArray(actions) && actions?.length) {
    return (
      <ul class={`${prefixCls}-actions`}>
        {actions.map((action, index) => (
          <li style={{ width: `${100 / actions.length}%` }} key={`action-${index}`}>
            <span>{action}</span>
          </li>
        ))}
      </ul>
    )
  }
  if (actions) return <ul class={`${prefixCls}-actions`}>{actions}</ul>
  return null
}

export default ProCardActions
