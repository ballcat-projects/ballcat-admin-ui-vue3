import * as AntIcons from '@ant-design/icons-vue'
import type { FunctionalComponent } from 'vue'

const AntIcon: FunctionalComponent<{ type: string }> = props => {
  // @ts-ignore
  return AntIcons[props.type]
}
