import './GridContent.less'

import type { PureSettings } from '../../defaultSettings'
import type { CSSProperties, FunctionalComponent } from 'vue'
import { getPrefixCls, routeContextInjectKey } from '#/layout/RouteContext'

type GridContentProps = {
  contentWidth?: PureSettings['contentWidth']
  prefixCls?: string
}

/**
 * This component can support contentWidth so you don't need to calculate the width
 * contentWidth=Fixed, width will is 1200
 *
 * @param props
 * @param attrs
 * @param slots
 */
const GridContent: FunctionalComponent<GridContentProps> = (props, { attrs, slots }) => {
  const routeContext = inject(routeContextInjectKey, {})
  const prefixCls = props.prefixCls || getPrefixCls('pro')
  const contentWidth = props.contentWidth || routeContext.contentWidth
  const className = `${prefixCls}-grid-content`

  return (
    <div
      class={[className, attrs.class, { wide: contentWidth === 'Fixed' }]}
      style={attrs.style as CSSProperties}
    >
      <div class={`${prefixCls}-grid-content-children`}>{slots.default?.()}</div>
    </div>
  )
}

export default GridContent
