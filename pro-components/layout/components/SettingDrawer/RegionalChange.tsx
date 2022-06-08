import { Switch, List } from 'ant-design-vue'
import { getFormatMessage } from './index'
import { renderLayoutSettingItem } from './LayoutChange'

import type { ProSettings } from '../../defaultSettings'
import type { FunctionalComponent } from 'vue'

const RegionalSetting: FunctionalComponent<{
  settings: Partial<ProSettings>
  changeSetting: (key: string, value: any, hideLoading?: boolean) => void
}> = props => {
  const formatMessage = getFormatMessage()
  const regionalSetting = ['header', 'footer', 'menu', 'menuHeader']
  return (
    <List
      split={false}
      // @ts-ignore
      renderItem={renderLayoutSettingItem}
      dataSource={regionalSetting.map(key => {
        return {
          title: formatMessage({ id: `app.setting.regionalsettings.${key}` }),
          action: (
            <Switch
              size="small"
              class={`regional-${key}`}
              checked={
                // @ts-ignore
                props.settings[`${key}Render`] || props.settings[`${key}Render`] === undefined
              }
              onChange={checked =>
                props.changeSetting(`${key}Render`, checked === true ? undefined : false)
              }
            />
          )
        }
      })}
    />
  )
}

export default RegionalSetting
