import socketAuthMiddleware from '~/sockets/middlewares/socketAuthMiddleware'
import { setupAllStreams } from './setupSocketStreams'

const setupSocket = (io) => {
  // Đăng ký middleware AUTH trước
  io.use(socketAuthMiddleware)

  // Các streams Database
  setupAllStreams(io)

  io.on('connection', (socket) => {
    console.log('Websocket connected to Client!')

    socket.on('error', (err) => {
      console.error('Socket error:', err)
      // Có thể gửi message lỗi lại client hoặc ghi log tùy ý
    })

    // Xử lý sau khi ngắt kết nối
    socket.on('disconnect', () => {
      console.log('Websocket disconnected!')
    })
  })
}

export default setupSocket
