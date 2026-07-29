import { describe, expect, it } from 'vitest'

// 这条只证明测试环境本身是通的:jsdom 起来了、@ 别名解析得了。
// 一旦 vite 配置或 tsconfig 的 paths 被改坏,先炸的是这里,
// 而不是某个业务用例给出一个看不懂的报错。
describe('测试环境', () => {
  it('跑在 jsdom 里', () => {
    expect(typeof window).toBe('object')
    expect(typeof document.createElement).toBe('function')
  })

  it('@ 别名指向 src', async () => {
    const storage = await import('@/utils/stroage')
    expect(storage.default).toHaveProperty('getToken')
  })
})
