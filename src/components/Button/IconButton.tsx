import { buttonProps } from 'ant-design-vue/es/button/button'
import { initDefaultProps } from 'ant-design-vue/es/_util/props-util'

import { Button as AButton } from 'ant-design-vue'
import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { useAdminI18n } from '@/hooks/i18n'

const iconButtonProps = () => ({
  ...buttonProps(),
  i18nKey: {
    type: String,
    required: false
  },
  defaultText: {
    type: String,
    required: false
  }
})

// eslint-disable-next-line vue/one-component-per-file
const IconButton = defineComponent({
  name: 'IconButton',
  slots: ['icon'],
  props: iconButtonProps(),
  setup(props, { slots, attrs }) {
    const { i18nText } = useAdminI18n()
    const text = i18nText(props.i18nKey!, props.defaultText)

    return () => (
      <AButton {...props} {...attrs}>
        {{
          default: () => text.value,
          ...slots
        }}
      </AButton>
    )
  }
})

// eslint-disable-next-line vue/one-component-per-file
export const NewButton = defineComponent({
  name: 'NewButton',
  props: initDefaultProps(buttonProps(), {
    type: 'primary'
  }),
  setup(props, { attrs, slots }) {
    return () => (
      <IconButton {...props} {...attrs} i18nKey={'action.new'} defaultText={'新建'}>
        {{ icon: () => <PlusOutlined />, ...slots }}
      </IconButton>
    )
  }
})

// eslint-disable-next-line vue/one-component-per-file
export const ImportButton = defineComponent({
  name: 'ImportButton',
  props: buttonProps(),
  setup(props, { attrs, slots }) {
    return () => (
      <IconButton {...props} {...attrs} i18nKey={'action.import'} defaultText={'导入'}>
        {{ icon: () => <UploadOutlined />, ...slots }}
      </IconButton>
    )
  }
})

// eslint-disable-next-line vue/one-component-per-file
export const ExportButton = defineComponent({
  name: 'ExportButton',
  props: buttonProps(),
  setup(props, { attrs, slots }) {
    return () => (
      <IconButton {...props} {...attrs} i18nKey={'action.export'} defaultText={'导出'}>
        {{ icon: () => <DownloadOutlined />, ...slots }}
      </IconButton>
    )
  }
})
