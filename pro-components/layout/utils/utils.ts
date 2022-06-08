import type { MenuDataItem } from '../types'

const themeConfig = {
  daybreak: '#1890ff',
  dust: '#F5222D',
  volcano: '#FA541C',
  sunset: '#FAAD14',
  cyan: '#13C2C2',
  green: '#52C41A',
  geekblue: '#2F54EB',
  purple: '#722ED1'
}

/**
 * Daybreak-> #1890ff
 *
 * @param val
 */
export function genStringToTheme(val?: string): string {
  // @ts-ignore
  return val && themeConfig[val] ? themeConfig[val] : val
}

export function clearMenuItem(menusData: MenuDataItem[]): MenuDataItem[] {
  return menusData
    .map(item => {
      const children: MenuDataItem[] = item.children || []
      const finalItem = { ...item }

      if (!finalItem.name || finalItem.hideInMenu) {
        return null
      }

      if (finalItem && finalItem?.children) {
        if (
          !finalItem.hideChildrenInMenu &&
          children.some(child => child && child.name && !child.hideInMenu)
        ) {
          return {
            ...item,
            children: clearMenuItem(children)
          }
        }
        // children 为空就直接删掉
        delete finalItem.children
      }
      return finalItem
    })
    .filter(item => item) as MenuDataItem[]
}
