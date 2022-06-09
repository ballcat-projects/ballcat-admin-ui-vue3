/**
 * 数组转树形结构
 * @param list 源数组
 * @param parentId 父ID
 * @param attributeFill 数据处理函数
 */
export declare type Key = string | number

interface ListToTreeOptions<T> {
  /**
   * id字段名称
   */
  idKey?: string | null
  /**
   * parentId字段名称
   */
  parentIdKey?: string | null
  /**
   * 生成的children字段名称
   */
  childrenKey?: string | null
  /**
   * 属性转换的方法
   * @param treeNode 树节点对象
   */
  attributeMapping?: (treeNode: T) => void
}

export const listToTree = <T = any>(
  list: T[],
  parentId: Key,
  options: ListToTreeOptions<T> = {
    idKey: 'id',
    parentIdKey: 'parentId',
    childrenKey: 'children'
  }
) => {
  const tree: T[] = []
  fillTree<T>(list, tree, parentId, options)
  return tree
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 * @param options 转换选项
 * TODO 优化，支持类型转换
 */
export const fillTree = <T = any>(
  list: T[],
  tree: T[],
  parentId: Key,
  options: ListToTreeOptions<T>
) => {
  const idField = options.idKey || 'id'
  const parentIdField = options.parentIdKey || 'parentId'
  const childrenField = options.childrenKey || 'children'
  const attributeMapping = options.attributeMapping

  list.forEach(item => {
    const data = item as any

    // 判断是否为父级菜单
    if (data[parentIdField] === parentId) {
      const treeNode = {
        ...data,
        ['key']: data.key || data[idField],
        [childrenField]: [] as T[]
      }

      // 额外的数据转换处理
      if (attributeMapping && typeof attributeMapping === 'function') {
        attributeMapping(treeNode)
      }

      // 迭代 list， 找到当前菜单相符合的所有子菜单
      fillTree(list, treeNode[childrenField], data[idField], options)
      // 删掉不存在 children 值的属性
      if (treeNode[childrenField] && (treeNode[childrenField] as T[]).length <= 0) {
        delete treeNode[childrenField]
      }
      // 加入到树中
      tree.push(treeNode)
    }
  })
}

/**
 * 根据指定规则进行剪枝
 * @param treeList
 * @param matcher
 * @returns {*[]}
 */
export function pruneTree<T extends { children?: T[] }>(
  treeList: T[],
  matcher: (node: T) => boolean
) {
  const result: T[] = []
  if (treeList) {
    for (const treeNode of treeList) {
      // @ts-ignore
      const children = pruneTree(treeNode.children, matcher)
      if (children && children.length > 0) {
        treeNode.children = children
        result.push(treeNode)
      } else if (matcher(treeNode)) {
        treeNode.children = []
        result.push(treeNode)
      }
    }
  }
  return result
}

export interface TreeNode {
  id: Key
  children: TreeNode[]
}

/**
 * 获取匹配节点的所有祖先节点 id
 * @param treeList 树节点集合
 * @param matcher 匹配器
 * @returns 祖先节点 id 集合
 */
export const matchedParentKeys = <T = TreeNode>(treeList: T[], matcher: (node: T) => boolean) => {
  const result: Key[] = []
  fillMatchedParentKeys<T>(treeList, matcher, result)
  return result
}

/**
 * 获取匹配节点的所有祖先节点 id
 * @param treeList 树节点集合
 * @param matcher 匹配器
 * @param result 返回值
 * @returns {boolean}
 */
export function fillMatchedParentKeys<T = any>(
  treeList: any[],
  matcher: (node: T) => boolean,
  result: Key[]
) {
  if (!treeList || treeList.length === 0) {
    return false
  }
  let matched = false
  for (const node of treeList) {
    // 如果孩子节点有匹配，则把自己的 id 加入返回值
    if (fillMatchedParentKeys(node.children, matcher, result)) {
      matched = true
      result.push(node.id)
    }
    // 如果当前节点匹配了，matched 修改为 true
    if (matcher(node)) {
      matched = true
    }
  }
  return matched
}
