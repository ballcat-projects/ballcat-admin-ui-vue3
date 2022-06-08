import { List, Tooltip, Select, Switch } from 'ant-design-vue'
import { defaultSettings } from '../../defaultSettings'
import { getFormatMessage } from './index'

import type { ProSettings } from '../../defaultSettings'
import type { SettingItemProps } from './index'
import type { FunctionalComponent } from 'vue'

export const renderLayoutSettingItem = ({ item }: { item: SettingItemProps; index: number }) => {
  const action = item.action
  // const action = React.cloneElement(item.action, {
  //   disabled: item.disabled
  // })
  return (
    <Tooltip title={item.disabled ? item.disabledReason : ''} placement="left">
      <List.Item actions={[action]}>
        <span style={{ opacity: item.disabled ? 0.5 : 1 }}>{item.title}</span>
      </List.Item>
    </Tooltip>
  )
}
const LayoutSetting: FunctionalComponent<{
  settings: Partial<ProSettings>
  changeSetting: (key: string, value: any, hideLoading?: boolean) => void
}> = props => {
  const formatMessage = getFormatMessage()
  const { contentWidth, splitMenus, fixedHeader, layout, fixSiderbar } =
    props.settings || defaultSettings

  return (
    <List
      split={false}
      dataSource={[
        {
          title: formatMessage({
            id: 'app.setting.content-width',
            defaultMessage: 'Content Width'
          }),
          action: (
            <Select
              value={contentWidth || 'Fixed'}
              size="small"
              class="content-width"
              // @ts-ignore
              onSelect={(value: string) => {
                props.changeSetting('contentWidth', value)
              }}
              style={{ width: '80px' }}
            >
              {layout === 'side' ? null : (
                <Select.Option value="Fixed">
                  {formatMessage({
                    id: 'app.setting.content-width.fixed',
                    defaultMessage: 'Fixed'
                  })}
                </Select.Option>
              )}
              <Select.Option value="Fluid">
                {formatMessage({
                  id: 'app.setting.content-width.fluid',
                  defaultMessage: 'Fluid'
                })}
              </Select.Option>
            </Select>
          )
        },
        {
          title: formatMessage({
            id: 'app.setting.fixedheader',
            defaultMessage: 'Fixed Header'
          }),
          action: (
            <Switch
              size="small"
              class="fixed-header"
              checked={!!fixedHeader}
              onChange={checked => {
                props.changeSetting('fixedHeader', checked)
              }}
            />
          )
        },
        {
          title: formatMessage({
            id: 'app.setting.fixedsidebar',
            defaultMessage: 'Fixed Sidebar'
          }),
          disabled: layout === 'top',
          disabledReason: formatMessage({
            id: 'app.setting.fixedsidebar.hint',
            defaultMessage: 'Works on Side Menu Layout'
          }),
          action: (
            <Switch
              size="small"
              class="fix-siderbar"
              checked={!!fixSiderbar}
              disabled={layout === 'top'}
              onChange={checked => props.changeSetting('fixSiderbar', checked)}
            />
          )
        },
        {
          title: formatMessage({ id: 'app.setting.splitMenus' }),
          disabled: layout !== 'mix',
          action: (
            <Switch
              size="small"
              checked={!!splitMenus}
              class="split-menus"
              disabled={layout !== 'mix'}
              onChange={checked => {
                props.changeSetting('splitMenus', checked)
              }}
            />
          )
        }
      ]}
      renderItem={renderLayoutSettingItem}
    />
  )
}

export default LayoutSetting
