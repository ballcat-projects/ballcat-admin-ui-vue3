import { InfoCircleOutlined } from '@ant-design/icons-vue'
import { Tooltip } from 'ant-design-vue'
import type { TooltipProps } from 'ant-design-vue'
import './index.less'
import type { FunctionalComponent } from 'vue'
import type { VueNode } from '#/types'
import { getPrefixCls } from '#/layout/RouteContext'
import type { LabelTooltipType } from '#/table/typing'

/**
 * 在 form 的 label 后面增加一个 tips 来展示一些说明文案
 *
 * @param props
 */
const LabelIconTip: FunctionalComponent<{
  label: VueNode
  subTitle?: VueNode
  tooltip?: string | LabelTooltipType
  ellipsis?: boolean
}> = props => {
  const { label, tooltip, ellipsis, subTitle } = props

  if (!tooltip && !subTitle) {
    return <>{label}</>
  }
  const className = getPrefixCls('pro-core-label-tip')
  const tooltipProps = typeof tooltip === 'string' ? { title: tooltip } : (tooltip as TooltipProps)

  const icon = <InfoCircleOutlined />
  return (
    <div
      class={className}
      onMousedown={e => e.stopPropagation()}
      onMouseleave={e => e.stopPropagation()}
      onMousemove={e => e.stopPropagation()}
    >
      <div
        class={[
          `${className}-title`,
          {
            [`${className}-title-ellipsis`]: ellipsis
          }
        ]}
      >
        {label}
      </div>
      {subTitle && <div class={`${className}-subtitle`}>{subTitle}</div>}
      {tooltip && (
        <Tooltip {...tooltipProps}>
          <span class={`${className}-icon`}>{icon}</span>
        </Tooltip>
      )}
    </div>
  )
}

export default LabelIconTip
