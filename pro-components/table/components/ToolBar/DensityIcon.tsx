import { Menu, Dropdown, Tooltip } from 'ant-design-vue'
import 'ant-design-vue/es/menu/style/index.less'
import 'ant-design-vue/es/dropdown/style/index.less'
import 'ant-design-vue/es/tooltip/style/index.less'
import { ColumnHeightOutlined } from '@ant-design/icons-vue'

import { useIntl } from '#/provider'
import { useContainer } from '#/table/container'

export type DensitySize = 'middle' | 'small' | 'large' | undefined

const DensityIcon = () => {
  const counter = useContainer()!
  const intl = useIntl()

  const largeTitle = intl.getMessage('tableToolBar.densityLarger', '默认')
  const middleTitle = intl.getMessage('tableToolBar.densityMiddle', '中等')
  const smallTitle = intl.getMessage('tableToolBar.densitySmall', '紧凑')
  return (
    <Dropdown
      overlay={
        <Menu
          selectedKeys={[counter.tableSize.value as string]}
          onClick={({ key }) => {
            counter.setTableSize?.(key as DensitySize)
          }}
          style={{
            width: 80
          }}
        >
          <Menu.Item key={'large'}>{largeTitle}</Menu.Item>
          <Menu.Item key={'middle'}>{middleTitle}</Menu.Item>
          <Menu.Item key={'small'}>{smallTitle}</Menu.Item>
        </Menu>
      }
      trigger={['click']}
    >
      <Tooltip title={intl.getMessage('tableToolBar.density', '表格密度')}>
        <ColumnHeightOutlined />
      </Tooltip>
    </Dropdown>
  )
}

export default DensityIcon
