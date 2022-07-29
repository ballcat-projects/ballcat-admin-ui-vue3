import type { PageInfo, RequestData, UseFetchProps, UseFetchDataAction } from './typing'
import { postDataPipeline } from './utils'
import { watchEffect, ref } from 'vue'
import type { ComputedRef } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import index from '../utils/hooks/useMergedState'
import { runFunction } from '#/utils/runFunction'

/**
 * 组合用户的配置和默认值
 *
 * @param param0
 */
const mergeOptionAndPageInfo = ({ pageInfo }: UseFetchProps): PageInfo => {
  if (pageInfo) {
    const { current, defaultCurrent, pageSize, defaultPageSize } = pageInfo
    return {
      current: current || defaultCurrent || 1,
      total: 0,
      pageSize: pageSize || defaultPageSize || 10
    }
  }
  return { current: 1, total: 0, pageSize: 10 }
}

const useFetchData = <T extends RequestData<any>>(
  getData: undefined | ((params?: { size: number; current: number }) => Promise<T>),
  defaultData: any[] | undefined,
  options: UseFetchProps
): ComputedRef<UseFetchDataAction> => {
  const umountRef = ref<boolean>(false)

  /** 是否首次加载的指示器 */
  const manualRequestRef = ref<boolean>(options.manual)

  /** 轮询的setTime ID 存储 */
  const pollingSetTimeRef = ref<any>()

  const [list, setList] = index<any[] | undefined>(ref(options?.dataSource), {
    defaultValue: defaultData,
    onChange: options?.onDataSourceChange
  })

  // 表格加载状态
  const setTableLoading = (loading: UseFetchDataAction['loading']) => {
    options.loading.value = loading
    options.onLoadingChange?.(loading)
  }

  const requesting = ref(false)

  const pageInfo = ref()
  watchEffect(() => {
    pageInfo.value = mergeOptionAndPageInfo(options)
  })
  const setPageInfo = (changePageInfo: PageInfo) => {
    pageInfo.value = changePageInfo
    options?.onPageInfoChange
  }

  const pollingLoading = ref(false)
  const setPollingLoading = (value: boolean) => (pollingLoading.value = value)

  // Batching update  https://github.com/facebook/react/issues/14259
  const setDataAndLoading = (newData: T[], dataTotal: number) => {
    setList(newData)

    if (pageInfo.value?.total !== dataTotal) {
      setPageInfo({
        ...pageInfo.value,
        total: dataTotal || newData.length
      })
    }
  }

  /**
   * 不这样做会导致状态不更新
   *
   * https://github.com/ant-design/pro-components/issues/4390
   */
  const requestFinally = () => {
    requestAnimationFrame(() => {
      setTableLoading(false)
      setPollingLoading(false)
    })
  }

  // 需要重新请求数据，删除当前页最后一条数据后，自动向前翻页
  let requestPrePage = false

  /** 请求数据 */
  const fetchList = async (isPolling: boolean) => {
    if ((!requestPrePage && (options.loading.value || requesting.value)) || !getData) {
      return []
    }

    // 需要手动触发的首次请求
    if (manualRequestRef.value) {
      manualRequestRef.value = false
      return []
    }
    if (!isPolling) {
      setTableLoading(true)
    } else {
      setPollingLoading(true)
    }

    requesting.value = true
    const { pageSize, current } = pageInfo.value || {}
    try {
      const pageParams =
        options?.pageInfo !== false
          ? {
              current,
              size: pageSize
            }
          : undefined

      const result = await getData(pageParams)
      const { records = [], total = 0, ...rest } = result?.data || {}

      // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
      if (records.length === 0 && current > 1) {
        requestPrePage = true
        setPageInfo({
          ...pageInfo.value,
          current: current - 1
        })
        return []
      } else {
        requestPrePage = false
      }

      const responseData = postDataPipeline<T[]>(
        records!,
        [options.postData].filter(item => item) as any
      )
      setDataAndLoading(responseData, total)
      options.onLoad?.(responseData, rest)
      return responseData
    } catch (e) {
      // 如果没有传递这个方法的话，需要把错误抛出去，以免吞掉错误
      if (options.onRequestError === undefined) throw new Error(e as string)
      if (list === undefined) setList([])
      options.onRequestError(e as Error)
    } finally {
      // 如果需要重新请求，这里状态就不变更了
      if (!requestPrePage) {
        requesting.value = false
        requestFinally()
      }
    }

    return []
  }

  const fetchListDebounce = useDebounceFn(async (isPolling: boolean) => {
    if (pollingSetTimeRef.value) {
      clearTimeout(pollingSetTimeRef.value)
    }
    const msg = await fetchList(isPolling)

    // 把判断要不要轮询的逻辑放到后面来这样可以保证数据是根据当前来
    // 放到请求前面会导致数据是上一次的
    const needPolling = runFunction(options.polling, msg)

    // 如果需要轮询，搞个一段时间后执行
    // 如果解除了挂载，删除一下
    if (needPolling && !umountRef.value) {
      pollingSetTimeRef.value = setTimeout(() => {
        fetchListDebounce(needPolling)
        // 这里判断最小要2000ms，不然一直loading
      }, Math.max(needPolling, 2000))
    }
    return msg
  }, options.debounceTime || 10)

  // 如果轮询结束了，直接销毁定时器
  watchEffect(() => {
    if (!options.polling) {
      clearTimeout(pollingSetTimeRef.value)
    }
    if (options.polling) {
      fetchListDebounce(true)
    }
  })
  // onUnmounted(() => clearTimeout(pollingSetTimeRef.value))
  //
  // onMounted(() => (umountRef.value = false))
  // onUnmounted(() => (umountRef.value = true))

  /** PageIndex 改变的时候自动刷新 */
  watch(
    () => pageInfo.value,
    (currentPageInfo, prePageInfo) => {
      console.log('页码改变了')
      const { current, pageSize } = pageInfo.value || {}
      const { current: prePage, pageSize: prePageSize } = prePageInfo || {}
      // 如果上次的页码为空或者两次页码等于是没必要查询的
      // 如果 pageSize 发生变化是需要查询的，所以又加了 prePageSize
      if (prePage && prePage === current && prePageSize && prePageSize === pageSize) {
        return
      }

      if ((options.pageInfo && list.value && list.value?.length > pageSize) || 0) {
        return
      }

      // 如果 list 的长度大于 pageSize 的长度
      // 说明是一个假分页
      // (pageIndex - 1 || 1) 至少要第一页
      // 在第一页大于 10
      // 第二页也应该是大于 10
      // if (current !== undefined && list.value && list.value.length <= pageSize) {
      //   fetchListDebounce(false)
      // }

      fetchListDebounce(false)
    },
    { immediate: true }
  )

  watch(
    () => options.effects?.value || [],
    () => {
      fetchListDebounce(false)
      if (!options.manual) {
        manualRequestRef.value = false
      }
    }
  )

  return computed(() => ({
    dataSource: list.value!,
    setDataSource: setList,
    loading: options.loading.value,
    reload: async () => {
      await fetchListDebounce(false)
    },
    pageInfo: pageInfo.value,
    pollingLoading: pollingLoading.value,
    reset: async () => {
      const { pageInfo: optionPageInfo } = options || {}
      const { defaultCurrent = 1, defaultPageSize = 10 } = optionPageInfo || {}
      const initialPageInfo = {
        current: defaultCurrent,
        total: 0,
        pageSize: defaultPageSize
      }
      setPageInfo(initialPageInfo)
    },
    setPageInfo: async info => {
      setPageInfo({
        ...pageInfo.value,
        ...info
      })
    }
  }))
}

export default useFetchData
