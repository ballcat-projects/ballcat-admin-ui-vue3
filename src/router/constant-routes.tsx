// notFound 路由，使用函数获取，方便使用不同的路由名称，支持登录后 content 中显示异常信息
import type { RouteRecordRaw } from 'vue-router'
import { LOGIN_PATH } from '@/constants'
import { DashboardOutlined, GithubOutlined } from '@ant-design/icons-vue'

export const ExceptionComponentImport = () => import('@/views/basic/exception/index.vue')

export const buildNotFoundRoute = (routeName: string): RouteRecordRaw => ({
  path: '/:pathMatch(.*)*',
  name: routeName,
  component: ExceptionComponentImport,
  meta: {
    name: '404',
    hideInMenu: true,
    hideInTab: true
  },
  props: {
    exceptionStatus: '404'
  }
})

const demoRoutes: RouteRecordRaw = {
  path: '/',
  name: '/',
  component: () => import('@/layouts/TestLayout.vue'),
  redirect: '/test1',
  meta: {
    keepAlive: false
  },
  children: [
    {
      path: 'test1',
      name: 'test1',
      component: () => import('@/views/Test1.vue'),
      meta: {
        name: '测试页面1',
        icon: <DashboardOutlined />
      }
    },
    {
      path: 'test2',
      name: 'test2',
      component: () => import('@/views/Test2.vue'),
      meta: {
        name: '测试页面2',
        icon: 'icon-tuichu'
      }
    },
    {
      path: 'test3',
      name: 'test3',
      component: () => import('@/views/Test3.vue'),
      meta: {
        name: '测试页面3',
        icon: 'icon-tuichu'
      }
    },
    {
      path: 'test-table',
      name: 'testTable',
      component: () => import('@/views/TestTable.vue'),
      meta: {
        name: '高级表格',
        icon: 'icon-tuichu'
      }
    },
    {
      path: 'test4',
      name: 'test4',
      redirect: '/test4/test1',
      component: () => import('@/layouts/RouterLayout.vue'),
      meta: {
        name: '嵌套页面',
        icon: 'icon-tuichu'
      },
      children: [
        {
          path: 'test1',
          name: 'sub-test1',
          component: () => import('@/views/sub1/SubTest1.vue'),
          meta: {
            name: '子页面1',
            icon: <DashboardOutlined />
          }
        },
        {
          path: 'test2',
          name: 'sub-test2',
          component: () => import('@/views/sub1/SubTest2.vue'),
          meta: {
            name: '子页面2',
            icon: 'icon-tuichu'
          }
        }
      ]
    },
    {
      path: 'test5',
      name: 'test5',
      redirect: '/test5/test1',
      component: () => import('@/layouts/RouterLayout.vue'),
      meta: {
        name: '嵌套页面2',
        icon: 'icon-tuichu'
      },
      children: [
        {
          path: 'sub',
          name: 'sub3',
          component: () => import('@/layouts/RouterLayout.vue'),
          meta: {
            name: '三级菜单',
            icon: <DashboardOutlined />
          },
          children: [
            {
              path: 'test5',
              name: 'sub3-test5',
              component: () => import('@/views/sub2/sub3/SubTest5.vue'),
              meta: {
                name: '孙子页面1',
                icon: <DashboardOutlined />
              }
            },
            {
              path: 'test6',
              name: 'sub3-test6',
              component: () => import('@/views/sub2/sub3/SubTest6.vue'),
              meta: {
                name: '孙子页面2',
                icon: 'icon-tuichu'
              }
            }
          ]
        },
        {
          path: 'test1',
          name: 'sub1-test3',
          component: () => import('@/views/sub2/SubTest3.vue'),
          meta: {
            name: '子页面1',
            icon: <DashboardOutlined />
          }
        },
        {
          path: 'test2',
          name: 'sub1-test4',
          component: () => import('@/views/sub2/SubTest4.vue'),
          meta: {
            name: '子页面2',
            icon: 'icon-tuichu'
          }
        }
      ]
    },
    {
      path: 'http://www.ballcat.cn',
      name: '外链测试',
      // @ts-ignore
      component: null,
      meta: {
        name: '外链测试',
        target: '_blank',
        icon: <GithubOutlined />
      }
    },
    buildNotFoundRoute('PageNotFound')
  ]
}

const constantRoutes: RouteRecordRaw[] = [
  {
    path: LOGIN_PATH,
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/login/index.vue'),
    meta: {
      allowAnonymous: true
    }
  },
  // 404 路由
  buildNotFoundRoute('GlobalNotFound')
]

export default constantRoutes
