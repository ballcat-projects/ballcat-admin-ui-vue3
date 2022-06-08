import { Spin } from 'ant-design-vue'
import 'ant-design-vue/es/spin/style/index.less'

import type { SpinProps } from 'ant-design-vue'
import type { FunctionalComponent } from 'vue'

const PageLoading: FunctionalComponent<SpinProps> = (props: SpinProps) => (
  <div style={{ paddingTop: '100px', textAlign: 'center' }}>
    <Spin size="large" {...props} />
  </div>
)

export default PageLoading
