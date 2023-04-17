import { ReloadOutlined, SettingOutlined } from '@ant-design/icons-vue'
import type { TableColumnType } from 'ant-design-vue'
import { Tooltip } from 'ant-design-vue'
import type { ListToolBarProps } from '../ListToolBar'
import ListToolBar from '../ListToolBar'
// import ColumnSetting from '../ColumnSetting'
import './index.less'
import FullScreenIcon from './FullscreenIcon'
import DensityIcon from './DensityIcon'
import type { ActionType, ProTableProps, OptionSearchProps, LabelTooltipType } from '../../typing'
import { useIntl } from '#/provider'
import type { IntlType } from '#/provider'
import { VueNodeOrRenderPropType, VueNodePropType } from '#/types'
import type { VueKey, VueNode, VueNodeOrRender } from '#/types'
import { computed, defineComponent, watchEffect } from 'vue'
import type { ExtractPropTypes, PropType, Ref } from 'vue'
import type { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface'
import omitUndefined from '../../../utils/omitUndefined'
import { useContainer } from '#/table/container'
import { getRender } from '#/layout/utils'
import type { ToolBarRender } from '#/table/renderTypes'
import ColumnSetting from '#/table/components/ColumnSetting'

export type SettingOptionType = {
  draggable?: boolean
  checkable?: boolean
  checkedReset?: boolean
  listsHeight?: number
  extra?: VueNode
  children?: VueNode
}

export type OptionConfig = {
  density?: boolean
  fullScreen?: OptionsType
  reload?: OptionsType
  setting?: boolean | SettingOptionType
  search?: (OptionSearchProps & { name?: string }) | boolean
}

export type OptionsFunctionType = (e: MouseEvent, action?: ActionType) => void

export type OptionsType = OptionsFunctionType | boolean

export const toolBarProps = () => ({
  headerTitle: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,
  tooltip: [String, Object] as PropType<LabelTooltipType>,
  toolbar: Object as PropType<ListToolBarProps>,
  toolBarRender: Function as PropType<ToolBarRender>,
  action: {
    type: Object as PropType<Ref<ActionType | undefined>>,
    default: () => ref({})
  },
  options: {
    type: [Object, Boolean] as PropType<OptionConfig | false>,
    default: undefined
  },
  selectedRowKeys: {
    type: Array as PropType<VueKey[]>,
    default: () => []
  },
  selectedRows: {
    type: Array as PropType<unknown[]>
  },
  onSearch: Function as PropType<(keyWords: string) => void>,
  columns: {
    type: Array as PropType<TableColumnType<unknown>[]>,
    default: () => []
  }
})

export type ToolBarProps<T = unknown> = {
  headerTitle?: VueNode
  tooltip?: string | LabelTooltipType
  toolbar?: ListToolBarProps
  toolBarRender?: ToolBarRender<T>
  action: Ref<ActionType | undefined>
  options?: OptionConfig | false
  selectedRowKeys?: (string | number)[]
  selectedRows?: T[]
  onSearch?: (keyWords: string) => void
  columns: TableColumnType<T>[]
}

function getButtonText({
  intl
}: OptionConfig & {
  intl: IntlType
}) {
  return {
    reload: {
      text: intl.getMessage('tableToolBar.reload', '刷新'),
      icon: <ReloadOutlined />
    },
    density: {
      text: intl.getMessage('tableToolBar.density', '表格密度'),
      icon: <DensityIcon />
    },
    setting: {
      text: intl.getMessage('tableToolBar.columnSetting', '列设置'),
      icon: <SettingOutlined />
    },
    fullScreen: {
      text: intl.getMessage('tableToolBar.fullScreen', '全屏'),
      icon: <FullScreenIcon />
    }
  }
}

/**
 * 渲染默认的 工具栏
 */
function renderDefaultOption<T>(
  options: OptionConfig,
  defaultOptions: OptionConfig & {
    intl: IntlType
  },
  actions: Ref<ActionType | undefined>,
  columns: TableColumnType<T>[]
) {
  return Object.keys(options)
    .filter(item => item)
    .map(key => {
      // @ts-ignore
      const value = options[key]
      if (!value) {
        return null
      }

      let onClick: OptionsFunctionType =
        // @ts-ignore
        value === true ? defaultOptions[key] : event => value?.(event, actions.value)

      if (typeof onClick !== 'function') {
        onClick = () => ({})
      }

      if (key === 'setting') {
        // @ts-ignore
        return <ColumnSetting {...options[key]} columns={columns} key={key} />
      }
      if (key === 'fullScreen') {
        return (
          <span key={key} onClick={onClick}>
            <FullScreenIcon />
          </span>
        )
      }
      // @ts-ignore
      const optionItem = getButtonText(defaultOptions)[key]
      if (optionItem) {
        return (
          <span key={key} onClick={onClick}>
            <Tooltip title={optionItem.text}>{optionItem.icon}</Tooltip>
          </span>
        )
      }
      return null
    })
    .filter(item => item)
}

// eslint-disable-next-line vue/one-component-per-file
const ToolBar = defineComponent({
  name: 'ToolBar',
  props: toolBarProps(),
  setup(props, { slots }) {
    const counter = useContainer()!

    const intl = useIntl()

    const defaultOptions = computed(() => ({
      reload: () => props.action?.value?.reload(),
      density: true,
      setting: true,
      search: false,
      fullScreen: () => props.action?.value?.fullScreen?.()
    }))

    const searchConfig = computed(() => {
      if (!props.options) {
        return false
      }
      if (!props.options.search) return false

      /** 受控的value 和 onChange */
      const defaultSearchConfig = {
        value: counter.keyWords.value,
        onChange: (e: ChangeEvent) => counter.setKeyWords(e.target.value)
      }

      if (props.options.search === true) return defaultSearchConfig

      return {
        ...defaultSearchConfig,
        ...props.options.search
      }
    })

    watchEffect(() => {
      if (counter.keyWords === undefined) {
        props.onSearch?.('')
      }
    })

    const optionDom = computed(() => {
      if (props.options === false) {
        return []
      }

      const options = {
        ...defaultOptions.value,
        fullScreen: true,
        ...props.options
      }

      return renderDefaultOption(
        options,
        {
          ...defaultOptions.value,
          intl
        },
        props.action,
        props.columns
      )
    })

    // 操作列表
    const actions = computed(() => {
      const toolBarRender = getRender<ToolBarRender>(props, slots, 'toolBarRender')
      return toolBarRender
        ? toolBarRender(props.action.value, {
            selectedRowKeys: props.selectedRowKeys,
            selectedRows: props.selectedRows
          })
        : []
    })

    const titleDom = computed(() => {
      const headerRender = getRender<VueNode>(props, slots, 'headerTitle')
      if (typeof headerRender === 'function') {
        // @ts-ignore
        return headerRender()
      } else {
        return headerRender
      }
    })

    return () => (
      <ListToolBar
        title={titleDom.value}
        tooltip={props.tooltip}
        search={searchConfig.value}
        onSearch={props.onSearch}
        actions={actions.value}
        settings={optionDom.value}
        {...toolbar}
      />
    )
  }
})

const toolbarRenderProps = () => ({
  hideToolbar: { type: Boolean, default: false },
  onFormSearchSubmit: Function as PropType<(params: any) => void>,
  searchNode: VueNodePropType as PropType<VueNode>,
  tableColumn: { type: Array as PropType<any[]>, default: () => [] },
  tooltip: [String, Object] as PropType<string | LabelTooltipType>,
  selectedRows: Array as PropType<any[]>,
  selectedRowKeys: Array as PropType<VueKey[]>,
  headerTitle: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,
  toolbar: Object as PropType<ProTableProps['toolbar']>,
  options: [Object, Boolean] as PropType<ProTableProps['options']>,
  toolBarRender: Function as PropType<ToolBarProps['toolBarRender']>,
  actionRef: Object as PropType<Ref<ActionType | undefined>>
})

export type ToolbarRenderProps = Partial<ExtractPropTypes<ReturnType<typeof toolbarRenderProps>>>

/** 这里负责与table交互，并且减少 render次数 */
// eslint-disable-next-line vue/one-component-per-file
const ToolbarRender = defineComponent({
  name: 'ToolbarRender',
  props: toolbarRenderProps(),
  setup(props, { slots }) {
    const onSearch = (keyword: string) => {
      if (!props.options || !props.options.search) {
        return
      }
      const { name = 'keyword' } = props.options.search === true ? {} : props.options.search

      /** 如果传入的 onSearch 返回值为 false，应该直接拦截请求 */
      const success = (props.options.search as OptionSearchProps)?.onSearch?.(keyword)

      if (success === false) return

      // 查询的时候的回到第一页
      props.actionRef?.value?.setPageInfo?.({
        current: 1
      })

      props.onFormSearchSubmit?.(
        omitUndefined({
          _timestamp: Date.now(),
          [name]: keyword
        })
      )
    }

    return () => {
      // 不展示 toolbar
      if (props.hideToolbar) {
        return null
      }
      return (
        <ToolBar
          tooltip={props.tooltip}
          columns={props.tableColumn}
          options={props.options}
          headerTitle={props.headerTitle}
          action={props.actionRef}
          onSearch={onSearch}
          selectedRows={props.selectedRows}
          selectedRowKeys={props.selectedRowKeys}
          toolBarRender={props.toolBarRender}
          toolbar={{
            filter: props.searchNode,
            ...toolbar
          }}
        >
          {slots}
        </ToolBar>
      )
    }
  }
})

export default ToolbarRender
