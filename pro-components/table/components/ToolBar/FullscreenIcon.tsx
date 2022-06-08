import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { Tooltip } from 'ant-design-vue'
import { useIntl } from '#/provider'
import { useToggle } from '@vueuse/core'
import { watchEffect } from 'vue'

const FullScreenIcon = () => {
  const intl = useIntl()
  const [fullscreen, setFullscreen] = useToggle(false)
  watchEffect(() => {
    // if (!isBrowser()) {
    //   return
    // }
    document.onfullscreenchange = () => {
      setFullscreen(!!document.fullscreenElement)
    }
  })
  return fullscreen.value ? (
    <Tooltip title={intl.getMessage('tableToolBar.exitFullScreen', '全屏')}>
      <FullscreenExitOutlined />
    </Tooltip>
  ) : (
    <Tooltip title={intl.getMessage('tableToolBar.fullScreen', '全屏')}>
      <FullscreenOutlined />
    </Tooltip>
  )
}

export default FullScreenIcon
