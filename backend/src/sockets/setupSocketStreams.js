import { setupProductStream } from './changeStreams/productStream'

export const setupAllStreams = (io) => {
  setupProductStream(io)
}
