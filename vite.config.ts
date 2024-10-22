import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// 自动导入 vue 组件，无需手动 import
import AutoImport from 'unplugin-auto-import/vite'

// 按需加载 ant-design-vue 此组件无法处理非组件模块，如 message、notification
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
// 修改 index.html 插件
import { createHtmlPlugin } from 'vite-plugin-html'
// vue i18n 处理
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

// @ts-ignore
import { projectTitle } from './src/config'
import { antdvStyleDeps } from './src/utils/resolvers'

const serverAddress = 'https://admin.ballcat.cn'
// const serverAddress = 'http://127.0.0.1:8080'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '^/api': {
        target: serverAddress,
        changeOrigin: true,
        ws: true,
        rewrite: path => {
          return path.replace(/^\/api/, '')
        }
      }
    }
  },
  plugins: [
    vue(),

    vueJsx(),

    // 自动导入 vue
    AutoImport({
      // global imports to register
      imports: [
        // presets
        'vue',
        'vue-router',
        'pinia'
      ],
      // Generate corresponding .eslintrc-auto-import.json file.
      // eslint globals Docs - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
      eslintrc: {
        enabled: true, // Default `false`
        filepath: './.eslintrc-auto-import.json', // Default `./.eslintrc-auto-import.json`
        globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
      },
      // Filepath to generate corresponding .d.ts file.
      // Defaults to './auto-imports.d.ts' when `typescript` is installed locally.
      // Set `false` to disable.
      dts: './types/auto-imports.d.ts'
    }),

    // 按需加载 ant-design-vue 组件
    Components({
      types: [
        {
          from: 'vue-router',
          names: ['RouterLink', 'RouterView']
        }
      ],
      resolvers: [
        AntDesignVueResolver({
          resolveIcons: true,
          importStyle: 'less'
        })
      ],
      dts: './types/components.d.ts'
    }),

    createHtmlPlugin({
      minify: false,
      // 注入变量
      inject: {
        data: {
          title: projectTitle
        }
      }
    }),

    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      fullInstall: true,
      include: [fileURLToPath(new URL('locales/**', import.meta.url))]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#': fileURLToPath(new URL('./pro-components', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: {
          'root-entry-name': 'variable'
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      ...antdvStyleDeps,
      'vue',
      'vue-router',
      'pinia',
      'axios',
      '@vueuse/core',
      '@vueuse/shared',
      '@ant-design/icons-vue',
      'ant-design-vue/es/table',
      'ant-design-vue/es/tree-select',
      'ant-design-vue/es/vc-util/get',
      'ant-design-vue/es/_util/props-util',
      'dayjs',
      'crypto-js/index',
      '@ballcat/vue-cropper'
    ]
  }
})
