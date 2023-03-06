import { DefaultEventsMap } from '@socket.io/component-emitter'
import io, { Socket } from 'socket.io-client'
import { userService } from './user.service'


export const SOCKET_EVENT_ADD_MSG = 'chat-add-msg'
export const SOCKET_EMIT_SEND_MSG = 'chat-send-msg'
export const SOCKET_EMIT_SET_TOPIC = 'chat-set-topic'
export const SOCKET_EMIT_USER_WATCH = 'user-watch'
export const SOCKET_EVENT_USER_UPDATED = 'user-updated'
export const SOCKET_EVENT_REVIEW_ADDED = 'review-added'
export const SOCKET_EVENT_REVIEW_ABOUT_YOU = 'review-about-you'
export const SOCKET_EVENT_SEND_ORDER = 'send-order'

const SOCKET_EMIT_LOGIN = 'set-user-socket'
const SOCKET_EMIT_LOGOUT = 'unset-user-socket'


const baseUrl = (process.env.NODE_ENV === 'production') ? '' : '//localhost:3030'
export const socketService = createSocketService()

declare global {
  interface Window {
    socketService: any;
  }
}

window.socketService = socketService

socketService.setup()


function createSocketService() {
  var socket: Socket<DefaultEventsMap, DefaultEventsMap> | null = null
  const socketService = {
    setup() {
      socket = io(baseUrl)
      setTimeout(() => {
        const user = userService.getLoggedInUser()
        if (user) this.login(user._id)
      }, 500)
    },
    on(eventName: string, cb: any) {
      socket?.on(eventName, cb)
    },
    off(eventName: string, cb = null) {
      if (!socket) return;
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName: string, data: any) {
      data = JSON.parse(JSON.stringify(data))
      socket?.emit(eventName, data)
    },
    login(userId: string) {
      socket?.emit(SOCKET_EMIT_LOGIN, userId)
    },
    logout() {
      socket?.emit(SOCKET_EMIT_LOGOUT)
    },
    terminate() {
      socket = null
    }
  }
  return socketService
}

