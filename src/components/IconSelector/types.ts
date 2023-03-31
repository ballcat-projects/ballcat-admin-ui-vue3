/**
 * 增加新的图标时，请遵循以下数据结构
 * Adding new icon please follow the data structure below
 */
export type Icon = string
export interface IconGroup {
  key: string
  title: string
  icons: Icon[]
}
