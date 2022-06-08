import { createInjectionState } from '@vueuse/shared'
import { computed, ref, toRef, watch, watchEffect } from 'vue'
import type { TableColumnType } from 'ant-design-vue'
import type { DensitySize } from './components/ToolBar/DensityIcon'
import type { ActionType, ProTableProps } from './typing'
import index from '../utils/hooks/useMergedState'
import { genColumnKey } from './utils'
import type { VueKey } from '#/types'

export type ColumnsState = {
  show?: boolean
  fixed?: 'right' | 'left' | undefined
  order?: number
  disable?:
    | boolean
    | {
        checkbox: boolean
      }
}

export type ProTableColumn<T> = ColumnsState & TableColumnType<T>

export type UseContainerProps<T = any> = {
  onColumnsStateChange?: (map: Record<string, ColumnsState>) => void
  size?: DensitySize
  defaultSize?: DensitySize
  onSizeChange?: (size: DensitySize) => void
  columns?: ProTableColumn<T>[]
  columnsState?: ProTableProps['columnsState']
}

const createContainer = (props: UseContainerProps = {}) => {
  const actionRef = ref<ActionType>()
  const rootDomRef = ref<HTMLDivElement>()
  /** 父 form item 的 name */
  const prefixNameRef = ref<any>()

  /** 自己 props 的引用 */
  const propsRef = ref<ProTableProps>()

  /** 可编辑表格的formRef */
  // const editableFormRef = ref<ProFormInstance<any>>()

  // 共享状态比较难，就放到这里了
  const keyWords = ref<string | undefined>('')
  // 用于排序的数组
  const sortKeyColumns = ref<string[]>([])

  const propsSize = toRef(props, 'size')
  const [tableSize, setTableSize] = index<DensitySize>(propsSize, {
    defaultValue: props.size || props.defaultSize || 'middle',
    onChange: props.onSizeChange
  })

  /** 默认全选中 */
  const defaultColumnKeyMap = computed(() => {
    const columnKeyMap = {}
    props.columns?.forEach(({ key, dataIndex, fixed, disable }, index) => {
      const columnKey = genColumnKey(key ?? (dataIndex as VueKey), index)
      if (columnKey) {
        // @ts-ignore
        columnKeyMap[columnKey] = {
          show: true,
          fixed,
          disable
        }
      }
    })
    return columnKeyMap
  })

  const getColumnsMap = () => {
    const { persistenceType, persistenceKey } = props.columnsState || {}

    if (persistenceKey && persistenceType && typeof window !== 'undefined') {
      /** 从持久化中读取数据 */
      const storage = window[persistenceType]
      try {
        const storageValue = storage?.getItem(persistenceKey)
        if (storageValue) {
          return JSON.parse(storageValue)
        }
      } catch (error) {
        console.warn(error)
      }
    }

    return (
      props.columnsState?.value || props.columnsState?.defaultValue || defaultColumnKeyMap.value
    )
  }
  const columnsMap = ref(getColumnsMap())

  const clearPersistenceStorage = () => {
    /** 清空一下当前的 key */
    const { persistenceType, persistenceKey } = props.columnsState || {}

    if (!persistenceKey || !persistenceType || typeof window === 'undefined') return

    /** 给持久化中设置数据 */
    const storage = window[persistenceType]
    try {
      storage?.removeItem(persistenceKey)
    } catch (error) {
      console.error(error)
    }
  }

  watch(
    () => columnsMap.value,
    value => {
      const onChange = props.columnsState?.onChange || props.onColumnsStateChange
      onChange?.(value)
      clearPersistenceStorage()
    }
  )

  watchEffect(() => {
    if (!props.columnsState?.persistenceKey || !props.columnsState?.persistenceType) {
      return
    }
    if (typeof window === 'undefined') return
    /** 给持久化中设置数据 */
    const { persistenceType, persistenceKey } = props.columnsState
    const storage = window[persistenceType]
    try {
      storage?.setItem(persistenceKey, JSON.stringify(columnsMap.value))
    } catch (error) {
      console.error(error)
    }
  })

  const renderValue = {
    actionRef: actionRef,
    setAction: (newAction?: ActionType) => {
      actionRef.value = newAction
    },
    sortKeyColumns,
    setSortKeyColumns: (keys: string[]) => {
      sortKeyColumns.value = keys
    },
    propsRef: propsRef,
    columnsMap,
    setColumnsMap: (newColumnsMap: Record<string, ColumnsState>) => {
      columnsMap.value = newColumnsMap
    },
    keyWords: keyWords,
    setKeyWords: (k: string | undefined) => (keyWords.value = k),
    setTableSize,
    tableSize: tableSize,
    prefixName: prefixNameRef,
    setPrefixName: (name: any) => {
      prefixNameRef.value = name
    },
    // setEditorTableForm: (form: ProFormInstance<any>) => {
    //   editableFormRef.current = form
    // },
    // editableForm: editableFormRef.current,
    columns: props.columns,
    rootDomRef,
    clearPersistenceStorage
  }

  return renderValue
}

export type CounterType = ReturnType<typeof createContainer>

const [useProvideContainer, useContainer] = createInjectionState(createContainer)

export { useProvideContainer }
// If you want to hide `useCounterStore` and wrap it in default value logic or throw error logic, please don't export `useCounterStore`
export { useContainer }
