import type { FunctionalComponent } from 'vue'
import { Layout } from 'ant-design-vue'

export interface WrapContentProps {
  isChildrenLayout?: boolean
  location?: any
  contentHeight?: number | string
  ErrorBoundary?: any
}

// TODO 异常处理
const WrapContent: FunctionalComponent<WrapContentProps> = (props, { slots, attrs }) => {
  // const ErrorComponent = props.ErrorBoundary || ErrorBoundary
  return (
    // {props.ErrorBoundary === false ? (
    //   <Layout.Content class={className} style={style}>
    //     {slots.default}
    //   </Layout.Content>
    // ) : (
    //   <ErrorComponent>
    //     <Layout.Content class={className} style={style}>
    //       {children}
    //     </Layout.Content>
    //   </ErrorComponent>
    // )}
    <Layout.Content class={attrs.class} style={attrs.style}>
      {slots.default?.()}
    </Layout.Content>
  )
}

export default WrapContent
