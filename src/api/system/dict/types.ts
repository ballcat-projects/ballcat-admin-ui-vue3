import type { PresetColorType, PresetStatusColorType } from 'ant-design-vue/es/_util/colors'

/**
 * 字典值类型枚举
 */
export enum DictValueTypeEnum {
  NUMBER = 1,
  STRING,
  BOOLEAN
}

/**
 * 字典值
 */
export type DictValue = number | string | boolean

/**
 * 字典状态枚举
 */
export enum DictStatus {
  ENABLED = 1,
  DISABLED = 0
}

/**
 * 字典项属性
 */
interface DictItemAttributes extends Record<string, any> {
  languages?: Record<string, string>
  tagColor?: string
  textColor?: string
  badgeColor?: PresetColorType | string
  badgeStatus?: PresetStatusColorType
}

/**
 * 字典项视图对象，服务端返回
 */
export interface DictItemVO {
  id: number
  // 数据值
  value: string
  // 文本值
  name: string
  // 状态
  status: DictStatus
  // 附加属性值
  attributes?: DictItemAttributes
}

/**
 * 字典数据
 */
export interface DictDataVO {
  // 字典标识
  dictCode: string
  // 字典Hash值, 用来判断本地缓存是否过期
  hashCode: string
  // 字典值类型
  valueType: DictValueTypeEnum
  // 字典项列表
  dictItems: DictItemVO[]
}

/**
 * 字典项
 */
export interface DictItem extends Omit<DictItemVO, 'value'> {
  // value 会被转换为实际类型
  value: DictValue
  // 是否禁用
  disabled: boolean
}

/**
 * 字典数据
 */
export interface DictData extends Omit<DictDataVO, 'dictItems'> {
  // 字典项列表
  dictItems: DictItem[]
}

/** 字典的 Hash 存储, key 为 dictCode, value 为 hash值 */
export type DictHashData = Record<string, string>
