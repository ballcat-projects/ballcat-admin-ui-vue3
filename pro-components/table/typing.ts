import type { SpinProps } from 'ant-design-vue/lib/spin'
import type { TableProps } from 'ant-design-vue/lib/table'

import type {
  ColumnFilterItem,
  ColumnType,
  CompareFn,
  SortOrder
} from 'ant-design-vue/lib/table/interface'
import type { ComputedRef, CSSProperties, ExtractPropTypes, PropType, Ref } from 'vue'
import type { AlertRenderType } from './components/Alert'
import type { ListToolBarProps } from './components/ListToolBar'
import type { OptionConfig, ToolBarProps } from './components/ToolBar'
import type { DensitySize } from './components/ToolBar/DensityIcon'
import type { ColumnsState, CounterType } from './container'
import type { SizeType } from 'ant-design-vue/lib/config-provider/context'

import type { TooltipProps } from 'ant-design-vue/es/tooltip'
import type { VueKey, VueNode, VueNodeOrRender } from '#/types'
import type { CardProps, InputProps } from 'ant-design-vue'
import type { ChangeEvent } from 'ant-design-vue/es/_util/EventInterface'
import { tableProps } from 'ant-design-vue/es/table'
import type { WithFalse } from '#/layout/types'
import { VueNodeOrRenderPropType } from '#/types'
import omit from 'ant-design-vue/es/_util/omit'
import type { ProFieldEmptyText } from '#/field'
import type { LightWrapperProps } from '#/form/BaseForm/LightWrapper'
import type { SearchConfig } from '#/table/components/Form/FormRender'
import type {
  ProCoreActionType,
  ProSchema,
  ProSchemaComponentTypes,
  ProTableEditableFnType,
  SearchTransformKeyFn
} from '#/utils/typing'
import type { ApiResult } from '@/api/types'

export type WrapperTooltipProps = TooltipProps & {
  icon?: VueNode
}
export type LabelTooltipType = WrapperTooltipProps | VueNode

export interface SearchProps extends InputProps {
  inputPrefixCls?: string
  onSearch?: (value: string, event?: ChangeEvent | MouseEvent | KeyboardEvent) => void
  // enterButton?: VueNode // vue 暂时不支持 注释
  loading?: boolean
}

export type PageInfo = {
  pageSize: number
  total: number
  current: number
}

export type PageResult<T> = {
  records: T[]
  total: number
}

export type RequestData<T> = ApiResult<PageResult<T>>

export type UseFetchDataAction<T = any> = {
  dataSource: T[]
  setDataSource: (dataSource: T[]) => void
  loading: boolean | SpinProps | undefined
  pageInfo: PageInfo
  reload: () => Promise<void>
  fullScreen?: () => void
  reset: () => void
  pollingLoading: boolean
  setPageInfo: (pageInfo: Partial<PageInfo>) => void
}

/** 转化列的定义 */
export type ColumnRenderInterface<T> = {
  item: ProColumns<T>
  text: any
  row: T
  index: number
  columnEmptyText?: ProFieldEmptyText
  type: ProSchemaComponentTypes
  counter: CounterType
}

export type TableRowSelection = TableProps<any>['rowSelection']

export type ExtraProColumnType<T> = Omit<
  ColumnType<T>,
  'render' | 'children' | 'title' | 'filters' | 'onFilter' | 'sorter'
> & {
  sorter?:
    | string
    | boolean
    | CompareFn<T>
    | {
        compare?: CompareFn<T>
        /** Config multiple sorter order priority */
        multiple?: number
      }
}

export type ProColumnType<T = unknown, ValueType = 'text'> = ProSchema<
  T,
  ExtraProColumnType<T> & {
    index?: number
    /**
     * 每个表单占据的格子大小
     *
     * @param 总宽度 = span* colSize
     * @param 默认为 1
     */
    colSize?: number

    /** 搜索表单的默认值 */
    initialValue?: any

    /** 是否缩略 */
    ellipsis?: boolean | { showTitle?: boolean }
    /** 是否拷贝 */
    copyable?: boolean

    /** @deprecated Use `search=false` instead 在查询表单中隐藏 */
    hideInSearch?: boolean

    /** 在查询表单中隐藏 */
    search?:
      | false
      | {
          /**
           * Transform: (value: any) => ({ startTime: value[0], endTime: value[1] }),
           *
           * 转化值的key, 一般用于事件区间的转化
           */
          transform: SearchTransformKeyFn
        }

    /** 在 table 中隐藏 */
    hideInTable?: boolean

    /** 在新建表单中删除 */
    hideInForm?: boolean

    /** 不在配置工具中显示 */
    hideInSetting?: boolean

    /** 表头的筛选菜单项 */
    filters?: boolean | ColumnFilterItem[]

    /** 筛选的函数，设置为 false 会关闭自带的本地筛选 */
    onFilter?: boolean | ColumnType<T>['onFilter']

    /** Form 的排序 */
    order?: number

    /** 可编辑表格是否可编辑 */
    editable?: boolean | ProTableEditableFnType<T>

    /** @private */
    listKey?: string

    /** 只读 */
    readonly?: boolean

    /** 列设置的 disabled */
    disable?:
      | boolean
      | {
          checkbox: boolean
        }
  },
  ProSchemaComponentTypes,
  ValueType,
  {
    lightProps?: LightWrapperProps
  }
>

export type ProColumnGroupType<RecordType, ValueType> = {
  children: ProColumns<RecordType>[]
} & ProColumnType<RecordType, ValueType>

export type ProColumns<T = any, ValueType = 'text'> =
  | ProColumnGroupType<T, ValueType>
  | ProColumnType<T, ValueType>

export type BorderedType = 'search' | 'table'

export type Bordered =
  | boolean
  | {
      search?: boolean
      table?: boolean
    }

export type ColumnsStateType = {
  /**
   * 持久化的类型，支持 localStorage 和 sessionStorage
   *
   * @param localStorage 设置在关闭浏览器后也是存在的
   * @param sessionStorage 关闭浏览器后会丢失
   */
  persistenceType?: 'localStorage' | 'sessionStorage'
  /** 持久化的key，用于存储到 storage 中 */
  persistenceKey?: string
  /** ColumnsState 的值，columnsStateMap将会废弃 */
  defaultValue?: Record<string, ColumnsState>
  /** ColumnsState 的值，columnsStateMap将会废弃 */
  value?: Record<string, ColumnsState>
  onChange?: (map: Record<string, ColumnsState>) => void
}

// 表格请求数据的方法
export type TableRequest<U = Record<string, unknown>> = (
  params: U & {
    pageSize?: number
    current?: number
    keyword?: string
  },
  sort: Record<string, SortOrder>,
  filter: Record<string, VueKey[] | null>
) => Promise<unknown>

export const proTableProps = <T, U = Record<string, any>, ValueType = 'text'>() => ({
  ...omit(tableProps(), ['columns', 'rowSelection']),

  /**
   * @name 列配置能力，支持一个数组
   */
  columns: { type: Array as PropType<ProColumns<T, ValueType>[]>, default: () => [] },

  /**
   * ListToolBar 的属性
   */
  toolbar: Object as PropType<ListToolBarProps>,

  /**
   * 幽灵模式，即是否取消卡片内容区域的 padding 和 卡片的背景颜色。
   */
  ghost: { type: Boolean, default: false },

  /**
   * request 的参数，修改之后会触发更新
   *
   * @example pathname 修改重新触发 request
   * params={{ pathName }}
   */
  params: { type: Object as PropType<U>, default: () => ({}) },

  /**
   * 列状态配置修改触发事件
   *
   * @deprecated 请使用 columnsState.onChange 代替
   */
  onColumnsStateChange: Function as PropType<(map: Record<string, ColumnsState>) => void>,

  /** 列状态的配置，可以用来操作列功能 */
  columnsState: Object as PropType<ColumnsStateType>,

  onSizeChange: Function as PropType<(size: DensitySize) => void>,

  /**
   * table 外面卡片的设置
   */
  cardProps: {
    type: [Object, Boolean] as PropType<WithFalse<CardProps>>,
    default: undefined
  },

  /**
   * 渲染 table
   */
  tableRender: Function as PropType<
    (
      props: any,
      defaultDom: JSX.Element,
      /** 各个区域的 dom */
      domList: {
        toolbar: VueNode | undefined
        alert: VueNode | undefined
        table: VueNode | undefined
      }
    ) => VueNode
  >,

  /**
   * 渲染 table 视图，用于定制 ProList，不推荐直接使用
   */
  tableViewRender: Function as PropType<
    (props: TableProps<T>, defaultDom: JSX.Element) => JSX.Element | undefined
  >,

  /**
   * table 和搜索表单之间的 dom 渲染
   *
   * @example 在table 上方增加一个统计表单
   *
   * tableExtraRender={()=> <Statistic title="统计" value={10} />}
   */
  tableExtraRender: Function as PropType<(props: any, dataSource: T[]) => VueNode>,

  /** 一个获得 dataSource 的方法 */
  request: Function as PropType<TableRequest<U>>,

  /** 对数据进行一些处理 */
  postData: Function as PropType<(data: any[]) => any[]>,

  /** 默认的数据 */
  defaultData: Array as PropType<T[]>,

  /**
   * 初始化的参数，可以操作 table
   *
   * @example 重新刷新表格
   * actionRef.current?.reload();
   *
   * @example 重置表格
   * actionRef.current?.reset();
   */
  actionRef: Object as PropType<Ref<ActionType | undefined>>,

  /**
   * 操作自带的 form
   */
  // formRef: TableFormItem<T>['formRef']

  /**
   * 渲染操作栏
   */
  toolBarRender: {
    type: [Function, Boolean] as PropType<ToolBarProps<T>['toolBarRender'] | false>,
    default: undefined
  },

  /**
   * 数据加载完成后触发
   */
  onLoad: Function as PropType<(dataSource: T[]) => void>,

  /**
   * loading 被修改时触发，一般是网络请求导致的
   */
  onLoadingChange: Function as PropType<(loading: boolean | SpinProps | undefined) => void>,

  /**
   * 数据加载失败时触发
   */
  onRequestError: Function as PropType<(e: Error) => void>,

  /**
   * 是否轮询 ProTable 它不会自动提交表单，如果你想自动提交表单的功能，需要在 onValueChange 中调用 formRef.current?.submit()
   *
   * @param dataSource 返回当前的表单数据，你可以用它判断要不要打开轮询
   */
  polling: [Number, Function] as PropType<number | ((dataSource: T[]) => number)>,

  /** 给封装的 table 的 className */
  tableClassName: String,

  /** 给封装的 table 的 style */
  tableStyle: Object as PropType<CSSProperties>,

  /** 左上角的 title */
  headerTitle: VueNodeOrRenderPropType as PropType<VueNodeOrRender>,

  /** 标题旁边的 tooltip */
  tooltip: [String, Object] as PropType<string | LabelTooltipType>,

  /** 操作栏配置 */
  options: { type: [Object, Boolean] as PropType<WithFalse<OptionConfig>>, default: undefined },

  /**
   * @type SearchConfig
   * 是否显示搜索表单
   */
  search: {
    type: [Object, Boolean] as PropType<WithFalse<SearchConfig>>,
    default: undefined
  },

  /**
   * 基本配置与 antd Form 相同, 但是劫持了 form onFinish 的配置
   *
   * type="form" 和 搜索表单 的 Form 配置
   */
  // form?: Omit<ProFormProps & QueryFilterProps, 'form'>

  /**
   * TODO, 使用 dayjs
   *
   * 暂时只支持 moment - string 会格式化为 YYYY-DD-MM - number 代表时间戳
   * 如何格式化日期
   */
  //   dateFormatter?:
  // | 'string'
  // | 'number'
  // | ((value: moment.Moment, valueType: string) => string | number)
  // | false

  /** 格式化搜索表单提交数据 */
  beforeSearchSubmit: Function as PropType<(params: Partial<U>) => any>,

  /**
   * 设置或者返回false 即可关闭
   *
   * 自定义 table 的 alert
   */
  tableAlertRender: {
    type: [Object, Boolean] as PropType<AlertRenderType<T>>,
    default: undefined
  },

  /**
   * 设置或者返回false 即可关闭
   *
   * 自定义 table 的 alert 的操作
   */
  tableAlertOptionRender: {
    type: [Object, Boolean] as PropType<AlertRenderType<T>>,
    default: undefined
  },

  /** 选择项配置 */
  rowSelection: {
    type: [Object, Boolean] as PropType<
      | (TableProps<T>['rowSelection'] & {
          alwaysShowAlert?: boolean
        })
      | false
    >,
    default: false
  },

  /** 支持 ProTable 的类型 */
  // type: ProSchemaComponentTypes

  /** 提交表单时触发 */
  onSubmit: Function as PropType<(params: U) => void>,

  /** 重置表单时触发 */
  onReset: Function as PropType<() => void>,

  /** 空值时显示 */
  // columnEmptyText: ProFieldEmptyText

  /** 是否手动触发请求 */
  manualRequest: { type: Boolean, default: false },

  /**
   * 编辑行相关的配置
   *
   * @example 支持多行编辑
   * editable={{type:"multiple"}}
   *
   * @example 保存的时候请求后端
   * editable={{ onSave:async (rows)=>{ await save(rows) } }}
   */
  // editable?: RowEditableConfig<T>

  /**
   * 可编辑表格修改数据的改变
   */
  onDataSourceChange: {
    type: Function as PropType<(dataSource: T[]) => void>,
    default: undefined
  },

  /** 查询表单和 Table 的卡片 border 配置 */
  cardBordered: {
    type: [Boolean, Object] as PropType<Bordered>,
    default: undefined
  },

  /** 去抖时间 */
  debounceTime: { type: Number, default: 10 },

  /**
   * 只在request 存在的时候生效，可编辑表格也不会生效
   *
   * @default true
   * 窗口聚焦时自动重新请求
   */
  revalidateOnFocus: { type: Boolean, default: false },

  /** 默认的表格大小 */
  defaultSize: String as PropType<SizeType>

  /**
   * @name, 可编辑表格的name,通过这个name 可以直接与 form通信，无需嵌套
   */
  // name?: NamePath

  /**
   * 错误边界自定义
   */
  //ErrorBoundary: any
})

export type ProTableProps = Partial<ExtractPropTypes<ReturnType<typeof proTableProps>>>

export type ActionType = ProCoreActionType & {
  fullScreen?: () => void
  setPageInfo?: (page: Partial<PageInfo>) => void
}

export type UseFetchProps = {
  dataSource?: any
  loading: Ref<UseFetchDataAction['loading']>
  onLoadingChange?: (loading: UseFetchDataAction['loading']) => void
  onLoad?: (dataSource: any[], extra: any) => void
  onDataSourceChange?: (dataSource?: any) => void
  postData: any
  pageInfo:
    | {
        current?: number
        pageSize?: number
        defaultCurrent?: number
        defaultPageSize?: number
      }
    | false
  onPageInfoChange?: (pageInfo: PageInfo) => void
  effects?: ComputedRef<any[]>
  onRequestError?: (e: Error) => void
  manual: boolean
  debounceTime?: number
  polling?: number | ((dataSource: any[]) => number)
  revalidateOnFocus?: boolean
}

export type OptionSearchProps = Omit<SearchProps, 'onSearch'> & {
  /** 如果 onSearch 返回一个false，直接拦截请求 */
  onSearch?: (keyword: string) => boolean | undefined
}
