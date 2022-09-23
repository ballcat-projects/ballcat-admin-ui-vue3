import type { PageParam } from '@/api/types'

/**
 * 系统角色查询对象
 */
export interface SysRoleQO {
  // 角色名称
  name?: string
  // 角色标识
  code?: string
  // 开始时间
  startTime?: string
  // 结束时间
  endTime?: string
}

/**
 * 系统角色分页参数
 */
export type SysRolePageParam = SysRoleQO & PageParam

/**
 * 系统角色
 */
export interface SysRole {
  // 角色编号
  id?: number
  // 角色名称
  name: string
  // 角色标识
  code: string
  // 角色类型
  type: number
  // 数据权限
  scopeType: number
  // 数据范围资源，当数据权限为自定义时使用
  scopeResources?: string
  // 备注
  remarks?: string
}

/**
 * 角色分页视图对象
 */
export interface SysRolePageVO extends SysRole {
  id: number
  // 创建时间
  createTime: string
  // 修改时间
  updateTime: string
}

/**
 * 角色新建修改的传输对象
 */
export type SysRoleDTO = SysRole

/**
 * 角色绑定用户的查询对象
 */
export interface SysRoleUserQO {
  // 角色标识
  roleCode: string
  // 用户ID
  userId?: number
  // 用户名
  username?: string
  // 组织ID
  organizationId?: number
}

/**
 * 系统角色已绑用户分页参数
 */
export type SysRoleUserPageParam = SysRoleUserQO & PageParam

export interface SysRoleUserVO {
  // 用户ID
  userId: number
  // 登录账号
  username: string
  // 昵称
  nickname: string
  // 1:系统用户， 2：客户用户
  type: number
  // 组织机构ID
  organizationId: number
  // 组织机构名称
  organizationName: string
}
