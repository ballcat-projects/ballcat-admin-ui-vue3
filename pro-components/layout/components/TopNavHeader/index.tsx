import './index.less'

import { useDebounceFn } from '@vueuse/core'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'
import type { SiderMenuProps } from '../SiderMenu/SiderMenu'
import type { GlobalHeaderProps } from '../GlobalHeader'
import type { CSSProperties, FunctionalComponent } from 'vue'
import type { HeaderViewProps } from '../../Header'
import { defaultRenderLogoAndTitle } from '../SiderMenu/SiderMenu'
import { ref } from 'vue'
import BaseMenu from '../SiderMenu/BaseMenu'
import { getRender } from '#/layout/utils'
import type { RightContentRender } from '#/layout/renderTypes'

export type TopNavHeaderProps = SiderMenuProps & GlobalHeaderProps

/**
 * 抽离出来是为了防止 rightSize 经常改变导致菜单 render
 *
 * @param param0
 * @param props
 */
export const RightContent: FunctionalComponent<TopNavHeaderProps> = props => {
  const rightSize = ref<string>('auto')

  /** 减少一下渲染的次数 */
  const setRightSizeDebounceFn = useDebounceFn((width: number) => {
    rightSize.value = `${width}px`
  }, 160)

  return (
    <div class={`${props.prefixCls}-right-content`} style={{ minWidth: rightSize.value }}>
      <div style={{ paddingRight: '8px' }}>
        <ResizeObserver
          onResize={({ width }: { width: number }) => {
            setRightSizeDebounceFn(width)
          }}
        >
          {props.rightContentRender && (
            <div class={`${props.prefixCls}-right-content-resize`}>
              {props.rightContentRender({ ...props } as HeaderViewProps)}
            </div>
          )}
        </ResizeObserver>
      </div>
    </div>
  )
}

export const TopNavHeader: FunctionalComponent<TopNavHeaderProps> = (props, { slots, attrs }) => {
  const prefixCls = `${props.prefixCls || 'ant-pro'}-top-nav-header`

  const headerDom = defaultRenderLogoAndTitle(
    { ...props, collapsed: false },
    slots,
    props.layout === 'mix' ? 'headerTitleRender' : undefined
  )

  const className = computed(() => [prefixCls, attrs.class, { light: props.theme === 'light' }])

  // @ts-ignore
  const defaultDom = <BaseMenu {...props} {...props.menuProps} />

  const headerContentDom = props.headerContentRender
    ? props.headerContentRender?.(props as HeaderViewProps, defaultDom)
    : defaultDom

  const rightContentRender = getRender<RightContentRender>(props, slots, 'rightContentRender')

  return (
    <div class={className.value} style={attrs.style as CSSProperties}>
      <div class={`${prefixCls}-main ${props.contentWidth === 'Fixed' ? 'wide' : ''}`}>
        <div class={`${prefixCls}-main-left`} onClick={props.onMenuHeaderClick}>
          <div class={`${prefixCls}-logo`} key="logo" id="logo">
            {headerDom}
          </div>
        </div>
        <div style={{ flex: 1 }} class={`${prefixCls}-menu`}>
          {headerContentDom}
        </div>
        {rightContentRender && (
          <RightContent {...props} rightContentRender={rightContentRender} prefixCls={prefixCls} />
        )}
      </div>
    </div>
  )
}

export default TopNavHeader
