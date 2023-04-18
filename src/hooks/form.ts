import type { ColProps } from 'ant-design-vue'
import type { ApiResult } from '@/api/types'
import { Form } from 'ant-design-vue'
import type { Ref } from 'vue'
import type { Props } from 'ant-design-vue/es/form/useForm'
import type { Callbacks } from 'ant-design-vue/es/form/interface'
import type { RequestOptions } from '@/utils/axios/types'
import { doRequest } from '@/utils/axios/request'
const useForm = Form.useForm

export interface DebounceSettings {
  leading?: boolean
  wait?: number
  trailing?: boolean
}

// 表单行为类型，标识当前表单是用来新建的还是更新的
export const enum FormAction {
  OTHER = 'other',
  CREATE = 'create',
  UPDATE = 'update',
  IMPORT = 'import'
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
  formAction: FormAction | Ref<FormAction>,
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
  const submit = (model: T, requestOptions?: RequestOptions<R>) => {
    const request = formRequestMapping[unref(formAction)]
    submitLoading.value = true
    doRequest(request(model), {
      ...requestOptions,
      onFinally: () => {
        submitLoading.value = false
        requestOptions?.onFinally?.()
      }
    })
  }

  /* 表单校验后并提交 */
  const validateAndSubmit = (model: T, requestOptions?: RequestOptions<R>) => {
    // 防止动态 formRule 异常抛出 outOfDate，使用 setTimeout 包一层
    setTimeout(() => {
      useFormResult
        .validate()
        .then(() => {
          submit(model, requestOptions)
        })
        .catch(e => {
          import.meta.env.DEV && console.log('error', e)
        })
    }, 0)
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
export const useFormAction = (defaultFormAction: FormAction = FormAction.OTHER) => {
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
