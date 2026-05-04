import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

Object.defineProperty(document.documentElement, 'requestFullscreen', {
  configurable: true,
  value: vi.fn(),
})

Object.defineProperty(document, 'exitFullscreen', {
  configurable: true,
  value: vi.fn(),
})

Object.defineProperty(document, 'fullscreenElement', {
  configurable: true,
  get: () => null,
})

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock
