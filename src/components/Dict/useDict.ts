import { useDictStore } from '@/stores/dict-store'
import type { DictValue, DictItem } from '@/api/system/dict/types'
import type { DictComponentProps, DictDisplayComponentProps } from '@/components/Dict/types'
import { DictItemStatus, DictValueTypeEnum } from '@/api/system/dict/types'

// 默认的 item 是否禁用的判断器
const defaultItemDisabledChecker = (dictItem: DictItem) =>
  dictItem.status !== DictItemStatus.ENABLED

export const useDict = (props: DictComponentProps) => {
  const dictStore = useDictStore()

  const dictItems = ref<DictItem[]>([])

  watch(props,(newVal,oldVal) => {
    dictStore.getDictData(newVal.dictCode).then(dictData => {
      if (!dictData) return

      const result = []

      const dictItemVOs = dictData.dictItems
      for (const item of dictItemVOs) {
        const dictItem = item as unknown as DictItem

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

      dictItems.value = result
    })
  },
  { immediate: true }
  )

  return dictItems
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
  let res = value as DictValue
  // 如果没有type， 按number 处理
  valueType = valueType || DictValueTypeEnum.NUMBER
  if (valueType === DictValueTypeEnum.NUMBER) {
    res = Number(value) // 数字
  } else if (valueType === DictValueTypeEnum.STRING) {
    res = String(value) // 字符串
  } else if (valueType === DictValueTypeEnum.BOOLEAN) {
    // 布尔
    // 字符串 ”false“ 也会被转换为 true，所以要额外判断下
    // 参看 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean
    const b = Boolean(value)
    res = b && value.toLowerCase() === 'false' ? false : b
  }
  return res
}
