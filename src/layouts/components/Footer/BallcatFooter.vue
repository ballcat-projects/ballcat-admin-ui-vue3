<template>
  <footer-view :footer-style="{ margin: '16px 0' }">
    <template #links>
      <a href="http://www.ballcat.cn/" target="_blank" rel="noreferrer"> BallCat </a>
      <a href="https://github.com/ballcat-projects/ballcat-ui-vue" target="_blank" rel="noreferrer">
        <github-outlined />
      </a>
      <a href="https://ant.design/" rel="noreferrer">Ant Design</a>
      <a href="https://antdv.com/" rel="noreferrer">Ant Design Vue</a>
    </template>
    <template #copyright>
      Copyright <copyright-outlined /> 2022 <span>🐱 BallCat 组织出品</span>
    </template>
  </footer-view>
</template>

<script setup lang="ts">
import FooterView from '#/layout/Footer'
</script>
