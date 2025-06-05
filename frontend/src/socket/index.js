import { io } from 'socket.io-client'
import { API_ROOT } from '~/utils/constants'

const socket = io(API_ROOT, {
  withCredentials: true,
  autoConnect: false
})

export default socket
