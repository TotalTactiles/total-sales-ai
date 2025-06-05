import '@tanstack/react-query'
import type { AIStreamObserver } from './plugins/AIStreamObserver'

declare module '@tanstack/react-query' {
  interface Register {
    aiStreamObserver?: AIStreamObserver
  }
}
