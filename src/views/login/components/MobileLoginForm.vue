<template>
  <a-form>
    <a-form-item name="mobile" :rules="[{ required: true, message: '请输入手机号!' }]">
      <a-input size="large" placeholder="手机号">
        <template #prefix>
          <mobile-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
        </template>
      </a-input>
    </a-form-item>

    <a-form-item name="captcha" :rules="[{ required: true, message: '请输入验证码!' }]">
      <div style="display: flex; align-items: center">
        <a-input
          size="large"
          placeholder="验证码"
          style="flex: 1; transition: width 0.3s; margin-right: 8px"
        >
          <template #prefix>
            <mail-outlined :style="{ color: 'rgba(0,0,0,.25)' }" />
          </template>
        </a-input>
        <a-button style="display: block; height: 40px"> 获取验证码 </a-button>
      </div>
    </a-form-item>
  </a-form>
</template>

<script setup lang="ts">
// const loginStatus = ref('none')
// const loginErrorMessage = ref('手机验证码错误!')
</script>

<style scoped></style>
