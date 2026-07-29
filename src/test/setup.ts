import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// 每个用例之间不共享 DOM 和 localStorage —— 令牌是存在 localStorage 里的,
// 一个用例登录了下一个用例还带着令牌,测出来的东西就不是它想测的。
afterEach(() => {
  cleanup()
})

beforeEach(() => {
  localStorage.clear()
})

// antd 的响应式组件在 jsdom 里会调 matchMedia
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList
}
