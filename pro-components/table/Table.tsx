import type { TablePaginationConfig, TableProps } from 'ant-design-vue'
import { Table } from 'ant-design-vue'
import 'ant-design-vue/es/table/style/index.less'
import 'ant-design-vue/es/pagination/style/index.less'

import ProCard from '#/card'

import type {
  TableCurrentDataSource,
  SorterResult,
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

    /** ???????????????????????????????????????????????? */
    const columns = computed(() => {
      const loopFilter = (column: any[]): any[] => {
        return column
          .map(item => {
            // ????????????????????????
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

    /** ????????????????????? filters=true| undefined ?????????????????????????????? ?????????????????? filters=false??????????????????????????? */
    const useLocaleFilter = computed(() =>
      columns.value?.every(
        column =>
          (column.filters === true && column.onFilter === true) ||
          (column.filters === undefined && column.onFilter === undefined)
      )
    )

    // ??????????????? table ??????
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
        sorter: SorterResult<unknown> | SorterResult<unknown>[],
        extra: TableCurrentDataSource<unknown>
      ) => {
        props.onChange?.(changePagination, filters, sorter, extra)
        if (!useLocaleFilter.value) {
          props.onFilterChange?.(omitUndefined<any>(filters))
        }
        // ?????????????????????
        // ???????????????????????????
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
      /** ????????? table dom????????????????????????????????????????????? form */
      const baseTableDom = (
        <Table {...tableProps.value} rowKey={props.rowKey}>
          {slots}
        </Table>
      )

      /** ???????????? render */
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
      //   // ????????????name???????????????????????? form????????????????????????
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

      /** Table ????????? dom??????????????? render */
      const tableAreaDom =
        // cardProps ?????? ??????name ??????????????????padding?????????????????????????????????
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
          {/* ??????????????????????????????????????????????????? */}
          {props.tableExtraRender && (
            <div class={`${props.className}-extra`}>
              {props.tableExtraRender(props, props.action.dataSource || [])}
            </div>
          )}
          {renderTable()}
        </div>
      )

      // TODO: ????????????
      // ???????????????????????????ConfigProvider ????????????
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

    /** ??????????????????????????????????????? */
    const actionRef = ref<ActionType>()

    // const defaultFormRef = ref()
    // const formRef = propRef || defaultFormRef

    // useImperativeHandle(props.actionRef, () => actionRef.current)

    /** ??????????????????????????? */
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

    const formSearch = {}
    // const [formSearch, setFormSearch] = useMountMergeState<Record<string, any> | undefined>(() => {
    //   // ??????????????????????????? search ??????????????????????????? undefined
    //   // undefined ???????????????????????????
    //   if (manualRequest || search !== false) {
    //     return undefined
    //   }
    //   return {}
    // })

    const proFilter = ref<Record<string, VueText[] | null>>()
    const proSort = ref<Record<string, SortOrder>>()
    /** ?????????????????????????????? */
    watchEffect(() => {
      const { sort, filter } = parseDefaultColumnConfig(props.columns)
      proFilter.value = filter
      proSort.value = sort
    })

    const intl = useIntl()

    /** ??????????????? ???????????????????????? ???????????? defaultCurrent ??? current ?????????????????????????????? */
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
        console.log('???????????????', response)
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

        // ?????????????????? onChange ???  onShowSizeChange
        // ???????????? List ??? Table ????????????, List ???????????????????????? Table ?????????
        props.pagination?.onChange?.(pageInfo.current, pageInfo.pageSize)
        props.pagination?.onShowSizeChange?.(pageInfo.current, pageInfo.pageSize)
      }
    })

    // ============================ END ============================

    /** ???????????????????????????????????????????????????????????????????????????????????? */
    // watchEffect(() => {
    //   // ??????????????? request ??????????????????
    //   if (
    //     props.manualRequest ||
    //     !props.request ||
    //     props.revalidateOnFocus === false
    //     // || props.form?.ignoreRules
    //   )
    //     return
    //
    //   // ???????????????????????????
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
        // ?????? props ??????name ????????????index ???????????????????????????????????? index
        // if (props.name) {
        //   return index?.toString()
        // }
        return (record as any)?.[props.rowKey as string] ?? index?.toString()
      }
    })

    /** SelectedRowKeys????????????selectRows */
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

    /** ????????????????????? */
    const pagination = computed(() => {
      const newPropsPagination = props.pagination === false ? false : { ...props.pagination }
      const pageConfig = {
        ...action.value.pageInfo,
        setPageInfo: ({ pageSize, current }: PageInfo) => {
          const { pageInfo } = action.value
          // pageSize ???????????????????????????????????????????????????????????????
          // ???????????????????????? ???????????????????????????????????????
          if (pageSize === pageInfo.pageSize || pageInfo.current === 1) {
            action.value.setPageInfo({ pageSize, current })
            return
          }

          // ??????request????????????????????????????????????????????????????????? pageSize ???????????????
          if (props.request) action.value.setDataSource([])
          action.value.setPageInfo({
            pageSize,
            // ???????????? List ??? Table ????????????, List ?????????????????? ?????????????????????????????????
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
    //   // request ?????????params??????????????????????????????????????????????????????
    //   if (props.request && props.params && action.value.dataSource && action.value?.pageInfo?.current !== 1) {
    //     action.value.setPageInfo({
    //       current: 1
    //     })
    //   }
    // }, [params])

    // ?????? name ??? store ?????????????????? ref ??????????????????????????? set
    // counter.setPrefixName(props.name)

    /** ???????????????????????? */
    const onCleanSelected = () => {
      if (props.rowSelection && props.rowSelection.onChange) {
        props.rowSelection.onChange([], [])
      }
      setSelectedRowsAndKey([], [])
    }

    // counter.setaction.value(action.valueRef.current)
    // counter.propsRef.current = props

    /** ??????????????????????????? */
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

    /** ?????? action */
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
        // ???????????????
        // onCleanSelected()
      },
      resetAll: () => {
        // ???????????????
        // onCleanSelected()
        // ????????????
        proFilter.value = {}
        // ????????????
        proSort.value = {}
        // ?????? toolbar ??????
        counter.setKeyWords(undefined)
        // ????????????
        action.value.setPageInfo({
          current: 1
        })

        // ????????????
        // props.formRef?.current?.resetFields()
        // setFormSearch({})
      },
      editableUtils: undefined
    })

    // ---------- ??????????????? start  -----------------
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

    /** Table Column ???????????????????????????????????????????????????????????? */
    watchEffect(() => {
      if (tableColumn.value && tableColumn.value.length > 0) {
        // ????????????key????????????????????????
        const columnKeys = tableColumn.value.map(item => genColumnKey(item.key, item.index))
        counter.setSortKeyColumns(columnKeys)
      }
    })

    // /** ?????? Pagination?????????????????? ?????? ??? pageSize */
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

    /** ???????????????????????? */
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

    /** ????????? LightFilter, LightFilter ???????????????????????? */
    const isLightFilter: boolean = props.search !== false && props.search?.filterType === 'light'

    // const onFormSearchSubmit = <Y extends ParamsType>(values: Y): any => {
    //   // ??????search.onSearch???????????????????????????formSearch
    //   if (props.options && props.options.search) {
    //     const { name = 'keyword' } = props.options.search === true ? {} : props.options.search
    //
    //     /** ??????????????? onSearch ???????????? false???????????????options.search.name????????????set???formSearch */
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
      /** ?????????????????? */
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

      /** ???????????????????????? */
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
 * ???? Use Ant Design Table like a Pro! ?????? ?????? ?????????
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
