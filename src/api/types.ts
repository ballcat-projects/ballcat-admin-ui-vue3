/**
 * 服务端统一返回信息
 */
export interface ApiResult<T = unknown> {
  // 状态码
  code: number
  // 数据
  data: T
  // 信息
  message: string
}

/**
 * 分页查询参数
 */
export interface PageParam {
  // 当前页码
  current?: number
  // 每页显示条数
  size?: number
  // 排序规则
  sort?: string
  // 其他额外属性
  [key: string]: any
}

/**
 * 分页返回结果
 */
export interface PageResult<T> {
  // 分页数据
  records: T[]
  // 数据总量
  total: number
}

/**
 * 下拉框数据
 */
export interface SelectData<T = unknown> {
  // 显示名称
  name: string
  // 选中值
  value: string
  // 默认是否被选中
  selected?: boolean
  // 是否被禁用
  disabled?: boolean
  // 类型，可分组
  type?: string
  // 扩展对象
  extendObj?: T
}

/**
 * 导入模式
 */
export enum ImportMode {
  // 跳过已有数据
  SKIP_EXISTING = 'SKIP_EXISTING',
  // 覆盖已有数据
  OVERWRITE_EXISTING = 'OVERWRITE_EXISTING'
}
