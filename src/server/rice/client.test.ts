import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import storage from '@/utils/stroage'
import instance, { rice, setUnauthorizedHandler } from './client'
import { RiceError } from './errors'

/**
 * 客户端这一层盯的是 core 和 rice 的三处协议差异。每一处出错的表现都是
 * 「所有请求都失败」或者更糟的「所有请求都看起来成功」,而类型系统一个都拦不住:
 *
 *   1. 令牌要带 `Bearer ` 前缀 —— core 塞的是裸令牌
 *   2. 没有 `{code, message, data}` 信封,失败靠 HTTP 状态码
 *   3. 401 要清掉本地令牌,否则用户卡在一个永远 401 的界面里
 */

const ANON_LIKE = { anonymous: true, keepSessionOnUnauthorized: true }

let mock: MockAdapter

beforeEach(() => {
  mock = new MockAdapter(instance)
})

afterEach(() => {
  mock.restore()
  setUnauthorizedHandler(null)
})

describe('鉴权头', () => {
  it('带 Bearer 前缀 —— core 塞的是裸令牌', async () => {
    storage.setToken('tok-123')
    mock.onGet('/api/admin/me').reply(200, { data: { id: 'a' } })

    await rice.get('/api/admin/me')

    expect(mock.history.get[0].headers?.Authorization).toBe('Bearer tok-123')
  })

  it('没有令牌时不发这个头,而不是发个 "Bearer null"', async () => {
    mock.onGet('/api/admin/me').reply(200, { data: {} })

    await rice.get('/api/admin/me')

    expect(mock.history.get[0].headers?.Authorization).toBeUndefined()
  })

  // 登录接口本身不该带上一个过期的令牌
  it('anonymous 的请求不带令牌', async () => {
    storage.setToken('tok-123')
    mock.onPost('/api/admin/session').reply(201, { data: { token: 'new' } })

    await rice.post('/api/admin/session', {}, { anonymous: true })

    expect(mock.history.post[0].headers?.Authorization).toBeUndefined()
  })
})

describe('响应拆包', () => {
  it('单个资源只把 data 给出去', async () => {
    mock.onGet('/api/admin/me').reply(200, { data: { id: 'a', nickname: '张三' } })

    await expect(rice.get('/api/admin/me')).resolves.toEqual({ id: 'a', nickname: '张三' })
  })

  it('列表把 meta 一起给出去 —— 分页器要 total', async () => {
    mock.onGet('/api/admin/users').reply(200, {
      data: [{ id: 'u1' }],
      meta: { next_cursor: null, total: 42, page: 2, per_page: 15 },
    })

    const page = await rice.page('/api/admin/users', { page: 2 })

    expect(page.data).toHaveLength(1)
    expect(page.meta.total).toBe(42)
  })

  it('204 返回 undefined,不是空字符串', async () => {
    mock.onDelete('/api/admin/admin_users/x').reply(204)

    await expect(rice.delete('/api/admin/admin_users/x')).resolves.toBeUndefined()
  })

  // core 的 HTTP 永远 200,成败看信封里的 code。要是这里还留着信封逻辑,
  // rice 的 {data: false} 之类会被误判成失败。
  it('data 是 false 时算成功,不是业务失败', async () => {
    mock.onGet('/api/x').reply(200, { data: false })

    await expect(rice.get('/api/x')).resolves.toBe(false)
  })
})

describe('错误', () => {
  it('422 的字段错误既能整句显示,也能按字段取', async () => {
    mock.onPost('/api/admin/admin_users').reply(422, {
      errors: { phone: ['必须填手机号'], role: ['只能是 admin 或 operator'] },
    })

    const error = (await rice.post('/api/admin/admin_users', {}).catch((e: RiceError) => e)) as RiceError

    expect(error).toBeInstanceOf(RiceError)
    expect(error.status).toBe(422)
    expect(error.message).toContain('必须填手机号')
    expect(error.message).toContain('只能是 admin 或 operator')
    expect(error.fields.phone).toEqual(['必须填手机号'])
  })

  it('detail 型错误直接当消息', async () => {
    mock.onPost('/api/admin/session').reply(401, {
      errors: { detail: '手机号、密码或验证码不正确' },
    })

    const error = (await rice.post('/api/admin/session', {}, { anonymous: true }).catch((e: RiceError) => e)) as RiceError

    expect(error.message).toBe('手机号、密码或验证码不正确')
    expect(error.fields).toEqual({})
  })

  it('body 没有 errors 时按状态码给一句话,而不是 undefined', async () => {
    mock.onGet('/api/admin/users').reply(403)

    const error = (await rice.get('/api/admin/users').catch((e: RiceError) => e)) as RiceError

    expect(error.status).toBe(403)
    expect(error.message).toBe('没有权限')
  })

  // 服务端知道原因时会写在 body 里,那句必须盖过兜底文案 ——
  // 兜底只说状态码的意思,不猜原因,猜错了会把人指向完全无关的方向
  it('body 里的原因盖过兜底文案', async () => {
    mock.onPost('/api/admin/post_takedowns').reply(503, {
      errors: { detail: '贴文服务未配置' },
    })

    const error = (await rice
      .post('/api/admin/post_takedowns', {})
      .catch((e: RiceError) => e)) as RiceError

    expect(error.message).toBe('贴文服务未配置')
  })

  // Phoenix 有未执行的迁移时会直接抛一个 HTML 错误页,没有 errors 可读
  it('没有 body 的 503 不乱猜原因', async () => {
    mock.onGet('/api/admin/me').reply(503, '<html>PendingMigrationError</html>')

    const error = (await rice.get('/api/admin/me').catch((e: RiceError) => e)) as RiceError

    expect(error.message).toBe('服务暂时不可用')
  })

  // 连不上和「服务端返回了错误」是两回事,提示语不该一样
  it('网络层失败给的是连不上,不是某个状态码', async () => {
    mock.onGet('/api/admin/users').networkError()

    const error = (await rice.get('/api/admin/users').catch((e: RiceError) => e)) as RiceError

    expect(error.status).toBe(0)
    expect(error.message).toBe('无法连接到服务器')
  })
})

describe('401', () => {
  it('触发登出回调', async () => {
    const onUnauthorized = vi.fn()
    setUnauthorizedHandler(onUnauthorized)
    storage.setToken('过期了')
    mock.onGet('/api/admin/me').reply(401, { errors: { detail: '未认证' } })

    await rice.get('/api/admin/me').catch(() => {})

    expect(onUnauthorized).toHaveBeenCalledOnce()
  })

  // 登录页自己会显示「密码不对」,不该顺手把人踢到登录页去(它已经在登录页了)
  it('keepSessionOnUnauthorized 时不触发登出', async () => {
    const onUnauthorized = vi.fn()
    setUnauthorizedHandler(onUnauthorized)
    mock.onPost('/api/admin/session').reply(401, { errors: { detail: '不正确' } })

    await rice.post('/api/admin/session', {}, ANON_LIKE).catch(() => {})

    expect(onUnauthorized).not.toHaveBeenCalled()
  })

  it('别的错误码不触发登出', async () => {
    const onUnauthorized = vi.fn()
    setUnauthorizedHandler(onUnauthorized)
    mock.onGet('/api/admin/admin_users').reply(403, { errors: { detail: '无权限' } })

    await rice.get('/api/admin/admin_users').catch(() => {})

    expect(onUnauthorized).not.toHaveBeenCalled()
  })
})
