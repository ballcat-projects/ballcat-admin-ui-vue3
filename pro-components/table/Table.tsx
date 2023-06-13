import type { TablePaginationConfig, TableProps } from 'ant-design-vue'
import { Table } from 'ant-design-vue'
import 'ant-design-vue/es/table/style/index.less'
import 'ant-design-vue/es/pagination/style/index.less'

import ProCard from '#/card'

import type {
  TableCurrentDataSource,
  SortOrder,
  GetRowKey
} from 'ant-design-vue/es/table/interface'

import useFetchData from './useFetchData'
import Toolbar from './components/ToolBar'
import TableAlert from './components/Alert'

import {
  genColumnKey,
  mergePagination,
  useActionType,
  isBordered,
  parseDefaultColumnConfig
} from './utils'
import { genProColumnToColumn } from './utils/genProColumnToColumn'

import './index.less'
import type {
  ActionType,
  PageInfo,
  RequestData,
  TableRowSelection,
  UseFetchDataAction
} from './typing'
import { columnSort } from './utils/columnSort'
import { getPrefixCls } from '#/layout/RouteContext'
import type { VueKey, VueText } from '#/types'
import { computed, ref, defineComponent, watchEffect } from 'vue'
import type { CSSProperties, PropType } from 'vue'

import omitUndefined from '../utils/omitUndefined'
import { proTableProps } from './typing'
import { useVModel } from '@vueuse/core'
import { useIntl } from '#/provider'
import { useContainer, useProvideContainer } from '#/table/container'
import { tableProps } from 'ant-design-vue/es/table'
import type { ProSchemaComponentTypes } from '#/utils/typing'
import type { Key } from 'ant-design-vue/es/_util/type'
import { getRender } from '#/layout/utils'
import type { VueNodeOrRender } from '#/types'

const tablePropsInstance = tableProps()
const tablePropKeys = Object.keys(tablePropsInstance) as unknown as [keyof TableProps]

export type ProTableInstanceExpose = {
  loading: boolean
  actionRef: ActionType
}

// eslint-disable-next-line vue/one-component-per-file
const TableRender = defineComponent({
  name: 'TableRender',
  props: {
    ...proTableProps(),
    className: { type: String, default: undefined },
    action: { type: Object as PropType<UseFetchDataAction>, default: null },
    tableColumn: { type: Array as PropType<any[]>, default: () => [] },
    isLightFilter: { type: Boolean, default: false },
    onSortChange: { type: Function as PropType<(sort: any) => void>, default: undefined },
    onFilterChange: { type: Function as PropType<(sort: any) => void>, default: undefined },
    editableUtils: { type: Object as PropType<any>, default: undefined },
    getRowKey: { type: Function as PropType<GetRowKey<any>>, default: undefined }
  },
  slots: ['toolbarDom', 'alertDom', 'searchNode'],
  setup(props, { attrs, slots }) {
    const counter = useContainer()!

    /** 需要遍历一下，不然不支持嵌套表格 */
    const columns = computed(() => {
      const loopFilter = (column: any[]): any[] => {
        return column
          .map(item => {
            // 删掉不应该显示的
            const columnKey = genColumnKey(item.key, item.index)
            const config = counter.columnsMap.value[columnKey]
            if (config && config.show === false) {
              return false
            }
            if (item.children) {
              return {
                ...item,
                children: loopFilter(item.children)
              }
            }
            return item
          })
          .filter(Boolean)
      }
      return loopFilter(props.tableColumn)
    })

    /** 如果所有列中的 filters=true| undefined 说明是用的是本地筛选 任何一列配置 filters=false，就能绕过这个判断 */
    const useLocaleFilter = computed(() =>
      columns.value?.every(
        column =>
          (column.filters === true && column.onFilter === true) ||
          (column.filters === undefined && column.onFilter === undefined)
      )
    )

    // 用户传入的 table 属性
    const userTableProps = computed(() => {
      return Object.fromEntries(tablePropKeys.map(k => [k, props[k]]))
    })

    const tableProps = computed(() => ({
      ...userTableProps.value,
      size: props.size,
      rowSelection: props.rowSelection === false ? undefined : props.rowSelection,
      className: props.tableClassName,
      style: props.tableStyle,
      columns: columns.value.map(item => (item.isExtraColumns ? item.extraColumn : item)),
      loading: props.action.loading,
      dataSource: props.action.dataSource,
      pagination: props.pagination,
      onChange: (
        changePagination: TablePaginationConfig,
        filters: Record<string, (VueKey | boolean)[] | null>,
        sorter: any,
        extra: TableCurrentDataSource<unknown>
      ) => {
        props.onChange?.(changePagination, filters, sorter, extra)
        if (!useLocaleFilter.value) {
          props.onFilterChange?.(omitUndefined<any>(filters))
        }
        // 制造筛选的数据
        // 制造一个排序的数据
        if (Array.isArray(sorter)) {
          const data = sorter.reduce<Record<string, any>>(
            (pre, value) => ({
              ...pre,
              [`${value.field}`]: value.order
            }),
            {}
          )
          props.onSortChange?.(omitUndefined<any>(data))
        } else {
          const sorterOfColumn = sorter.column?.sorter
          const isSortByField = sorterOfColumn?.toString() === sorterOfColumn
          props.onSortChange?.(
            omitUndefined({
              [`${isSortByField ? sorterOfColumn : sorter.field}`]: sorter.order as SortOrder
            }) || {}
          )
        }
      }
    }))

    return () => {
      /** 默认的 table dom，如果是编辑模式，外面还要包个 form */
      const baseTableDom = (
        <Table {...tableProps.value} rowKey={props.rowKey}>
          {slots}
        </Table>
      )

      /** 自定义的 render */
      const tableDom = props.tableViewRender
        ? props.tableViewRender(
            {
              ...tableProps.value,
              rowSelection: props.rowSelection !== false ? props.rowSelection : undefined
            },
            baseTableDom
          )
        : baseTableDom

      // watchEffect(() => {
      //   // 如果带了name，说明要用自带的 form，需要设置一下。
      //   if (props.name && props.editable) {
      //     counter.setEditorTableForm(props.editable!.form!)
      //   }
      // })

      const tableContentDom = computed(() => {
        // if (props.editable && !props.name) {
        //   return (
        //     <>
        //       {toolbarDom}
        //       {alertDom}
        //       <ProForm
        //         onInit={(_, form) => {
        //           counter.setEditorTableForm(form)
        //         }}
        //         // @ts-ignore
        //         formRef={form => {
        //           counter.setEditorTableForm(form)
        //         }}
        //         {...props.editable?.formProps}
        //         component={false}
        //         form={props.editable?.form}
        //         onValuesChange={editableUtils.onValuesChange}
        //         key="table"
        //         submitter={false}
        //         omitNil={false}
        //         dateFormatter={props.dateFormatter}
        //         contentRender={(items: React.ReactNode) => {
        //           if (counter.editableForm) return items
        //           if (props.loading === false) return
        //           const loadingProps = props.loading === true ? {} : props.loading
        //           return (
        //             <div style={{ paddingTop: 100, textAlign: 'center' }}>
        //               <Spin size="large" {...loadingProps} />
        //             </div>
        //           )
        //         }}
        //       >
        //         {tableDom}
        //       </ProForm>
        //     </>
        //   )
        // }

        return (
          <>
            {slots.toolbarDom?.()}
            {slots.alertDom?.()}
            {tableDom}
          </>
        )
      })

      /** Table 区域的 dom，为了方便 render */
      const tableAreaDom =
        // cardProps 或者 有了name 就不需要这个padding了，不然会导致不好对齐
        props.cardProps === false ? (
          tableContentDom.value
        ) : (
          // @ts-ignore
          <ProCard
            ghost={props.ghost}
            bordered={isBordered('table', props.cardBordered)}
            bodyStyle={
              slots.toolbarDom
                ? {
                    paddingTop: 0
                  }
                : {
                    padding: 0
                  }
            }
            {...props.cardProps}
          >
            {tableContentDom.value}
          </ProCard>
        )

      const renderTable = () => {
        if (props.tableRender) {
          return props.tableRender(props, tableAreaDom, {
            toolbar: slots.toolbarDom?.(),
            alert: slots.alertDom?.(),
            table: tableDom || undefined
          })
        }
        return tableAreaDom
      }

      const proTableDom = (
        <div
          ref={counter.rootDomRef}
          class={[props.className, { [`${props.className}-polling`]: props.action.pollingLoading }]}
          style={attrs.style as CSSProperties}
        >
          {props.isLightFilter ? null : slots.searchNode}
          {/* 渲染一个额外的区域，用于一些自定义 */}
          {props.tableExtraRender && (
            <div class={`${props.className}-extra`}>
              {props.tableExtraRender(props, props.action.dataSource || [])}
            </div>
          )}
          {renderTable()}
        </div>
      )

      // TODO: 全屏处理
      // 如果不需要的全屏，ConfigProvider 没有意义
      if (!props.options || !props.options?.fullScreen) {
        return proTableDom
      }
      return proTableDom
    }
  }
})

// eslint-disable-next-line vue/one-component-per-file
const ProTable = defineComponent({
  name: 'ProTable',
  props: {
    ...proTableProps(),
    defaultClassName: { type: String, default: undefined },
    className: { type: String, default: undefined }
  },
  setup(props, { slots, expose }) {
    const className = [props.defaultClassName, props.className]

    const type: ProSchemaComponentTypes = 'table'

    /** 通用的来操作子节点的工具类 */
    const actionRef = ref<ActionType>()

    // const defaultFormRef = ref()
    // const formRef = propRef || defaultFormRef

    // useImperativeHandle(props.actionRef, () => actionRef.current)

    /** 单选多选的相关逻辑 */
    const selectedRowKeys = ref<Key[]>()

    watch(
      () => props.rowSelection,
      () => {
        if (props.rowSelection === false) {
          selectedRowKeys.value = undefined
        } else if (props.rowSelection.selectedRowKeys) {
          selectedRowKeys.value = [...props.rowSelection.selectedRowKeys]
        } else if (props.rowSelection.defaultSelectedRowKeys) {
          selectedRowKeys.value = [...props.rowSelection.defaultSelectedRowKeys]
        } else {
          selectedRowKeys.value = []
        }
      },
      { deep: true, immediate: true }
    )

    const setSelectedRowKeys = (keys: Key[]) => {
      selectedRowKeys.value = keys
    }

    const selectedRowsRef = ref<any[]>([])

    const setSelectedRowsAndKey = (keys: Key[], rows: unknown[]) => {
      setSelectedRowKeys(keys)
      if (!props.rowSelection || !props.rowSelection?.selectedRowKeys) {
        selectedRowsRef.value = rows
      }
    }

    const formSearch = props.manualRequest ? undefined : {}
    // const [formSearch, setFormSearch] = useMountMergeState<Record<string, any> | undefined>(() => {
    //   // 如果手动模式，或者 search 不存在的时候设置为 undefined
    //   // undefined 就不会触发首次加载
    //   if (manualRequest || search !== false) {
    //     return undefined
    //   }
    //   return {}
    // })

    const proFilter = ref<Record<string, VueText[] | null>>()
    const proSort = ref<Record<string, SortOrder>>()
    /** 设置默认排序和筛选值 */
    watchEffect(() => {
      const { sort, filter } = parseDefaultColumnConfig(props.columns)
      proFilter.value = filter
      proSort.value = sort
    })

    const intl = useIntl()

    /** 需要初始化 不然默认可能报错 这里取了 defaultCurrent 和 current 为了保证不会重复刷新 */
    const fetchPagination =
      typeof props.pagination === 'object'
        ? (props.pagination as TablePaginationConfig)
        : { defaultCurrent: 1, defaultPageSize: 10, pageSize: 10, current: 1 }

    const counter = useContainer()!
    // const counter = Container.useContainer()

    // ============================ useFetchData ============================
    const fetchData = () => {
      if (!props.request) return undefined
      return async (pageParams?: Record<string, any>) => {
        const actionParams = {
          ...(pageParams || {}),
          ...formSearch,
          ...props.params
        }

        // eslint-disable-next-line no-underscore-dangle
        delete (actionParams as any)._timestamp
        const response = await props.request?.(actionParams, proSort.value!, proFilter.value!)
        console.log('请求数据：', response)
        return response as RequestData<unknown>
      }
    }

    const loading = props.loading === undefined ? ref(false) : useVModel(props, 'loading')

    const action = useFetchData(fetchData(), props.defaultData, {
      pageInfo: props.pagination === false ? false : fetchPagination,
      loading: loading,
      dataSource: props.dataSource,
      onDataSourceChange: props.onDataSourceChange,
      onLoad: props.onLoad,
      onLoadingChange: props.onLoadingChange,
      onRequestError: props.onRequestError,
      postData: props.postData,
      revalidateOnFocus: props.revalidateOnFocus ?? false,
      manual: formSearch === undefined,
      polling: props.polling,
      effects: computed(() => [
        new URLSearchParams(props.params).toString(),
        new URLSearchParams(formSearch).toString(),
        new URLSearchParams(proSort.value as any).toString(),
        new URLSearchParams(proFilter.value as any).toString()
      ]),
      debounceTime: props.debounceTime,
      onPageInfoChange: pageInfo => {
        // @ts-ignore
        if (type === 'list' || !props.pagination || !fetchData) return

        // 总是触发一下 onChange 和  onShowSizeChange
        // 目前只有 List 和 Table 支持分页, List 有分页的时候打断 Table 的分页
        props.pagination?.onChange?.(pageInfo.current, pageInfo.pageSize)
        props.pagination?.onShowSizeChange?.(pageInfo.current, pageInfo.pageSize)
      }
    })

    // ============================ END ============================

    /** 默认聚焦的时候重新请求数据，这样可以保证数据都是最新的。 */
    // watchEffect(() => {
    //   // 手动模式和 request 为空都不生效
    //   if (
    //     props.manualRequest ||
    //     !props.request ||
    //     props.revalidateOnFocus === false
    //     // || props.form?.ignoreRules
    //   )
    //     return
    //
    //   // 聚焦时重新请求事件
    //   const visibilitychange = () => {
    //     if (document.visibilityState === 'visible') action.value.reload()
    //   }
    //
    //   document.addEventListener('visibilitychange', visibilitychange)
    // })
    // onUnmounted(() => document.removeEventListener('visibilitychange', visibilitychange))

    // ============================ RowKey ============================
    const getRowKey = computed<GetRowKey<any>>(() => {
      if (typeof props.rowKey === 'function') {
        return props.rowKey
      }
      return (record: any, index?: number) => {
        if (index === -1) {
          return (record as any)?.[props.rowKey as string]
        }
        // 如果 props 中有name 的话，用index 来做行号，这样方便转化为 index
        // if (props.name) {
        //   return index?.toString()
        // }
        return (record as any)?.[props.rowKey as string] ?? index?.toString()
      }
    })

    /** SelectedRowKeys受控处理selectRows */
    const preserveRecordsRef = computed<Map<any, unknown>>(() => {
      if (action.value.dataSource?.length) {
        const newCache = new Map<any, unknown>()
        action.value.dataSource.forEach(data => {
          const dataRowKey = getRowKey.value(data, -1)
          newCache.set(dataRowKey, data)
        })
        return newCache
      }
      return new Map<any, unknown>()
    })

    watchEffect(() => {
      selectedRowsRef.value =
        selectedRowKeys.value?.map(key => preserveRecordsRef.value?.get(key)) || []
    })

    /** 页面编辑的计算 */
    const pagination = computed(() => {
      const newPropsPagination = props.pagination === false ? false : { ...props.pagination }
      const pageConfig = {
        ...action.value.pageInfo,
        setPageInfo: ({ pageSize, current }: PageInfo) => {
          const { pageInfo } = action.value
          // pageSize 发生改变，并且你不是在第一页，切回到第一页
          // 这样可以防止出现 跳转到一个空的数据页的问题
          if (pageSize === pageInfo.pageSize || pageInfo.current === 1) {
            action.value.setPageInfo({ pageSize, current })
            return
          }

          // 通过request的时候清空数据，然后刷新不然可能会导致 pageSize 没有数据多
          if (props.request) action.value.setDataSource([])
          action.value.setPageInfo({
            pageSize,
            // 目前只有 List 和 Table 支持分页, List 有分页的时候 还是使用之前的当前页码
            current: 1
          })
        }
      }
      if (props.request && newPropsPagination) {
        delete newPropsPagination.onChange
        delete newPropsPagination.onShowSizeChange
      }
      return mergePagination<any>(newPropsPagination, pageConfig, intl)
    })

    // useDeepCompareEffect(() => {
    //   // request 存在且params不为空，且已经请求过数据才需要设置。
    //   if (props.request && props.params && action.value.dataSource && action.value?.pageInfo?.current !== 1) {
    //     action.value.setPageInfo({
    //       current: 1
    //     })
    //   }
    // }, [params])

    // 设置 name 到 store 中，里面用了 ref ，所以不用担心直接 set
    // counter.setPrefixName(props.name)

    /** 清空所有的选中项 */
    const onCleanSelected = () => {
      if (props.rowSelection && props.rowSelection.onChange) {
        props.rowSelection.onChange([], [])
      }
      setSelectedRowsAndKey([], [])
    }

    // counter.setaction.value(action.valueRef.current)
    // counter.propsRef.current = props

    /** 可编辑行的相关配置 */
    // const editableUtils = useEditableArray<any>({
    //   ...props.editable,
    //   tableName: props.name,
    //   getRowKey,
    //   childrenColumnName: props.expandable?.childrenColumnName,
    //   dataSource: action.value.dataSource || [],
    //   setDataSource: data => {
    //     props.editable?.onValuesChange?.(undefined as any, data)
    //     action.value.setDataSource(data)
    //   }
    // })

    /** 绑定 action */
    useActionType(actionRef, action.value, {
      fullScreen: () => {
        if (!counter.rootDomRef.value || !document.fullscreenEnabled) {
          return
        }
        if (document.fullscreenElement) {
          document.exitFullscreen()
        } else {
          counter.rootDomRef.value?.requestFullscreen()
        }
      },
      onCleanSelected: () => {
        // 清空选中行
        // onCleanSelected()
      },
      resetAll: () => {
        // 清空选中行
        // onCleanSelected()
        // 清空筛选
        proFilter.value = {}
        // 清空排序
        proSort.value = {}
        // 清空 toolbar 搜索
        counter.setKeyWords(undefined)
        // 重置页码
        action.value.setPageInfo({
          current: 1
        })

        // 重置表单
        // props.formRef?.current?.resetFields()
        // setFormSearch({})
      },
      editableUtils: undefined
    })

    // ---------- 列计算相关 start  -----------------
    const tableColumn = computed(() => {
      return genProColumnToColumn({
        columns: props.columns,
        counter,
        columnEmptyText: '-',
        type,
        editableUtils: null,
        rowKey: props.rowKey,
        childrenColumnName: props.childrenColumnName
      }).sort(columnSort(counter.columnsMap.value))
    })

    /** Table Column 变化的时候更新一下，这个参数将会用于渲染 */
    watchEffect(() => {
      if (tableColumn.value && tableColumn.value.length > 0) {
        // 重新生成key的字符串用于排序
        const columnKeys = tableColumn.value.map(item => genColumnKey(item.key, item.index))
        counter.setSortKeyColumns(columnKeys)
      }
    })

    // /** 同步 Pagination，支持受控的 页码 和 pageSize */
    // useDeepCompareEffect(() => {
    //   const { pageInfo } = action.value
    //   const { current = pageInfo?.current, pageSize = pageInfo?.pageSize } = props.pagination || {}
    //   if (
    //     props.pagination &&
    //     (current || pageSize) &&
    //     (pageSize !== pageInfo?.pageSize || current !== pageInfo?.current)
    //   ) {
    //     action.value.setPageInfo({
    //       pageSize: pageSize || pageInfo.pageSize,
    //       current: current || pageInfo.current
    //     })
    //   }
    // }, [
    //   props.pagination && props.pagination.pageSize,
    //   props.pagination && props.pagination.current
    // ])

    /** 行选择相关的问题 */
    const rowSelection = computed<TableRowSelection>(() => ({
      selectedRowKeys: selectedRowKeys.value,
      ...props.rowSelection,
      onChange: (keys: Key[], rows: unknown[]) => {
        if (props.rowSelection && props.rowSelection.onChange) {
          props.rowSelection.onChange(keys, rows)
        }
        setSelectedRowsAndKey(keys, rows)
      }
    }))

    /** 是不是 LightFilter, LightFilter 有一些特殊的处理 */
    const isLightFilter: boolean = props.search !== false && props.search?.filterType === 'light'

    // const onFormSearchSubmit = <Y extends ParamsType>(values: Y): any => {
    //   // 判断search.onSearch返回值决定是否更新formSearch
    //   if (props.options && props.options.search) {
    //     const { name = 'keyword' } = props.options.search === true ? {} : props.options.search
    //
    //     /** 如果传入的 onSearch 返回值为 false，则不要把options.search.name对应的值set到formSearch */
    //     const success = (props.options.search as OptionSearchProps)?.onSearch?.(counter.keyWords!)
    //
    //     if (success !== false) {
    //       setFormSearch({
    //         ...values,
    //         [name]: counter.keyWords
    //       })
    //       return
    //     }
    //   }
    //
    //   setFormSearch(values)
    // }

    const searchNode = null
    // const searchNode =
    //   search === false && type !== 'form' ? null : (
    //     <FormRender<T, U>
    //       pagination={pagination}
    //       beforeSearchSubmit={beforeSearchSubmit}
    //       action={actionRef}
    //       columns={propsColumns}
    //       onFormSearchSubmit={values => {
    //         onFormSearchSubmit(values)
    //       }}
    //       ghost={ghost}
    //       onReset={props.onReset}
    //       onSubmit={props.onSubmit}
    //       loading={!!action.value.loading}
    //       manualRequest={manualRequest}
    //       search={search}
    //       form={props.form}
    //       formRef={formRef}
    //       type={props.type || 'table'}
    //       cardBordered={props.cardBordered}
    //       dateFormatter={props.dateFormatter}
    //     />
    //   )

    expose({
      loading: loading,
      actionRef: actionRef
    })

    return () => {
      const headerTitle = getRender<VueNodeOrRender>(props, slots, 'headerTitle')
      /** 内置的工具栏 */
      const toolbarDom =
        props.toolBarRender === false ? null : (
          <Toolbar
            headerTitle={headerTitle}
            hideToolbar={
              props.options === false &&
              !props.headerTitle &&
              !props.toolBarRender &&
              !props.toolbar &&
              !isLightFilter
            }
            selectedRows={selectedRowsRef.value}
            selectedRowKeys={selectedRowKeys.value!}
            tableColumn={tableColumn.value}
            tooltip={props.tooltip}
            toolbar={props.toolbar}
            onFormSearchSubmit={() => {
              // setFormSearch({
              //   ...formSearch,
              //   ...newValues
              // })
            }}
            searchNode={isLightFilter ? searchNode : null}
            options={props.options}
            actionRef={actionRef}
            toolBarRender={props.toolBarRender}
          >
            {slots}
          </Toolbar>
        )

      /** 内置的多选操作栏 */
      const alertDom =
        props.rowSelection !== false ? (
          <TableAlert
            selectedRowKeys={selectedRowKeys.value!}
            selectedRows={selectedRowsRef.value}
            onCleanSelected={onCleanSelected}
            alertOptionRender={props.tableAlertOptionRender}
            alertInfoRender={props.tableAlertRender}
            alwaysShowAlert={props.rowSelection?.alwaysShowAlert}
          >
            {{
              alertOptionRender: slots.tableAlertOptionRender,
              alertInfoRender: slots.tableAlertRender
            }}
          </TableAlert>
        ) : null

      return (
        <TableRender
          {...props}
          // name={false}
          size={counter.tableSize.value}
          onSizeChange={counter.setTableSize}
          pagination={pagination.value}
          // searchNode={props.searchNode}
          rowSelection={props.rowSelection !== false ? rowSelection.value : undefined}
          class={className}
          tableColumn={tableColumn.value}
          isLightFilter={isLightFilter}
          action={action.value}
          onSortChange={x => (proSort.value = x)}
          onFilterChange={x => (proFilter.value = x)}
          editableUtils={null}
          getRowKey={getRowKey.value}
        >
          {{
            alertDom: () => alertDom,
            toolbarDom: () => toolbarDom,
            ...slots
          }}
        </TableRender>
      )
    }
  }
})

/**
 * 🏆 Use Ant Design Table like a Pro! 更快 更好 更方便
 *
 * @param props
 */
// eslint-disable-next-line vue/one-component-per-file
const ProviderWarp = defineComponent({
  name: 'ProviderWarp',
  props: proTableProps(),
  slots: ['toolBarRender'],
  setup(props, { slots, expose }) {
    // @ts-ignore
    useProvideContainer(props)

    const proTableRef = ref()
    expose({
      loading: computed(() => proTableRef?.value.loading),
      actionRef: computed(() => proTableRef?.value.actionRef)
    })

    return () => (
      <ProTable ref={proTableRef} defaultClassName={getPrefixCls('pro-table')} {...props}>
        {slots}
      </ProTable>
    )
  }
})

ProviderWarp.Summary = Table.Summary

export default ProviderWarp
