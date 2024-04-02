import './MultiTab.less'

import { Tabs, Dropdown, Menu } from 'ant-design-vue'
import 'ant-design-vue/es/tabs/style/index.less'
import 'ant-design-vue/es/dropdown/style/index.less'
import 'ant-design-vue/es/menu/style/index.less'

import NProgress from 'nprogress'
import '@/styles/nprogress.less'

import {
  ReloadOutlined,
  DownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  CompressOutlined,
  ExpandOutlined,
  LeftOutlined,
  RightOutlined
} from '@ant-design/icons-vue'
import { headerViewProps } from '#/layout/Header'
import type { CSSProperties } from 'vue'
import { useMultiTabStore } from '@/stores/multitab-store'
import type { Key } from 'ant-design-vue/es/_util/type'
import { hasClass } from '@/utils/dom-utils'
import type { MenuInfo } from 'ant-design-vue/lib/menu/src/interface'
import type { RouteLocationMatched } from 'vue-router'
import { enableI18n, routerLayoutName } from '@/config'
import { emitter } from '@/hooks/mitt'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const MultiTab = defineComponent({
  name: 'MultiTab',
  inheritAttrs: false,
  props: headerViewProps(),
  emits: ['fullscreenChange', 'reloadContent'],
  setup(props, { emit, attrs }) {
    const activeKey = ref('')
    const router = useRouter()
    const multiTabStore = useMultiTabStore()

    /** 添加缓存的组件：嵌套路由时，缓存匹配路由下的所有组件 */
    const addCachedComponentNames = (matchedRoutes: RouteLocationMatched[]) => {
      matchedRoutes.forEach(route => {
        const componentName = route.components?.default.name
        if (componentName && route.meta.keepAlive !== false) {
          multiTabStore.cachedComponentNames.add(componentName)
        }
      })
    }

    // 监听路由处理
    watch(
      () => router.currentRoute.value,
      () => {
        // 切换选中 tab
        const currentRoute = router.currentRoute.value
        activeKey.value = currentRoute.path

        // 更新当前的 tab 列表
        const routeList = multiTabStore.routeList
        const index = routeList.findIndex(route => route.path === currentRoute.path)
        if (index < 0) {
          // @ts-ignore
          currentRoute.meta.hideInTab !== true && routeList.push(currentRoute)
        } else {
          const oldPage = routeList[index]
          if (currentRoute.params) {
            if (oldPage.params !== currentRoute.params) {
              routeList.splice(index, 1, currentRoute)
            }
          }
        }

        // 更新缓存的组件
        addCachedComponentNames(currentRoute.matched)
      },
      { immediate: true }
    )

    /** 点击事件 */
    const handleTabClick = (path: Key) => {
      const routeList = multiTabStore.routeList
      const index = routeList.findIndex(route => route.path === path)
      if (index < 0) {
        return
      }
      const route = routeList[index]
      router.push(route.fullPath)
    }

    /** 修改事件(删除当前) */
    const handleTabEdit = (
      targetKey: MouseEvent | Key | KeyboardEvent,
      action: 'add' | 'remove'
    ) => {
      if (action === 'remove') {
        // 查找对应的 routeIndex
        const routeList = multiTabStore.routeList
        const index = routeList.findIndex(route => route.path === targetKey)
        if (index < 0) {
          return
        }

        // 移除缓存
        routeList[index].matched.forEach(route => {
          const componentName = route.components?.default.name
          if (componentName && componentName !== routerLayoutName) {
            multiTabStore.cachedComponentNames.delete(componentName)
          }
        })

        // 移除目标路由
        routeList.splice(index, 1)

        // 如果删除的是当前选中的 tab 则选中后一个 tab，如果后面没有 tab，则选中前一个
        if (activeKey.value === targetKey) {
          activeKey.value =
            index == routeList.length ? routeList[index - 1].path : routeList[index].path
          router.push(activeKey.value)
        }
      }
    }

    /** 更多事件 */
    const handleTabMoreAction = ({ key }: MenuInfo) => {
      const routeList = multiTabStore.routeList
      const currentIndex = routeList.findIndex(route => route.path === activeKey.value)
      switch (key) {
        case 'closeLeft': // 删除左边 tab
          currentIndex > 0 && routeList.splice(0, currentIndex)
          break
        case 'closeRight': // 删除右边 tab
          currentIndex > -1 && routeList.splice(currentIndex + 1)
          break
        case 'closeOther': // 删除其他 tab
          multiTabStore.routeList = [routeList[currentIndex]]
          break
      }

      // 更新缓存
      multiTabStore.cachedComponentNames.clear()
      multiTabStore.routeList.forEach(route => addCachedComponentNames(route.matched))
    }

    /** 刷新页面 */
    const reloadContent = () => {
      // 获取当前页面的缓存,
      const componentNames: string[] = []
      router.currentRoute.value.matched.forEach(route => {
        const componentName = route.components?.default.name
        // 这里不能删除 RouterLayout 的缓存，否则影响嵌套路由的缓存
        if (componentName && componentName !== routerLayoutName) {
          componentNames.push(componentName)
        }
      })

      // 先删除当前缓存
      componentNames.forEach(item => multiTabStore.cachedComponentNames.delete(item))

      // 切换状态，以及 nprogress 动画
      multiTabStore.contentLoading = true
      NProgress.start()
      nextTick(() => {
        NProgress.done()
        multiTabStore.contentLoading = false
        // 添加缓存
        componentNames.forEach(item => multiTabStore.cachedComponentNames.add(item))
      })

      emit('reloadContent')
      // const { path, query, matched } = unref(router.currentRoute)
      // router.replace({
      //   query: query,
      //   path: '/redirect' + path
      // })
    }

    // 国际化切换时，刷新路由信息
    if (enableI18n) {
      const refreshRoute = () => {
        multiTabStore.routeList = multiTabStore.routeList.map(oldRoute => {
          const newRoute = router
            .getRoutes()
            .find(r => r.path === oldRoute.path) as unknown as RouteLocationNormalizedLoaded
          // 需要保留 matched 防止删除时 NPE
          if (newRoute) {
            newRoute.matched = oldRoute.matched
            return newRoute
          } else {
            return oldRoute
          }
        })
      }
      emitter.on('switch-language', refreshRoute)
      onUnmounted(() => emitter.off('switch-language', refreshRoute))
    }

    // a-tab 的 ref 引用
    const tabRef = ref()
    const unScrollable = ref(true)
    const handleTabScroll = () => {
      nextTick(() => {
        const operationsDom = tabRef.value?.$el.querySelector('.ant-tabs-nav-operations')
        unScrollable.value =
          operationsDom && hasClass(operationsDom, 'ant-tabs-nav-operations-hidden')
      })
    }

    const scrollTab = (deltaY: number) => {
      if (unScrollable.value) return
      const wrapDom = tabRef.value.$el.querySelector('.ant-tabs-nav-wrap')
      if (wrapDom) {
        const event = new WheelEvent('wheel', { deltaX: 0, deltaY: deltaY })
        wrapDom.dispatchEvent(event)
      }
    }
    const scrollLeft = () => scrollTab(-100)
    const scrollRight = () => scrollTab(100)

    // ------- 样式布局相关 -----------
    const isFullScreen = ref(false)
    const isTop = computed(() => props.layout === 'top')
    const needFixedHeader = computed(() => props.fixedHeader || props.layout === 'mix')

    /** 计算侧边栏的宽度，不然导致左边的样式会出问题 */
    const width = computed(() => {
      const needSettingWidth =
        needFixedHeader.value &&
        props.hasSiderMenu &&
        !isTop.value &&
        !props.isMobile &&
        !isFullScreen.value
      return needSettingWidth ? `calc(100% - ${props.collapsed ? 48 : props.siderWidth}px)` : '100%'
    })
    const multiTabHeight = '40px'
    const right = computed(() => (needFixedHeader.value ? 0 : undefined))

    // 移动
    const arrowClassName = computed(() => [
      'ballcat-multi-tabs-btn',
      {
        'ballcat-multi-tabs-btn-disabled': unScrollable.value
      }
    ])

    return () => {
      // 刷新按钮
      const reloadActionDom = (
        <span class="ballcat-multi-tabs-btn ballcat-multi-tabs-btn-border" onClick={reloadContent}>
          <ReloadOutlined />
        </span>
      )

      // 更多操作，关闭
      const moreActionDom = (
        <Dropdown overlayClassName="ballcat-multi-tabs-more">
          {{
            default: () => (
              <span class="ballcat-multi-tabs-btn ballcat-multi-tabs-btn-border">
                {/*由于视觉误差问题，所以调高一点大小*/}
                <DownOutlined style="font-size: 13px; vertical-align: -0.125em" />
              </span>
            ),
            overlay: () => (
              <Menu onClick={handleTabMoreAction}>
                <Menu.Item key="closeLeft">
                  <ArrowLeftOutlined />
                  <span class="ballcat-multi-tabs-more-title">关闭左侧</span>
                </Menu.Item>
                <Menu.Item key="closeRight">
                  <ArrowRightOutlined />
                  <span class="ballcat-multi-tabs-more-title">关闭右侧</span>
                </Menu.Item>
                <Menu.Item key="closeOther">
                  <CloseOutlined />
                  <span class="ballcat-multi-tabs-more-title">关闭其他</span>
                </Menu.Item>
              </Menu>
            )
          }}
        </Dropdown>
      )

      // 全屏
      const fullscreenActionDom = (
        <span
          class="ballcat-multi-tabs-btn ballcat-multi-tabs-btn-border"
          onClick={() => {
            isFullScreen.value = !isFullScreen.value
            emit('fullscreenChange', isFullScreen.value)
          }}
        >
          {isFullScreen.value ? <CompressOutlined /> : <ExpandOutlined />}
        </span>
      )

      return (
        <>
          {needFixedHeader.value && (
            <div
              style={{
                height: multiTabHeight,
                lineHeight: multiTabHeight,
                background: 'transparent'
              }}
            />
          )}
          <div
            style={{
              padding: 0,
              height: multiTabHeight,
              lineHeight: multiTabHeight,
              width: width.value,
              zIndex: props.layout === 'mix' ? 101 : 20,
              right: right.value,
              position: needFixedHeader.value ? 'fixed' : 'static',
              top: !isFullScreen.value && needFixedHeader.value ? '48px' : 0,
              borderTop: isFullScreen.value ? 0 : '0.8px solid #efebeb',
              ...(attrs.style as CSSProperties)
            }}
            class="ballcat-multi-tabs"
          >
            <Tabs
              ref={tabRef}
              type={'editable-card'}
              hideAdd={true}
              activeKey={activeKey.value}
              onTabClick={handleTabClick}
              onEdit={handleTabEdit}
              onTabScroll={handleTabScroll}
            >
              {{
                default: () => (
                  <>
                    {multiTabStore.routeList.map(route => (
                      <Tabs.TabPane
                        key={route.path}
                        tab={route.meta.name}
                        closable={multiTabStore.routeList.length > 1}
                      />
                    ))}
                  </>
                ),
                leftExtra: () => (
                  <span class={arrowClassName.value} onClick={scrollLeft}>
                    <LeftOutlined />
                  </span>
                ),
                rightExtra: () => (
                  <>
                    <span
                      class={[
                        arrowClassName.value,
                        {
                          'ballcat-multi-tabs-btn-border': !unScrollable.value
                        }
                      ]}
                      onClick={scrollRight}
                    >
                      <RightOutlined />
                    </span>
                    {reloadActionDom}
                    {moreActionDom}
                    {fullscreenActionDom}
                  </>
                )
              }}
            </Tabs>
          </div>
        </>
      )
    }
  }
})

export default MultiTab
