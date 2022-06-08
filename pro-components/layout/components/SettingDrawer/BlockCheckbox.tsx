import { Tooltip } from 'ant-design-vue'
import { CheckOutlined } from '@ant-design/icons-vue'
import type { FunctionalComponent } from 'vue'

export type BlockCheckboxProps = {
  value: string
  onChange: (key: string) => void
  list?: {
    title: string
    key: string
  }[]
  configType: string
  prefixCls: string
}

const BlockCheckbox: FunctionalComponent<BlockCheckboxProps> = props => {
  const baseClassName = `${props.prefixCls}-drawer-block-checkbox`
  const domList = (props.list || []).map(item => (
    <Tooltip title={item.title} key={item.key}>
      <div
        class={[
          `${baseClassName}-item`,
          `${baseClassName}-item-${item.key}`,
          `${baseClassName}-${props.configType}-item`
        ]}
        onClick={() => props.onChange(item.key)}
      >
        <CheckOutlined
          class={`${baseClassName}-selectIcon`}
          style={{
            display: props.value === item.key ? 'block' : 'none'
          }}
        />
      </div>
    </Tooltip>
  ))
  return (
    <div
      class={baseClassName}
      style={{
        minHeight: '42px'
      }}
    >
      {domList}
    </div>
  )
}

export default BlockCheckbox
