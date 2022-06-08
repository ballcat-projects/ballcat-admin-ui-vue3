import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export const useMultiTabStore = defineStore('multiTabStore', {
  // 其他配置...
  state: () => ({
    contentLoading: false,
    cachedComponentNames: new Set<string>(),
    routeList: [] as RouteLocationNormalizedLoaded[]
  })
})
