import { ref, watch } from 'vue'
import type { Ref } from 'vue'

const usePrevious = <T>(state: Ref<T>): T | undefined => {
  const innerState = ref<T>()

  watch(
    () => state.value,
    (newVal, oldVal) => {
      innerState.value = oldVal
    }
  )

  return innerState.value
}

export default usePrevious
