import { FormAction } from '@/constants'
import type { ColProps } from 'ant-design-vue'
import type { ApiResult } from '@/api/types'
import { Form, message } from 'ant-design-vue'
import { isSuccess } from '@/api'
const useForm = Form.useForm

type UseFormParameters = Parameters<typeof useForm>
type UseFormReturnType = ReturnType<typeof useForm>

// 表单的标签布局
const defaultLabelCol = {
  sm: { span: 24 },
  md: { span: 5 }
}

// 表单元素布局
const defaultWrapperCol = {
  sm: { span: 24 },
  md: { span: 19 }
}

export interface AdminFormOptions {
  defaultFormAction?: FormAction
  labelCol?: ColProps
  wrapperCol?: ColProps
}

export interface FormRequestMapping<T, R = unknown> {
  [key: string]: (model: T) => Promise<ApiResult<R>>
}

export const useAdminForm = <T, R>(
  formRequestMapping: FormRequestMapping<T, R>,
  options: AdminFormOptions = {}
) => {
  // 表单提交状态
  const submitLoading = ref(false)

  // 表单类型
  const formAction = ref<FormAction>(
    options.defaultFormAction ? options.defaultFormAction : FormAction.NONE
  )

  // 表单类型是否是新建
  const isCreateForm = computed(() => formAction.value === FormAction.CREATE)

  // 表单类型是否是修改
  const isUpdateForm = computed(() => formAction.value === FormAction.UPDATE)

  // 表单标签布局
  const labelCol = ref(options.labelCol ? options.labelCol : defaultLabelCol)

  // 表单元素布局
  const wrapperCol = ref(options.wrapperCol ? options.wrapperCol : defaultWrapperCol)

  /* 调用 antdv 的 useForm 初始化表单 */
  let useFormResult: UseFormReturnType | undefined = undefined
  const initForm = (...args: UseFormParameters) => {
    useFormResult = useForm(...args)
    return useFormResult
  }

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
    if (!useFormResult) {
      console.error('提交表单前应该先执行 initForm 方法！')
      return
    }
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
    submitLoading,
    isCreateForm,
    isUpdateForm,
    formAction,
    labelCol,
    wrapperCol,
    initForm,
    submit,
    validateAndSubmit
  }
}
