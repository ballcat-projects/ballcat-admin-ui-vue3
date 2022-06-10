import type { ColProps } from 'ant-design-vue'
import type { ApiResult } from '@/api/types'
import { Form, message } from 'ant-design-vue'
import { isSuccess } from '@/api'
import type { Ref } from 'vue'
import type { Props } from 'ant-design-vue/es/form/useForm'
import type { Callbacks } from 'ant-design-vue/es/form/interface'
const useForm = Form.useForm

export interface DebounceSettings {
  leading?: boolean
  wait?: number
  trailing?: boolean
}

// 表单行为类型，标识当前表单是用来新建的还是更新的
export const enum FormAction {
  NONE = 'none',
  CREATE = 'create',
  UPDATE = 'update'
}

export interface FormRequestMapping<T, R = unknown> {
  [key: string]: (model: T) => Promise<ApiResult<R>>
}

// 默认的表单的标签布局
export const labelCol: ColProps = {
  sm: { span: 24 },
  md: { span: 5 }
}

// 默认的表单元素布局
export const wrapperCol: ColProps = {
  sm: { span: 24 },
  md: { span: 19 }
}

export const useAdminForm = <T, R = unknown>(
  formAction: Ref<FormAction>,
  formRequestMapping: FormRequestMapping<T, R>,
  modelRef: Props | Ref<Props>,
  rulesRef?: Props | Ref<Props>,
  options?: {
    immediate?: boolean
    deep?: boolean
    validateOnRuleChange?: boolean
    debounce?: DebounceSettings
    onValidate?: Callbacks['onValidate']
  }
) => {
  // 表单提交状态
  const submitLoading = ref(false)

  // 调用 antdv 的 useForm 初始化表单
  const useFormResult = useForm(modelRef, rulesRef, options)

  /* 表单提交方法 */
  const submit = (model: T, onSubmitSuccess?: () => void) => {
    submitLoading.value = true
    const request = formRequestMapping[formAction.value]
    request(model)
      .then(res => {
        if (isSuccess(res)) {
          onSubmitSuccess?.()
          message.success(res.message)
        } else {
          message.error(res.message)
        }
      })
      .catch(e => {
        !e.resolved && message.error(e.message)
      })
      .finally(() => {
        submitLoading.value = false
      })
  }

  /* 表单校验后并提交 */
  const validateAndSubmit = (model: T, onSubmitSuccess?: () => void) => {
    useFormResult
      .validate()
      .then(() => {
        submit(model, onSubmitSuccess)
      })
      .catch(e => {
        import.meta.env.DEV && console.log('error', e)
      })
  }

  return {
    submit,
    submitLoading,
    validateAndSubmit,
    ...useFormResult
  }
}

/**
 * 表单行为管理
 * @param defaultFormAction 默认的表单行为
 */
export const useFormAction = (defaultFormAction: FormAction = FormAction.NONE) => {
  // 表单类型
  const formAction = ref<FormAction>(defaultFormAction)

  // 表单类型是否是新建
  const isCreateForm = computed(() => formAction.value === FormAction.CREATE)

  // 表单类型是否是修改
  const isUpdateForm = computed(() => formAction.value === FormAction.UPDATE)

  return {
    formAction,
    isCreateForm,
    isUpdateForm
  }
}
