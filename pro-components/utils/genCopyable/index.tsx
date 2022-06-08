import { Typography } from 'ant-design-vue'
import type { VueNode } from '#/types'

const isNeedTranText = (item: any): boolean => {
  if (item?.valueType?.toString().startsWith('date')) {
    return true
  }
  if (item?.valueType === 'select' || item?.valueEnum) {
    return true
  }
  return false
}

/**
 * 生成 Copyable 或 Ellipsis 的 dom
 *
 * @param dom
 * @param item
 * @param text
 */
export const genCopyable = (dom: VueNode, item: any, text: string) => {
  if (item.copyable || item.ellipsis) {
    const copyable =
      item.copyable && text
        ? {
            text,
            tooltips: ['', '']
          }
        : undefined

    /** 有些 valueType 需要设置copy的为string */
    const needTranText = isNeedTranText(item)

    const ellipsis =
      item.ellipsis && text
        ? {
            tooltip: needTranText ? <div class="pro-table-tooltip-text">{dom}</div> : text
          }
        : false
    return (
      <Typography.Text
        // @ts-ignore
        style={{
          width: '100%',
          margin: '0px',
          padding: '0px'
        }}
        title=""
        copyable={copyable}
        ellipsis={ellipsis}
      >
        {dom}
      </Typography.Text>
    )
  }
  return dom
}
