import { Layout } from 'ant-design-vue'
import GlobalFooter from './components/GlobalFooter'

import type { CSSProperties, PropType } from 'vue'
import type { WithFalse } from './types'
import type { VueNodeOrRender } from '#/types'

export type FooterProps = {
  links?: WithFalse<
    {
      key?: string
      title: VueNodeOrRender
      href: string
      blankTarget?: boolean
    }[]
  >
  copyright?: WithFalse<string>
  prefixCls?: string
  footerStyle?: CSSProperties
}

const footerViewProps = {
  links: {
    type: [Object, Boolean] as PropType<FooterProps['links']>,
    default: undefined
  },
  copyright: {
    type: [String, Boolean] as PropType<FooterProps['copyright']>,
    default: undefined
  },
  prefixCls: String as PropType<FooterProps['prefixCls']>,
  footerStyle: Object as PropType<FooterProps['footerStyle']>
}

const FooterView = defineComponent({
  name: 'FooterView',
  props: footerViewProps,
  setup(props, { slots, attrs }) {
    return () => (
      <Layout.Footer class={attrs.class} style={{ padding: 0, ...(attrs.style as CSSProperties) }}>
        <GlobalFooter
          links={props.links}
          prefixCls={props.prefixCls}
          copyright={props.copyright}
          style={{ ...(props.footerStyle as CSSProperties) }}
        >
          {slots}
        </GlobalFooter>
      </Layout.Footer>
    )
  }
})

export default FooterView
