import { buttonProps } from 'ant-design-vue/es/button/button'
import { initDefaultProps } from 'ant-design-vue/es/_util/props-util'

import { Button as AButton } from 'ant-design-vue'
import { enableI18n } from '@/config'
import { useI18n } from 'vue-i18n'
import { DownloadOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons-vue'

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
    const text = computed(() => {
      if (enableI18n) {
        return useI18n().t(props.i18nKey!)
      } else {
        return props.defaultText
      }
    })

    return () => (
      <AButton {...props} {...attrs}>
        {{
          ...slots,
          default: () => text.value
        }}
      </AButton>
    )
  }
})

// eslint-disable-next-line vue/one-component-per-file
export const CreateButton = defineComponent({
  name: 'CreateButton',
  props: initDefaultProps(buttonProps(), {
    type: 'primary'
  }),
  setup(props, { attrs }) {
    return () => (
      <IconButton {...props} {...attrs} i18nKey={'action.create'} defaultText={'新建'}>
        {{ icon: () => <PlusOutlined /> }}
      </IconButton>
    )
  }
})

// eslint-disable-next-line vue/one-component-per-file
export const ImportButton = defineComponent({
  name: 'ImportButton',
  props: buttonProps(),
  setup(props, { attrs }) {
    return () => (
      <IconButton {...props} {...attrs} i18nKey={'action.import'} defaultText={'导入'}>
        {{ icon: () => <UploadOutlined /> }}
      </IconButton>
    )
  }
})

// eslint-disable-next-line vue/one-component-per-file
export const ExportButton = defineComponent({
  name: 'ExportButton',
  props: buttonProps(),
  setup(props, { attrs }) {
    return () => (
      <IconButton {...props} {...attrs} i18nKey={'action.export'} defaultText={'导出'}>
        {{ icon: () => <DownloadOutlined /> }}
      </IconButton>
    )
  }
})
