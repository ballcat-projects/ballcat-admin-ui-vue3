import './index.less'

import { Alert, Space } from 'ant-design-vue'
import 'ant-design-vue/es/alert/style/index.less'
import 'ant-design-vue/es/space/style/index.less'

import { getPrefixCls } from '#/layout/RouteContext'
import type { IntlType } from '#/provider'
import { useIntl } from '#/provider'
import type { VueNode } from '#/types'
import { getRender } from '#/layout/utils'
import type { FunctionalComponent } from 'vue'

type AlertRender<T> = (props: {
  intl: IntlType
  selectedRowKeys: (number | string)[]
  selectedRows: T[]
  onCleanSelected: () => void
}) => VueNode

export type AlertRenderType<T> = AlertRender<T> | false

export type TableAlertProps<T> = {
  selectedRowKeys: (number | string)[]
  selectedRows: T[]
  alwaysShowAlert?: boolean
  alertInfoRender?: AlertRenderType<T>
  onCleanSelected: () => void
  alertOptionRender?: AlertRenderType<T>
}

const defaultAlertOptionRender: AlertRender<unknown> = (props: {
  intl: IntlType
  onCleanSelected: () => void
}) => {
  const { intl, onCleanSelected } = props
  return [
    <a onClick={onCleanSelected} key="0">
      {intl.getMessage('alert.clear', '清空')}
    </a>
  ]
}

const defaultAlertInfoRender: AlertRender<unknown> = ({ intl, selectedRowKeys }) => (
  <Space>
    {intl.getMessage('alert.selected', '已选择')}
    {selectedRowKeys.length}
    {intl.getMessage('alert.item', '项')}&nbsp;&nbsp;
  </Space>
)

const TableAlert: FunctionalComponent<TableAlertProps<unknown>> = (props, { slots }) => {
  const intl = useIntl()

  const alertRenderProps = {
    onCleanSelected: props.onCleanSelected,
    selectedRowKeys: props.selectedRowKeys,
    selectedRows: props.selectedRows,
    intl
  }

  let optionRender = getRender<AlertRenderType<unknown>>(props, slots, 'alertOptionRender')
  if (optionRender !== false && !optionRender) {
    optionRender = defaultAlertOptionRender
  }
  const option = optionRender && optionRender(alertRenderProps)

  const className = getPrefixCls('pro-table-alert')

  let infoRender = getRender<AlertRenderType<unknown>>(props, slots, 'alertInfoRender')
  if (infoRender === false) {
    return null
  } else if (!infoRender) {
    infoRender = defaultAlertInfoRender
  }
  const dom = infoRender(alertRenderProps)

  if (dom === false || (props.selectedRowKeys.length < 1 && !props.alwaysShowAlert)) {
    return null
  }
  return (
    <div class={className}>
      <Alert
        message={
          <div class={`${className}-info`}>
            <div class={`${className}-info-content`}>{dom}</div>
            {option ? <div class={`${className}-info-option`}>{option}</div> : null}
          </div>
        }
        type="info"
      />
    </div>
  )
}

export default TableAlert
