import {
  SettingOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined
} from '@ant-design/icons-vue'

import { Checkbox, Tree, Popover, Tooltip, Space } from 'ant-design-vue'
import 'ant-design-vue/es/checkbox/style/index.less'
import 'ant-design-vue/es/tree/style/index.less'
import 'ant-design-vue/es/popover/style/index.less'
import 'ant-design-vue/es/tooltip/style/index.less'
import 'ant-design-vue/es/space/style/index.less'

import type { TableColumnType } from 'ant-design-vue'
import type { DataNode } from 'ant-design-vue/es/tree'

import { genColumnKey } from '../../utils'
import type { ProColumns } from '../../typing'

import './index.less'
import type { CheckboxChangeEvent } from 'ant-design-vue/es/checkbox/interface'
import type { FunctionalComponent, PropType } from 'vue'
import { useIntl } from '#/provider'
import { getPrefixCls } from '#/layout/RouteContext'
import type { VueKey, VueNode } from '#/types'
import type { ColumnsState } from '#/table/container'
import { useContainer } from '#/table/container'
import { computed, ref, watchEffect } from 'vue'
import omit from 'ant-design-vue/es/_util/omit'

type ColumnSettingProps<T = any> = {
  columns: TableColumnType<T>[]
  draggable?: boolean
  checkable?: boolean
  extra?: VueNode
  checkedReset?: boolean
  listsHeight?: number
}

const ToolTipIcon: FunctionalComponent<{
  title: string
  columnKey: string | number
  show: boolean
  fixed: 'left' | 'right' | undefined
}> = ({ title, show, columnKey, fixed }, { slots }) => {
  const { columnsMap, setColumnsMap } = useContainer()!
  if (!show) {
    return null
  }
  return (
    <Tooltip title={title}>
      <span
        onClick={e => {
          e.stopPropagation()
          e.preventDefault()
          const config = columnsMap.value[columnKey] || {}
          const disableIcon = typeof config.disable === 'boolean' && config.disable
          if (disableIcon) return
          const columnKeyMap = {
            ...columnsMap.value,
            [columnKey]: { ...config, fixed } as ColumnsState
          }
          setColumnsMap(columnKeyMap)
        }}
      >
        {slots.default?.()}
      </span>
    </Tooltip>
  )
}

const CheckboxListItem: FunctionalComponent<{
  columnKey: string | number
  className?: string
  title?: VueNode
  fixed?: boolean | 'left' | 'right'
  hasParent?: boolean // 等于 react 版本的 isLeaf 属性，由于 ant-design-vue 会默认给 isLeaf 属性赋值，这里需要一个额外的属性来处理
}> = ({ columnKey, hasParent, title, className, fixed }) => {
  const intl = useIntl()
  const dom = (
    <span class={`${className}-list-item-option`}>
      <ToolTipIcon
        columnKey={columnKey}
        fixed="left"
        title={intl.getMessage('tableToolBar.leftPin', '固定在列首')}
        show={fixed !== 'left'}
      >
        <VerticalAlignTopOutlined />
      </ToolTipIcon>
      <ToolTipIcon
        columnKey={columnKey}
        fixed={undefined}
        title={intl.getMessage('tableToolBar.noPin', '不固定')}
        show={!!fixed}
      >
        <VerticalAlignMiddleOutlined />
      </ToolTipIcon>
      <ToolTipIcon
        columnKey={columnKey}
        fixed="right"
        title={intl.getMessage('tableToolBar.rightPin', '固定在列尾')}
        show={fixed !== 'right'}
      >
        <VerticalAlignBottomOutlined />
      </ToolTipIcon>
    </span>
  )
  return (
    <span class={`${className}-list-item`} key={columnKey}>
      <div class={`${className}-list-item-title`}>{title}</div>
      {!hasParent ? dom : null}
    </span>
  )
}

const CheckboxList = defineComponent({
  name: 'CheckboxList',
  props: {
    list: {
      type: Array as PropType<(ProColumns<any> & { index?: number })[]>,
      default: undefined
    },
    className: { type: String, default: undefined },
    title: { type: String, default: undefined },
    draggable: { type: Boolean, default: undefined },
    checkable: { type: Boolean, default: undefined },
    showTitle: { type: Boolean, default: true },
    listHeight: { type: Number, default: 280 }
  },
  setup(props) {
    const { columnsMap, setColumnsMap, sortKeyColumns, setSortKeyColumns } = useContainer()!
    const show = computed(() => props.list && props.list.length > 0)
    const treeDataConfig = computed(() => {
      if (!show.value) return {}
      const checkedKeys: string[] = []

      const loopData = (data: any[], parentConfig?: ColumnsState): DataNode[] =>
        data.map(({ key, children, ...rest }) => {
          const columnKey = genColumnKey(key, rest.index)
          const config = columnsMap.value[columnKey || 'null'] || { show: true }
          if (config.show !== false && parentConfig?.show !== false && !children) {
            checkedKeys.push(columnKey)
          }
          const item: DataNode = {
            key: columnKey,
            ...omit(rest, ['className']),
            selectable: false,
            disabled: config.disable === true,
            disableCheckbox:
              typeof config.disable === 'boolean' ? config.disable : config.disable?.checkbox,
            hasParent: parentConfig ? true : undefined
          }
          if (children) {
            item.children = loopData(children, config)
          }
          return item
        })
      return { list: loopData(props.list as any), keys: checkedKeys }
    })

    /** 移动到指定的位置 */
    const move = (id: VueKey, targetId: VueKey, dropPosition: number) => {
      const newMap = { ...columnsMap.value }
      // @ts-ignore
      const newColumns = [...sortKeyColumns.value]
      const findIndex = newColumns.findIndex(columnKey => columnKey === id)
      const targetIndex = newColumns.findIndex(columnKey => columnKey === targetId)
      const isDownWord = dropPosition > findIndex
      if (findIndex < 0) return
      const targetItem = newColumns[findIndex]
      newColumns.splice(findIndex, 1)
      if (dropPosition === 0) {
        newColumns.unshift(targetItem)
      } else {
        newColumns.splice(isDownWord ? targetIndex : targetIndex + 1, 0, targetItem)
      }
      // 重新生成排序数组
      newColumns.forEach((key, order) => {
        newMap[key] = { ...(newMap[key] || {}), order }
      })
      // 更新数组
      setColumnsMap(newMap)
      setSortKeyColumns(newColumns)
    }

    /** 选中反选功能 */
    const onCheckTree = (e: any) => {
      const columnKey = e.node.key
      const newSetting = { ...columnsMap.value[columnKey] }

      newSetting.show = e.checked

      setColumnsMap({
        ...columnsMap.value,
        [columnKey]: newSetting
      })
    }

    return () => {
      if (!show.value) {
        return null
      }

      const listDom = (
        <Tree
          itemHeight={24}
          draggable={
            props.draggable &&
            !!treeDataConfig.value.list?.length &&
            treeDataConfig.value.list?.length > 1
          }
          checkable={props.checkable}
          onDrop={info => {
            const dropKey = info.node.key
            const dragKey = info.dragNode.key
            const { dropPosition, dropToGap } = info
            const position = dropPosition === -1 || !dropToGap ? dropPosition + 1 : dropPosition
            move(dragKey, dropKey, position)
          }}
          blockNode
          onCheck={(_, e) => onCheckTree(e)}
          checkedKeys={treeDataConfig.value.keys}
          showLine={false}
          height={props.listHeight}
          treeData={treeDataConfig.value.list}
        >
          {{
            title: (_node: DataNode) => {
              const node = { ..._node, children: undefined }
              return <CheckboxListItem className={props.className} {...node} columnKey={node.key} />
            }
          }}
        </Tree>
      )

      return (
        <>
          {props.showTitle && <span class={`${props.className}-list-title`}>{props.title}</span>}
          {listDom}
        </>
      )
    }
  }
})

const GroupCheckboxList: FunctionalComponent<{
  localColumns: (ProColumns<any> & { index?: number })[]
  className?: string
  draggable: boolean
  checkable: boolean
  listsHeight?: number
}> = ({ localColumns, className, draggable, checkable, listsHeight }) => {
  const rightList: (ProColumns<any> & { index?: number })[] = []
  const leftList: (ProColumns<any> & { index?: number })[] = []
  const list: (ProColumns<any> & { index?: number })[] = []
  const intl = useIntl()

  localColumns.forEach(item => {
    /** 不在 setting 中展示的 */
    if (item.hideInSetting) {
      return
    }
    const { fixed } = item
    if (fixed === 'left') {
      leftList.push(item)
      return
    }
    if (fixed === 'right') {
      rightList.push(item)
      return
    }
    list.push(item)
  })

  const showRight = rightList && rightList.length > 0
  const showLeft = leftList && leftList.length > 0
  return (
    <div
      class={[
        `${className}-list`,
        {
          [`${className}-list-group`]: showRight || showLeft
        }
      ]}
    >
      <CheckboxList
        title={intl.getMessage('tableToolBar.leftFixedTitle', '固定在左侧')}
        list={leftList}
        draggable={draggable}
        checkable={checkable}
        className={className}
        listHeight={listsHeight}
      />
      {/* 如果没有任何固定，不需要显示title */}
      <CheckboxList
        list={list}
        draggable={draggable}
        checkable={checkable}
        title={intl.getMessage('tableToolBar.noFixedTitle', '不固定')}
        showTitle={showLeft || showRight}
        className={className}
        listHeight={listsHeight}
      />
      <CheckboxList
        title={intl.getMessage('tableToolBar.rightFixedTitle', '固定在右侧')}
        list={rightList}
        draggable={draggable}
        checkable={checkable}
        className={className}
        listHeight={listsHeight}
      />
    </div>
  )
}

const ColumnSetting: FunctionalComponent<ColumnSettingProps> = (
  props: ColumnSettingProps,
  { slots }
) => {
  const columnRef = ref({})
  const counter = useContainer()!
  const localColumns: TableColumnType &
    {
      index?: number
      fixed?: any
      key?: any
    }[] = props.columns
  const { checkedReset = true } = props
  const { columnsMap, setColumnsMap, clearPersistenceStorage } = counter

  watchEffect(() => {
    if (counter.propsRef.value?.columnsState?.value) {
      columnRef.value = JSON.parse(
        JSON.stringify(counter.propsRef.value?.columnsState?.value || {})
      )
    }
  })

  /**
   * 设置全部选中，或全部未选中
   *
   * @param show
   */
  const setAllSelectAction = (show = true) => {
    const columnKeyMap = {}
    const loopColumns = (columns: any) => {
      columns.forEach(({ key, fixed, index, children }: any) => {
        const columnKey = genColumnKey(key, index)
        if (columnKey) {
          // @ts-ignore
          columnKeyMap[columnKey] = {
            show,
            fixed
          }
        }
        if (children) {
          loopColumns(children)
        }
      })
    }
    loopColumns(localColumns)
    setColumnsMap(columnKeyMap)
  }

  /** 全选和反选 */
  const checkedAll = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      setAllSelectAction()
    } else {
      setAllSelectAction(false)
    }
  }

  /** 重置项目 */
  const clearClick = () => {
    clearPersistenceStorage?.()
    setColumnsMap(columnRef.value)
  }

  // 未选中的 key 列表
  const unCheckedKeys = computed(() =>
    Object.values(columnsMap.value).filter(
      // @ts-ignore
      value => !value || value.show === false
    )
  )

  // 是否已经选中
  const indeterminate = computed(
    () => unCheckedKeys.value.length > 0 && unCheckedKeys.value.length !== localColumns.length
  )

  const intl = useIntl()
  const className = getPrefixCls('pro-table-column-setting')
  return (
    <Popover
      arrowPointAtCenter
      title={
        <div class={`${className}-title`}>
          <Checkbox
            indeterminate={indeterminate.value}
            checked={
              unCheckedKeys.value.length === 0 && unCheckedKeys.value.length !== localColumns.length
            }
            onChange={e => checkedAll(e)}
          >
            {intl.getMessage('tableToolBar.columnDisplay', '列展示')}
          </Checkbox>
          {checkedReset ? (
            <a onClick={clearClick} class={`${className}-action-rest-button`}>
              {intl.getMessage('tableToolBar.reset', '重置')}
            </a>
          ) : null}
          {props?.extra ? (
            <Space size={12} align="center">
              {props.extra}
            </Space>
          ) : null}
        </div>
      }
      overlayClassName={`${className}-overlay`}
      trigger="click"
      placement="bottomRight"
      content={
        <GroupCheckboxList
          checkable={props.checkable ?? true}
          draggable={props.draggable ?? true}
          className={className}
          localColumns={localColumns}
          listsHeight={props.listsHeight}
        />
      }
    >
      {slots.default?.() || (
        <Tooltip title={intl.getMessage('tableToolBar.columnSetting', '列设置')}>
          <SettingOutlined />
        </Tooltip>
      )}
    </Popover>
  )
}

export default ColumnSetting
