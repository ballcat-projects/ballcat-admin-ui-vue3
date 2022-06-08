import { Layout } from 'ant-design-vue'
import GlobalFooter from './components/GlobalFooter'

import type { CSSProperties } from 'vue'
import type { WithFalse } from './types'
import type { FunctionalComponent } from 'vue'
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
}

const FooterView: FunctionalComponent<FooterProps> = (props: FooterProps, { slots, attrs }) => (
  <Layout.Footer class={attrs.class} style={{ padding: 0, ...(attrs.style as CSSProperties) }}>
    <GlobalFooter links={props.links} prefixCls={props.prefixCls} copyright={props.copyright}>
      {slots}
    </GlobalFooter>
  </Layout.Footer>
)

export default FooterView
