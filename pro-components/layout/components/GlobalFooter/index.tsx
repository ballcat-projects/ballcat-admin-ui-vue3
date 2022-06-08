import './index.less'
import { getVueNode } from '../../utils'

import type { WithFalse } from '../../types'
import type { CSSProperties, PropType, Slot } from 'vue'
import type { VueNodeOrRender } from '#/types'
import { getPrefixCls } from '#/layout/RouteContext'

type LinkInfo = {
  key?: string
  title: VueNodeOrRender
  href: string
  blankTarget?: boolean
}

export type Link = WithFalse<VueNodeOrRender | LinkInfo[]>

export interface GlobalFooterProps {
  links: Link
  copyright?: WithFalse<string>
  prefixCls?: string
}

function renderLinks(links: Link, linksSlot?: Slot) {
  if (Array.isArray(links)) {
    if (links.length === 0) {
      return null
    }
    return (links as LinkInfo[]).map(link => (
      <a
        key={link.key}
        title={link.key}
        target={link.blankTarget ? '_blank' : '_self'}
        href={link.href}
        rel="noreferrer"
      >
        {link.title}
      </a>
    ))
  }
  return getVueNode(links as WithFalse<VueNodeOrRender>, linksSlot)
}

export default defineComponent({
  name: 'GlobalFooter',
  props: {
    links: {
      type: [Object, Function, String, Boolean, Array] as PropType<Link>,
      default: () => {
        return undefined
      }
    },
    copyright: {
      type: [Object, Function, String, Boolean] as PropType<WithFalse<VueNodeOrRender>>,
      default: () => {
        return undefined
      }
    },
    prefixCls: {
      type: String,
      default: 'pro-global-footer'
    }
  },
  setup(props, { slots, attrs }) {
    return () => {
      const linksDom = renderLinks(props.links, slots.links)
      const copyrightDom = getVueNode(props.copyright, slots.copyright)
      if (linksDom && copyrightDom == null) {
        return null
      }

      const globalPrefixCls = getPrefixCls()
      const baseClassName = `${globalPrefixCls}-${props.prefixCls}`
      const clsString = [baseClassName, attrs.class]

      return (
        <div class={clsString} style={attrs.style as CSSProperties}>
          {linksDom && <div class={`${baseClassName}-links`}>{linksDom}</div>}
          {copyrightDom && <div class={`${baseClassName}-copyright`}>{copyrightDom}</div>}
        </div>
      )
    }
  }
})
