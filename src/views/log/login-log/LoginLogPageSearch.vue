<template>
  <a-card :bordered="false" style="margin-bottom: 16px" :body-style="{ paddingBottom: 0 }">
    <a-form :model="formModel" :label-col="labelCol">
      <a-row :gutter="16">
        <a-col :xl="8" :md="12" :sm="24">
          <a-form-item label="用户名">
            <a-input v-model:value="formModel.username" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :xl="8" :md="12" :sm="24">
          <a-form-item label="登陆IP">
            <a-input v-model:value="formModel.ip" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <template v-if="!searchCollapsed">
          <a-col :xl="8" :md="12" :sm="24">
            <a-form-item label="事件类型">
              <dict-select
                v-model:value="formModel.eventType"
                dict-code="login_event_type"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="8" :md="12" :sm="24">
            <a-form-item label="事件状态">
              <dict-select
                v-model:value="formModel.status"
                dict-code="log_status"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :xl="8" :md="12" :sm="24">
            <a-form-item label="登陆时间">
              <a-range-picker
                v-model:value="searchTimeValue"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                style="width: 100%"
                :ranges="{
                  Today: [dayjs().startOf('date'), dayjs()]
                }"
              />
            </a-form-item>
          </a-col>
        </template>

        <a-col :xl="8" :md="12" :sm="24">
          <search-actions
            v-model:collapsed="searchCollapsed"
            :collapsible="true"
            :loading="props.loading"
            @search="search"
            @reset="reset"
          />
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { LoginLogQO } from '@/api/log/login-log/types'

const useForm = Form.useForm

// 表单 label 全局配置
const labelCol = { md: { span: 6 } }

const props = withDefaults(
  defineProps<{
    loading?: boolean
  }>(),
  { loading: false }
)

const emits = defineEmits<{
  (e: 'search', params: Record<string, any>): void
}>()

const searchCollapsed = ref(true)

const searchTimeValue = ref<[Dayjs, Dayjs]>()
const formModel = reactive<LoginLogQO>({
  traceId: '',
  username: '',
  ip: '',
  eventType: undefined,
  status: undefined
})

const { resetFields } = useForm(formModel)

const search = () => {
  const param = toRaw(formModel)
  if (searchTimeValue.value && searchTimeValue.value.length == 2) {
    param.startTime = searchTimeValue.value[0].format('YYYY-MM-DD HH:mm:ss')
    param.endTime = searchTimeValue.value[1].format('YYYY-MM-DD HH:mm:ss')
  }
  emits('search', param)
}

const reset = () => {
  // 清空表单其他元素
  resetFields()
  // 清空时间
  searchTimeValue.value = undefined
  search()
}
</script>
