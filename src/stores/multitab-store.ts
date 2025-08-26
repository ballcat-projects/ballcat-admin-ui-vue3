import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export const useMultiTabStore = defineStore('multiTabStore', {
  // 其他配置...
  state: () => ({
    contentLoading: false,
    cachedComponentNames: new Set<string>(),
    // 新增：缓存引用计数 Map<缓存键, 引用次数>
    cacheRefCounts: new Map<string, number>(),
    routeList: [] as RouteLocationNormalizedLoaded[]
  }),

  getters: {
    // 从引用计数Map中获取当前有效的缓存组件名称
    includeComponentNames(): string[] {
      return Array.from(this.cacheRefCounts.keys()).filter(key => this.cacheRefCounts.get(key)! > 0)
    }
  },

  actions: {
    // 添加缓存引用
    addCachedComponent(componentName: string) {
      const currentCount = this.cacheRefCounts.get(componentName) || 0
      this.cacheRefCounts.set(componentName, currentCount + 1)

      // 同时维护旧的Set以保持兼容性
      this.cachedComponentNames.add(componentName)
    },

    // 移除缓存引用
    removeCachedComponent(componentName: string) {
      const currentCount = this.cacheRefCounts.get(componentName) || 0
      if (currentCount > 1) {
        // 还有其他引用，只减少计数
        this.cacheRefCounts.set(componentName, currentCount - 1)
      } else {
        // 没有其他引用，完全移除
        this.cacheRefCounts.delete(componentName)
        this.cachedComponentNames.delete(componentName)
      }
    },

    // 清空所有缓存
    clearAllCache() {
      this.cacheRefCounts.clear()
      this.cachedComponentNames.clear()
    }
  }
})
