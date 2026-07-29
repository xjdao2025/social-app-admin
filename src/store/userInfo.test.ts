import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import storage from '@/utils/stroage'
import instance from '@/server/rice/client'
import useUserInfoStore from './userInfo'

/**
 * 会话 store。三件事值得盯:
 *
 *   1. 登出要**通知服务端**。rice 的令牌可撤销(删行即失效),只清本地等于把一把
 *      还能用的钥匙留在世界上 —— 而这件事在界面上完全看不出来。
 *   2. 撤销请求得带着令牌发。先清 storage 再发,请求就成了一个没带令牌的 401。
 *   3. 401 要清掉本地会话,否则用户卡在一个永远 401 的界面里。
 */

let mock: MockAdapter

beforeEach(() => {
  mock = new MockAdapter(instance)
  useUserInfoStore.setState({ token: '', userInfo: null })
})

afterEach(() => {
  mock.restore()
})

describe('登录', () => {
  it('存下令牌和管理员,不必再拉一次 me', () => {
    useUserInfoStore.getState().login({
      token: 'tok-1',
      admin: { id: 'a1', nickname: '张三', role: 'admin' } as never,
    })

    expect(storage.getToken()).toBe('tok-1')
    expect(useUserInfoStore.getState().userInfo?.nickname).toBe('张三')
  })
})

describe('登出', () => {
  it('通知服务端撤销令牌', async () => {
    mock.onDelete('/api/admin/session').reply(204)
    useUserInfoStore.getState().login({ token: 'tok-1', admin: { id: 'a1' } as never })

    useUserInfoStore.getState().logout()
    await vi.waitFor(() => expect(mock.history.delete).toHaveLength(1))

    expect(mock.history.delete[0].url).toBe('/api/admin/session')
  })

  // 先清 storage 再发请求的话,这个头就是空的,服务端那把钥匙根本没被撤销
  it('撤销请求带着令牌', async () => {
    mock.onDelete('/api/admin/session').reply(204)
    useUserInfoStore.getState().login({ token: 'tok-1', admin: { id: 'a1' } as never })

    useUserInfoStore.getState().logout()
    await vi.waitFor(() => expect(mock.history.delete).toHaveLength(1))

    expect(mock.history.delete[0].headers?.Authorization).toBe('Bearer tok-1')
  })

  it('本地状态立刻清干净,不等服务端', () => {
    mock.onDelete('/api/admin/session').reply(204)
    useUserInfoStore.getState().login({ token: 'tok-1', admin: { id: 'a1' } as never })

    useUserInfoStore.getState().logout()

    expect(storage.getToken()).toBeNull()
    expect(useUserInfoStore.getState().userInfo).toBeNull()
    expect(useUserInfoStore.getState().token).toBe('')
  })

  // 撤销失败(网络断了、令牌本来就过期了)不该把人卡在已登录状态
  it('撤销失败也照样登出', async () => {
    mock.onDelete('/api/admin/session').reply(401, { errors: { detail: '未认证' } })
    useUserInfoStore.getState().login({ token: '过期了', admin: { id: 'a1' } as never })

    useUserInfoStore.getState().logout()

    expect(useUserInfoStore.getState().token).toBe('')
    await vi.waitFor(() => expect(mock.history.delete).toHaveLength(1))
  })

  it('本来就没登录时不发多余的请求', () => {
    useUserInfoStore.getState().logout()

    expect(mock.history.delete).toHaveLength(0)
  })
})

describe('401', () => {
  it('任何请求 401 都会清掉本地会话', async () => {
    mock.onGet('/api/admin/me').reply(401, { errors: { detail: '未认证' } })
    mock.onDelete('/api/admin/session').reply(401)
    useUserInfoStore.getState().login({ token: '过期了', admin: { id: 'a1' } as never })

    await useUserInfoStore.getState().fetchUserInfo()?.catch(() => {})

    expect(useUserInfoStore.getState().token).toBe('')
    expect(storage.getToken()).toBeNull()
  })
})
