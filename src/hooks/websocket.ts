import { useWebSocket, type UseWebSocketReturn } from '@vueuse/core'
import { useUserStore } from '@/stores/user-store'
import { emitter } from '@/hooks/mitt'

let useWebSocketReturn: UseWebSocketReturn<any> | undefined = undefined
const useAdminWebSocket = () => {
  if (useWebSocketReturn && useWebSocketReturn.status.value != 'CLOSED') {
    return useWebSocketReturn
  }

  const { accessToken } = useUserStore()

  // ws地址
  const baseUri = import.meta.env.VITE_API_URL
  const host = window.location.host
  const protocol = window.location.protocol || ''
  const wsUri = `${protocol.startsWith('https') ? 'wss' : 'ws'}://${host}${baseUri}/ws?access_token=${accessToken}`

  useWebSocketReturn = useWebSocket(wsUri, {
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

  watch(
    () => useWebSocketReturn!.data.value,
    value => {
      let event
      let dataMsg

      try {
        dataMsg = JSON.parse(value)
        event = dataMsg.type
        // 心跳响应跳过发布
        if (event === 'pong') {
          return
        }
      } catch (e) {
        // 纯文本消息
        event = 'plaintext'
        dataMsg = value
      }
      emitter.emit(event, dataMsg)
    }
  )

  return useWebSocketReturn
}

export default useAdminWebSocket
