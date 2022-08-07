import './index.less'

import {
  CloseOutlined,
  CopyOutlined,
  NotificationOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'

import {
  Alert,
  Button,
  ConfigProvider,
  Divider,
  Drawer,
  List,
  message,
  Switch
} from 'ant-design-vue'
import 'ant-design-vue/es/alert/style'
import 'ant-design-vue/es/button/style'
import 'ant-design-vue/es/divider/style'
import 'ant-design-vue/es/drawer/style'
import 'ant-design-vue/es/list/style'
import 'ant-design-vue/es/message/style'
import 'ant-design-vue/es/switch/style'
import 'ant-design-vue/es/tooltip/style'
import 'ant-design-vue/es/select/style'

import type { ProSettings } from '../../defaultSettings'
import { defaultSettings } from '../../defaultSettings'

import BlockCheckbox from './BlockCheckbox'
import ThemeColor from './ThemeColor'
import { gLocaleObject } from '../../locales'
import LayoutSetting, { renderLayoutSettingItem } from './LayoutChange'
import RegionalSetting from './RegionalChange'
import { genStringToTheme } from '../../utils/utils'
import type { VueNodeOrRender } from '#/types'
import type { PropType, FunctionalComponent } from 'vue'

type BodyProps = {
  title: string
  prefixCls: string
}

const Body: FunctionalComponent<BodyProps> = (props, { slots }) => (
  <div style={{ marginBottom: '24px' }}>
    <h3 class={`${props.prefixCls}-drawer-title`}>{props.title}</h3>
    {slots.default?.()}
  </div>
)

export type SettingItemProps = {
  title: VueNodeOrRender
  action: VueNodeOrRender
  disabled?: boolean
  disabledReason?: VueNodeOrRender
}

export type SettingDrawerProps = {
  settings?: ProSettings
  collapse?: boolean
  getContainer?: any
  hideHintAlert?: boolean
  hideCopyButton?: boolean
  /** 使用实验性质的黑色主题 */
  enableDarkTheme?: boolean
  prefixCls?: string
  colorList?: false | { key: string; color: string }[]
  onSettingChange?: (settings: ProSettings) => void
  pathname?: string
  disableUrlParams?: boolean
  themeOnly?: boolean
}

const settingDrawerProps = {
  defaultSettings: {
    type: Object as PropType<ProSettings>,
    default: () => defaultSettings
  },
  settings: {
    type: Object as PropType<ProSettings>,
    default: () => defaultSettings
  },
  collapse: Boolean,
  getContainer: [Function, Object] as PropType<any>,
  hideHintAlert: Boolean,
  hideCopyButton: Boolean,
  /** 使用实验性质的黑色主题 */
  enableDarkTheme: Boolean,
  prefixCls: {
    type: String,
    default: 'ant-pro'
  },
  colorList: {
    type: [Boolean, Array] as PropType<SettingDrawerProps['colorList']>,
    default: () => [
      { key: 'daybreak', color: '#1890ff' },
      { key: 'dust', color: '#F5222D' },
      { key: 'volcano', color: '#FA541C' },
      { key: 'sunset', color: '#FAAD14' },
      { key: 'cyan', color: '#13C2C2' },
      { key: 'green', color: '#52C41A' },
      { key: 'geekblue', color: '#2F54EB' },
      { key: 'purple', color: '#722ED1' }
    ]
  },
  onSettingChange: Function as PropType<SettingDrawerProps['onSettingChange']>,
  pathname: { type: String, default: window.location.pathname },
  disableUrlParams: { type: Boolean, default: true },
  themeOnly: Boolean
}

type FormatMessageFunc = (data: { id: string; defaultMessage?: string }) => string
export const getFormatMessage = (): FormatMessageFunc => {
  return ({ id }: { id: string; defaultMessage?: string }): string => {
    const locales = gLocaleObject()
    return locales[id]
  }
}

const updateTheme = async (dark: boolean, color?: string) => {
  if (typeof window === 'undefined') return
  if (typeof window.MutationObserver === 'undefined') return

  if (!ConfigProvider.config) return
  ConfigProvider.config({
    theme: {
      primaryColor: genStringToTheme(color) || '#1890ff'
    }
  })

  // if (dark) {
  //   const defaultTheme = {
  //     brightness: 100,
  //     contrast: 90,
  //     sepia: 10
  //   }
  //
  //   const defaultFixes = {
  //     invert: [],
  //     css: '',
  //     ignoreInlineStyle: ['.react-switch-handle'],
  //     ignoreImageAnalysis: [],
  //     disableStyleSheetsProxy: true
  //   }
  //   if (window.MutationObserver && window.fetch) {
  //     setFetch(window.fetch)
  //     darkreaderEnable(defaultTheme, defaultFixes)
  //   }
  // } else {
  //   if (window.MutationObserver) darkreaderDisable()
  // }
}

const genCopySettingJson = (settingState: ProSettings) =>
  JSON.stringify({ ...settingState }, null, 2)

/**
 * 可视化配置组件
 *
 * @param props
 */
const SettingDrawer = defineComponent({
  props: settingDrawerProps,
  emits: ['update:collapse', 'update:settings'],
  setup(props, { emit }) {
    // const firstRender = ref<boolean>(true)

    // 隐藏显示，支持 双向绑定
    const show = ref<boolean>(false)
    const setShow = (isShow: boolean) => {
      show.value = isShow
      emit('update:collapse', show.value)
    }
    watchEffect(() => {
      show.value = props.collapse
    })

    const settingState = reactive<ProSettings>({})
    watchEffect(() => {
      Object.assign(settingState, props.settings)
    })

    // TODO 语言切换

    // 监听更新主题色
    const changeTheme = () =>
      updateTheme(settingState.navTheme === 'realDark', settingState.primaryColor)
    watch(() => settingState.primaryColor, changeTheme, { immediate: true })
    watch(() => settingState.navTheme, changeTheme)

    /**
     * 修改设置
     *
     * @param key
     * @param value
     */
    const changeSetting = (key: string, value: string | boolean | number) => {
      // @ts-ignore
      settingState[key] = value

      if (key === 'layout') {
        settingState.contentWidth = value === 'top' ? 'Fixed' : 'Fluid'
      }
      if (key === 'layout' && value !== 'mix') {
        settingState.splitMenus = false
      }
      if (key === 'layout' && value === 'mix') {
        settingState.navTheme = 'light'
      }
      if (key === 'colorWeak' && value === true) {
        const dom = document.querySelector('body')
        if (dom) {
          dom.dataset.prosettingdrawer = dom.style.filter
          dom.style.filter = 'invert(80%)'
        }
      }
      if (key === 'colorWeak' && value === false) {
        const dom = document.querySelector('body')
        if (dom) {
          dom.style.filter = dom.dataset.prosettingdrawer || 'none'
          delete dom.dataset.prosettingdrawer
        }
      }

      emit('update:settings', toRaw(settingState))
    }

    const formatMessage = getFormatMessage()

    return () => {
      const baseClassName = `${props.prefixCls}-setting`
      return (
        <Drawer
          visible={show.value}
          width={300}
          closable={false}
          onClose={() => setShow(false)}
          placement="right"
          getContainer={props.getContainer}
          handle={
            <div class={`${baseClassName}-drawer-handle`} onClick={() => setShow(!show.value)}>
              {show.value ? (
                <CloseOutlined style={{ color: '#fff', fontSize: 20 }} />
              ) : (
                <SettingOutlined style={{ color: '#fff', fontSize: 20 }} />
              )}
            </div>
          }
          style={{
            zIndex: 999
          }}
        >
          <div class={`${baseClassName}-drawer-content`}>
            <Body
              title={formatMessage({
                id: 'app.setting.pagestyle',
                defaultMessage: 'Page style setting'
              })}
              prefixCls={baseClassName}
            >
              <BlockCheckbox
                prefixCls={baseClassName}
                list={[
                  {
                    key: 'light',
                    title: formatMessage({
                      id: 'app.setting.pagestyle.light',
                      defaultMessage: '亮色菜单风格'
                    })
                  },
                  {
                    key: 'dark',
                    title: formatMessage({
                      id: 'app.setting.pagestyle.dark',
                      defaultMessage: '暗色菜单风格'
                    })
                  },
                  {
                    key: 'realDark',
                    title: formatMessage({
                      id: 'app.setting.pagestyle.realdark',
                      defaultMessage: '暗色菜单风格'
                    })
                  }
                ].filter(item => {
                  if (item.key === 'dark' && settingState.layout === 'mix') return false
                  return !(item.key === 'realDark' && !props.enableDarkTheme)
                })}
                value={settingState.navTheme!}
                configType="theme"
                key="navTheme"
                onChange={value => changeSetting('navTheme', value)}
              />
            </Body>
            {props.colorList !== false && (
              <Body
                title={formatMessage({
                  id: 'app.setting.themecolor',
                  defaultMessage: 'Theme color'
                })}
                prefixCls={baseClassName}
              >
                <ThemeColor
                  colorList={props.colorList}
                  value={genStringToTheme(settingState.primaryColor)}
                  formatMessage={formatMessage}
                  onChange={color => changeSetting('primaryColor', color)}
                />
              </Body>
            )}
            {!props.themeOnly && (
              <>
                <Divider />
                <Body
                  prefixCls={baseClassName}
                  title={formatMessage({ id: 'app.setting.navigationmode' })}
                >
                  <BlockCheckbox
                    prefixCls={baseClassName}
                    value={settingState.layout!}
                    key="layout"
                    configType="layout"
                    list={[
                      {
                        key: 'side',
                        title: formatMessage({ id: 'app.setting.sidemenu' })
                      },
                      {
                        key: 'top',
                        title: formatMessage({ id: 'app.setting.topmenu' })
                      },
                      {
                        key: 'mix',
                        title: formatMessage({ id: 'app.setting.mixmenu' })
                      }
                    ]}
                    onChange={value => changeSetting('layout', value)}
                  />
                </Body>
                <LayoutSetting settings={settingState} changeSetting={changeSetting} />
                <Divider />

                <Body
                  prefixCls={baseClassName}
                  title={formatMessage({ id: 'app.setting.regionalsettings' })}
                >
                  <RegionalSetting settings={settingState} changeSetting={changeSetting} />
                </Body>

                <Divider />

                <Body
                  prefixCls={baseClassName}
                  title={formatMessage({ id: 'app.setting.othersettings' })}
                >
                  <List
                    split={false}
                    renderItem={renderLayoutSettingItem}
                    dataSource={[
                      {
                        title: formatMessage({ id: 'app.setting.weakmode' }),
                        action: (
                          <Switch
                            size="small"
                            class="color-weak"
                            v-model:checked={settingState.colorWeak}
                            onChange={checked => {
                              changeSetting('colorWeak', checked)
                            }}
                          />
                        )
                      }
                    ]}
                  />
                </Body>
                {props.hideHintAlert && props.hideCopyButton ? null : <Divider />}

                {props.hideHintAlert ? null : (
                  <Alert
                    type="warning"
                    message={formatMessage({
                      id: 'app.setting.production.hint'
                    })}
                    icon={<NotificationOutlined />}
                    showIcon
                    style={{ marginBottom: '16px' }}
                  />
                )}

                {props.hideCopyButton ? null : (
                  <Button
                    block
                    icon={<CopyOutlined />}
                    style={{ marginBottom: '24px' }}
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(genCopySettingJson(settingState))
                        message.success(formatMessage({ id: 'app.setting.copyinfo' }))
                      } catch (error) {
                        // console.log(error);
                      }
                    }}
                  >
                    {formatMessage({ id: 'app.setting.copy' })}
                  </Button>
                )}
              </>
            )}
          </div>
        </Drawer>
      )
    }
  }
})

export default SettingDrawer
