import './ThemeColor.less'

import { CheckOutlined } from '@ant-design/icons-vue'

import { Tooltip } from 'ant-design-vue'
import type { FunctionalComponent, HtmlHTMLAttributes } from 'vue'

export type TagProps = {
  color: string
  check: boolean
} & HtmlHTMLAttributes

const Tag: FunctionalComponent<TagProps> = props => (
  <div onClick={props.onClick} style={{ backgroundColor: props.color }}>
    {props.check ? <CheckOutlined /> : ''}
  </div>
)

export type ThemeColorProps = {
  colorList?: {
    key: string
    color: string
  }[]
  value: string
  onChange: (color: string) => void
  formatMessage: (data: { id: any; defaultMessage?: string }) => string
}

const ThemeColor: FunctionalComponent<ThemeColorProps> = props => {
  if (!props.colorList || props.colorList?.length < 1) {
    return null
  }
  return (
    <div class="theme-color">
      <div class="theme-color-content">
        {props.colorList?.map(({ key, color }) => {
          if (!key) return
          return (
            <Tooltip
              key={color}
              title={props.formatMessage({
                id: `app.setting.themecolor.${key}`
              })}
            >
              <Tag
                class="theme-color-block"
                color={color}
                check={props.value === color}
                onClick={() => props.onChange && props.onChange(color)}
              />
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}

export default ThemeColor
