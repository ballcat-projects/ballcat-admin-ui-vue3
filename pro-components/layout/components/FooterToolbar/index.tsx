import './index.less'

import { reactiveOmit } from '@vueuse/core'

import type { VueNodeOrRender } from '#/types'
import type { RouteContextType } from '../../RouteContext'
import type { CSSProperties, PropType, VNode } from 'vue'
import { VueNodeOrRenderPropType } from '#/types'
import { getPrefixCls, routeContextInjectKey } from '../../RouteContext'

export type FooterToolbarProps = {
  extra?: VueNodeOrRender
  renderContent?: (
    props: FooterToolbarProps & RouteContextType & { leftWidth?: string },
    dom: JSX.Element
  ) => VNode
  prefixCls?: string
}

const FooterToolbar = defineComponent({
  props: {
    extra: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,
    renderContent: {
      type: Function as PropType<FooterToolbarProps['renderContent']>,
      default: undefined
    },
    prefixCls: { type: String, default: undefined }
  },
  setup(props, { slots, attrs }) {
    const routeContext = inject(routeContextInjectKey, {})
    const prefixCls = props.prefixCls || getPrefixCls('pro')
    const baseClassName = `${prefixCls}-footer-bar`

    const width = computed<string | undefined>(() => {
      if (!routeContext.hasSiderMenu) {
        return undefined
      }
      // 0 or undefined
      if (!routeContext.siderWidth) {
        return '100%'
      }
      return routeContext.isMobile ? '100%' : `calc(100% - ${routeContext.siderWidth}px)`
    })

    /** 告诉 props 是否存在 footerBar */
    onMounted(() => routeContext?.setHasFooterToolbar?.(true))
    onUnmounted(() => routeContext?.setHasFooterToolbar?.(false))

    return () => {
      const dom = (
        <>
          <div class={`${baseClassName}-left`}>{props.extra}</div>
          <div class={`${baseClassName}-right`}>{slots.default?.()}</div>
        </>
      )

      return (
        <div
          class={[attrs.class, `${baseClassName}`]}
          style={{ width: width.value, ...(attrs.style as CSSProperties) }}
          // @ts-ignore
          {...reactiveOmit(restProps, 'prefixCls', 'ex')}
        >
          {props.renderContent
            ? props.renderContent(
                {
                  ...props,
                  ...routeContext,
                  leftWidth: width.value
                },
                dom
              )
            : dom}
        </div>
      )
    }
  }
})

export default FooterToolbar
