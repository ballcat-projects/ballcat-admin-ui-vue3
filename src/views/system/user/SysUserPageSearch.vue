<template>
  <a-card :bordered="false" style="margin-bottom: 16px" :body-style="{ paddingBottom: 0 }">
    <a-form :model="formModel" :label-col="labelCol">
      <a-row :gutter="16">
        <a-col :md="8" :sm="24">
          <a-form-item label="用户名">
            <a-input v-model:value="formModel.username" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="状态">
            <dict-select
              v-model:value="formModel.status"
              dict-code="user_status"
              allow-clear
              placeholder="请输入"
            />
          </a-form-item>
        </a-col>
        <template v-if="!searchCollapsed">
          <a-col :md="8" :sm="24">
            <a-form-item label="昵称">
              <a-input v-model:value="formModel.nickname" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="邮箱">
              <a-input v-model:value="formModel.email" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="电话">
              <a-input-number
                v-model:value="formModel.phone"
                placeholder="请输入"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
        </template>
        <a-col :xl="8" :md="12" :sm="24">
          <a-form-item :wrapper-col="{ flex: '1 1 0' }" class="search-actions-wrapper">
            <a-space size="middle">
              <a-space>
                <a-button type="primary" :loading="props.loading" @click="search">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
              <a @click="() => toggleSearchCollapsed()">
                {{ searchCollapsed ? '展开' : '收起' }}
                <DownOutlined v-if="searchCollapsed" />
                <UpOutlined v-else />
              </a>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import { DictSelect } from '@/components/Dict'
import { Form } from 'ant-design-vue'
import type { SysUserQO } from '@/api/system/user/types'
const useForm = Form.useForm

// 表单 label 全局配置
const labelCol = { md: { span: 6 } }

const props = withDefaults(
  defineProps<{
    loading: boolean
  }>(),
  { loading: false }
)

const emits = defineEmits<{
  (e: 'search', params: Record<string, any>): void
}>()

const [searchCollapsed, toggleSearchCollapsed] = useToggle(true)

const formModel = reactive<SysUserQO>({
  username: '',
  nickname: '',
  status: undefined,
  email: '',
  phone: ''
})

const { resetFields } = useForm(formModel)

const search = () => {
  emits('search', toRaw(formModel))
}

const reset = () => {
  resetFields()
  search()
}
</script>

<script lang="ts">
export default {
  name: 'SysUserPageSearch'
}
</script>
