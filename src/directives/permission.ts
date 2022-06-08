import type { App } from 'vue'
import { useAuthorize } from '@/hooks/permission'

export function setupPermissionDirective(app: App) {
  // v-has 指令
  app.directive('has', {
    mounted: (el, binding) => {
      const value = binding.value
      if (!value) return
      const { hasPermission } = useAuthorize()
      if (!hasPermission(value)) {
        el.parentNode?.removeChild(el)
      }
    }
  })
  // v-role 指令
  app.directive('role', {
    mounted: (el, binding) => {
      const value = binding.value
      if (!value) return
      const { hasRole } = useAuthorize()
      if (!hasRole(value)) {
        el.parentNode?.removeChild(el)
      }
    }
  })
  app.directive('test', {
    beforeMount(el, { value }, { transition }) {
      el._vod = el.style.display === 'none' ? '' : el.style.display
      if (transition && value) {
        transition.beforeEnter(el)
      } else {
        setDisplay(el, value)
      }
    },
    mounted(el, { value }, { transition }) {
      if (transition && value) {
        transition.enter(el)
      }
    },
    updated(el, { value, oldValue }, { transition }) {
      if (!value === !oldValue) return
      if (transition) {
        if (value) {
          transition.beforeEnter(el)
          setDisplay(el, true)
          transition.enter(el)
        } else {
          transition.leave(el, () => {
            setDisplay(el, false)
          })
        }
      } else {
        setDisplay(el, value)
      }
    },
    beforeUnmount(el, { value }) {
      setDisplay(el, value)
    }
  })
}

function setDisplay(el: any, value: unknown): void {
  el.style.display = value ? el._vod : 'none'
}
