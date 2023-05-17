<template>
  <a-result :status="props.exceptionStatus" :title="type.title" :sub-title="type.desc">
    <template #extra>
      <a-button type="primary" @click="handleToHome"> Back Home </a-button>
    </template>
  </a-result>
</template>

<script setup lang="ts">
import type { ResultStatusType } from 'ant-design-vue/es/result'

// 如果需要被多页签缓存，必须要设置组件名称
defineOptions({ name: 'ExceptionPage' })

const exceptionInfos: Record<string, any> = {
  403: {
    title: '403',
    desc: 'Sorry, you are not authorized to access this page.'
  },
  404: {
    title: '404',
    desc: 'Sorry, the page you visited does not exist.'
  },
  500: {
    title: '500',
    desc: 'Sorry, the server is wrong.'
  }
}

const props = withDefaults(
  defineProps<{
    exceptionStatus?: ResultStatusType
  }>(),
  {
    exceptionStatus: '404'
  }
)

const router = useRouter()

const type = computed(() => {
  return exceptionInfos[props.exceptionStatus]
})

const handleToHome = () => {
  router.push({ name: '/' })
}
</script>
