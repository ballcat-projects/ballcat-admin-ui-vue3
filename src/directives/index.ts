import { setupPermissionDirective } from '@/directives/permission'
import type { App } from 'vue'

export function setupGlobDirectives(app: App) {
  setupPermissionDirective(app)
}
