// TODO 图标按需加载
import * as AntIcons from '@ant-design/icons-vue'
import { createVNode, defineComponent } from 'vue'

const AntIcon = defineComponent({
  name: 'AntIcon',
  props: {
    type: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const iconDom = computed(() => {
      let iconType = props.type
        .replace(/-([a-z])/g, (p, m) => m.toUpperCase())
        .replace(/^\S/, s => s.toUpperCase())

      if (!iconType.endsWith('Outlined')) {
        iconType = iconType + 'Outlined'
      }
      // @ts-ignore
      const antIcon = AntIcons[iconType]
      return antIcon ? createVNode(antIcon) : props.type
    })
    return () => iconDom.value
  }
})

export default AntIcon
