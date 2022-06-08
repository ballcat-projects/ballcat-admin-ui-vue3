import type { Ref } from 'vue'

function getDefaultValue<T>(propValue: Ref<T>, defaultValue?: T | (() => T)) {
  if (propValue.value !== undefined) {
    return propValue.value
  }
  if (defaultValue !== undefined) {
    return typeof defaultValue === 'function' ? (defaultValue as any)() : defaultValue
  }
}

export default function index<T, R = Ref<T>>(
  propValue: Ref<T>,
  option?: {
    defaultValue?: T | (() => T)
    onChange?: (value: T) => void
  }
): [R, (value: T, ignoreDestroy?: boolean) => void] {
  const innerValue = ref(getDefaultValue(propValue, option?.defaultValue))

  watch(
    () => propValue.value,
    () => (innerValue.value = propValue.value)
  )

  const triggerChange = (newValue: T) => {
    innerValue.value = newValue
    if (option?.onChange) {
      option.onChange(newValue)
    }
  }

  return [innerValue as unknown as R, triggerChange]
}
