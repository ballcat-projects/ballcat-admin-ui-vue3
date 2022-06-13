import type { PageParam } from '@/api/types'

/**
 * 系统配置查询对象
 */
export interface SysConfigQO {
  // 配置名称
  name?: string
  // 配置在缓存中的key名
  confKey?: string
  // 分类
  category?: string
}

/**
 * 系统配置分页参数
 */
export type SysConfigPageParam = SysConfigQO & PageParam

/**
 * 系统配置
 */
export interface SysConfig {
  // 主键
  id: number
  // 配置名称
  name: string
  // 配置在缓存中的key名
  confKey: string
  // 配置值
  confValue: string
  // 分类
  category: string
  // 备注
  remarks: string
}

/**
 * 系统配置分页视图对象
 */
export interface SysConfigPageVO extends SysConfig {
  // 创建时间
  createTime: string
  // 修改时间
  updateTime: string
}

/**
 * 系统配置传输对象
 */
export interface SysConfigDTO extends Omit<SysConfig, 'id'> {
  // 主键
  id?: number
}
