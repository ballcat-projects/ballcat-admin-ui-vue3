<template>
  <div class="container">
    <!-- 国际化语言切换 -->
    <div class="lang">
      <SelectLanguage />
    </div>

    <!-- 内容 -->
    <div class="content">
      <login-content />
    </div>

    <!-- 页脚 -->
    <login-footer />
  </div>
</template>

<script setup lang="ts">
import LoginContent from './components/LoginContent.vue'
import LoginFooter from './components/LoginFooter.vue'
import SelectLanguage from '@/components/SelectLanguage/index.vue'
import { defineOptions } from 'vue'

defineOptions({ name: 'LoginPage' })
</script>

<style lang="less" scoped>
@import 'index.less';
</style>
