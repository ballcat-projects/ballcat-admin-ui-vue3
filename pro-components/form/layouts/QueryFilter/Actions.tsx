import { Space } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import type { IntlType } from '../../../provider'
import type { CSSProperties, FunctionalComponent } from 'vue'
import type { VueNode } from '../../../types'
import { useIntl } from '../../../provider'
import omitBoolean from '../../../utils/omitBoolean'
import { getPrefixCls } from '../../../layout/RouteContext'

export type ActionsProps = {
  submitter: VueNode
  /** 是否收起 */
  collapsed?: boolean
  /** 收起按钮的事件 */
  onCollapse?: (collapsed: boolean) => void

  setCollapsed: (collapse: boolean) => void
  isForm?: boolean
  style?: CSSProperties
  /** 收起按钮的 render */
  collapseRender?:
    | ((
        collapsed: boolean,
        /** 是否应该展示，有两种情况 列只有三列，不需要收起 form 模式 不需要收起 */
        props: ActionsProps,
        intl: IntlType,
        hiddenNum?: false | number
      ) => VueNode)
    | false
  /** 隐藏个数 */
  hiddenNum?: false | number
}

const defaultCollapseRender: ActionsProps['collapseRender'] = (collapsed, _, intl, hiddenNum) => {
  if (collapsed) {
    return (
      <>
        {intl.getMessage('tableForm.collapsed', '展开')}
        {hiddenNum && `(${hiddenNum})`}
        <DownOutlined
          style={{
            marginLeft: '0.5em',
            transition: '0.3s all',
            transform: `rotate(${collapsed ? 0 : 0.5}turn)`
          }}
        />
      </>
    )
  }
  return (
    <>
      {intl.getMessage('tableForm.expand', '收起')}
      <DownOutlined
        style={{
          marginLeft: '0.5em',
          transition: '0.3s all',
          transform: `rotate(${collapsed ? 0 : 0.5}turn)`
        }}
      />
    </>
  )
}

/**
 * FormFooter 的组件，可以自动进行一些配置
 *
 * @param props
 */
const Actions: FunctionalComponent<ActionsProps> = props => {
  const { setCollapsed, collapsed = false, submitter, style, hiddenNum } = props
  const intl = useIntl()

  const collapseRender = omitBoolean(props.collapseRender) || defaultCollapseRender
  return (
    <Space style={style} size={16}>
      {submitter}
      {props.collapseRender !== false && (
        <a
          class={getPrefixCls('pro-form-collapse-button')}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapseRender?.(collapsed, props, intl, hiddenNum)}
        </a>
      )}
    </Space>
  )
}

export default Actions
