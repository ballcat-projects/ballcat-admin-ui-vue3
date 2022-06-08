<template>
  <a-card :bordered="false" style="margin-bottom: 16px" :body-style="{ paddingBottom: 0 }">
    <a-form :model="formModel" :label-col="labelCol">
      <a-row :gutter="16">
        <a-col :md="8" :sm="24">
          <a-form-item label="角色">
            <a-input v-model:value="formModel.name" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :md="8" :sm="24">
          <a-form-item label="标识">
            <a-input v-model:value="formModel.code" placeholder="请输入" />
          </a-form-item>
        </a-col>
        <a-col :xl="8" :md="12" :sm="24">
          <a-form-item :wrapper-col="{ flex: '1 1 0' }" class="search-actions-wrapper">
            <a-space size="middle">
              <a-space>
                <a-button type="primary" :loading="props.loading" @click="search">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
              <!--              <a @click="() => toggleSearchCollapsed()">-->
              <!--                {{ searchCollapsed ? '展开' : '收起' }}-->
              <!--                <DownOutlined v-if="searchCollapsed" />-->
              <!--                <UpOutlined v-else />-->
              <!--              </a>-->
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
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

// const [searchCollapsed, toggleSearchCollapsed] = useToggle(true)

const formModel = reactive({
  name: '',
  code: ''
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
  name: 'SysRolePageSearch'
}
</script>
