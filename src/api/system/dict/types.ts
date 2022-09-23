import type { PresetColorType, PresetStatusColorType } from 'ant-design-vue/es/_util/colors'
import type { PageParam } from '@/api/types'

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
 * 字典项状态枚举
 */
export enum DictItemStatus {
  ENABLED = 1,
  DISABLED = 0
}

/** 字典的 Hash 存储, key 为 dictCode, value 为 hash值 */
export type DictHashData = Record<string, string>

/**
 * 系统字典查询对象
 */
export interface SysDictQO {
  // 字典标识
  code?: string
  // 字典名称
  title?: string
}

/**
 * 系统字典分页参数
 */
export type SysDictPageParam = SysDictQO & PageParam

/**
 * 系统字典
 */
interface SysDictBase {
  // 字典编号
  id?: number
  // 字典标识
  code: string
  // 字典名称
  title: string
  // Hash值
  hashCode?: number
  // 数据类型
  valueType: DictValueTypeEnum
  // 备注
  remarks?: string
}

/**
 * 系统字典分页视图对象
 */
export interface SysDictPageVO extends SysDictBase {
  id: number
  // 创建时间
  createTime: string
  // 修改时间
  updateTime: string
}

/**
 * 系统字典传输对象
 */
export type SysDictDTO = SysDictBase

/**
 * 系统字典项查询对象
 */
export interface SysDictItemQO {
  // 字典标识
  dictCode: string
}

/**
 * 系统字典项分页参数
 */
export type SysDictItemPageParam = SysDictItemQO & PageParam

/**
 * 字典项基础属性
 */
interface SysDictItemBase {
  id?: number
  // 字典标识
  dictCode: string
  // 数据值
  value: string
  // 文本值
  name: string
  // 状态
  status: DictItemStatus
  // 附加属性值
  attributes?: DictItemAttributes
  // 排序
  sort: number
  // 备注
  remarks?: string
}

/**
 * 字典项分页视图对象，服务端返回
 */
export interface SysDictItemPageVO {
  id: number
  createTime?: string
  updateTime?: string
}

/**
 * 系统字典项传输对象
 */
export type SysDictItemDTO = SysDictItemBase

/**
 * 字典项属性
 */
export interface DictItemAttributes extends Record<string, any> {
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
  status: DictItemStatus
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
