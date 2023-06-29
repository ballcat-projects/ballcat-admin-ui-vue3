import { useDictStore } from '@/stores/dict-store'
import type { DictItem, DictValue } from '@/api/system/dict/types'
import { DictItemStatus, DictValueTypeEnum } from '@/api/system/dict/types'
import type { DictComponentProps, DictDisplayComponentProps } from '@/components/Dict/types'

// 默认的 item 是否禁用的判断器
const defaultItemDisabledChecker = (dictItem: DictItem) =>
  dictItem.status !== DictItemStatus.ENABLED

export const useDict = (props: DictComponentProps) => {
  const { dictDataCache, getDictData } = useDictStore()

  // 先尝试初始化
  watch(
    () => props.dictCode,
    dictCode => getDictData(dictCode),
    { immediate: true }
  )

  return computed(() => {
    const dictData = dictDataCache[props.dictCode]
    if (!dictData) return [] as DictItem[]

    const result: DictItem[] = []

    const dictItemVOs = dictData.dictItems
    for (const item of dictItemVOs) {
      const dictItem = Object.assign({}, item) as DictItem

      // 转换字典项的值为其真实类型
      dictItem.value = convertValueType(item.value, dictData.valueType)

      // 过滤字典项
      if (props.itemFilter && !props.itemFilter(dictItem)) {
        continue
      }

      // 选择名称，国际化处理
      // dictItem.name = props.i18nName(dictItem)

      // 字典项是否 disable
      const itemDisabledChecker = props.itemDisabledChecker || defaultItemDisabledChecker
      dictItem.disabled = itemDisabledChecker(dictItem)

      // 添加字典项
      result.push(dictItem)
    }
    return result
  })
}

export const useDictDisplay = (props: DictDisplayComponentProps) => {
  const dictItems = useDict(props)

  // 当前展示的 dictItem
  const dictItem = computed(() => dictItems.value.find(dictItem => dictItem.value === props.value))

  // 显示的文本
  const showText = computed(() => dictItem.value?.name || dictItem.value?.value)

  return {
    dictItems,
    dictItem,
    showText
  }
}

/**
 * 服务端返回的都是 String 类型，需转换为真实类型
 * @param value 值
 * @param valueType 值类型
 * @returns {number | boolean | string}
 */
function convertValueType(value: string, valueType: DictValueTypeEnum): DictValue {
  // 如果没有type， 按number 处理
  valueType = valueType || DictValueTypeEnum.NUMBER
  // 数字
  if (valueType === DictValueTypeEnum.NUMBER) {
    return Number(value)
  }
  // 字符串
  else if (valueType === DictValueTypeEnum.STRING) {
    return String(value)
  }
  // 布尔
  else if (valueType === DictValueTypeEnum.BOOLEAN) {
    if (!value) {
      return false
    }
    value = value.toLowerCase()
    if (['0', 'false', 'n', 'no'].includes(value)) {
      return false
    } else if (['1', 'true', 'y', 'yes', 'ok'].includes(value)) {
      return true
    } else {
      const number = Number(value)
      if (!Number.isNaN(number)) {
        // 大于0 为 true
        return number > 0
      }

      return Boolean(value)
    }
  }
}
