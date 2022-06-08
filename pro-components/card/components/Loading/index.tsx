import './index.less'

import { Row, Col } from 'ant-design-vue'
import 'ant-design-vue/es/grid/style/index.less'

import type { CSSProperties, FunctionalComponent } from 'vue'

type LoadingProps = {
  /** Prefix */
  prefix?: string
}

const Loading: FunctionalComponent<LoadingProps> = (props, { attrs }) => {
  const { prefix } = props

  return (
    <div class={`${prefix}-loading-content`} style={attrs.style as CSSProperties}>
      <Row gutter={8}>
        <Col span={22}>
          <div class={`${prefix}-loading-block`} />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={8}>
          <div class={`${prefix}-loading-block`} />
        </Col>
        <Col span={15}>
          <div class={`${prefix}-loading-block`} />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={6}>
          <div class={`${prefix}-loading-block`} />
        </Col>
        <Col span={18}>
          <div class={`${prefix}-loading-block`} />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={13}>
          <div class={`${prefix}-loading-block`} />
        </Col>
        <Col span={9}>
          <div class={`${prefix}-loading-block`} />
        </Col>
      </Row>
      <Row gutter={8}>
        <Col span={4}>
          <div class={`${prefix}-loading-block`} />
        </Col>
        <Col span={3}>
          <div class={`${prefix}-loading-block`} />
        </Col>
        <Col span={16}>
          <div class={`${prefix}-loading-block`} />
        </Col>
      </Row>
    </div>
  )
}

export default Loading
