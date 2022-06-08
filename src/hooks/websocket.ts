import { useWebSocket } from '@vueuse/core'
import { useUserStore } from '@/stores/user-store'

const useBallcatWebSocket = () => {
  const { accessToken } = useUserStore()

  // ws地址
  const baseUri = import.meta.env.VITE_API_URL
  const host = window.location.host
  const wsUri = `ws://${host}${baseUri}/ws?access_token=${accessToken}`

  return useWebSocket(wsUri, {
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        console.error('Failed to connect WebSocket after 3 retries')
      }
    },
    heartbeat: {
      message: '{"type": "ping"}',
      interval: 30000
    }
  })
}

export default useBallcatWebSocket
