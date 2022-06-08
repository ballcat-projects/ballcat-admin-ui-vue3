// 项目名
export const PROJECT_TITLE = 'Ballcat Admin'

// Local Storage/ Session Storage 的 key 前缀 prefix
export const STORAGE_KEY_PREFIX = 'ballcat-admin/'

// 路由布局的组件名称
export const ROUTER_LAYOUT_NAME = 'RouterLayout'

// 刷新时占位的空组件名
export const EMPTY_NODE_NAME = '_EmptyNode'

// 重定向的路由路径
export const REDIRECT_PATH = '/redirect'

// 登录页的地址
export const LOGIN_PATH = '/login'

// 表单行为类型，标识当前表单是用来新建的还是更新的
export const enum FormAction {
  NONE = 'none',
  CREATE = 'create',
  UPDATE = 'update'
}
