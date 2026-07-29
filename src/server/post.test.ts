import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { instance, listPosts, PostServiceError } from './post'

/**
 * post 服务是**直连的外部服务**,不经过 rice。它连不上的情况比 rice 常见得多
 * (线上地址在有些网络下根本不可达),所以失败必须说得清楚:
 * 是没连上,还是服务端返回了错误 —— 两者要查的地方完全不同。
 */

let mock: MockAdapter

beforeEach(() => {
  // 拦的是模块自建的那个实例 —— MockAdapter 挂全局 axios 上拦不到它
  mock = new MockAdapter(instance)
})

afterEach(() => mock.restore())

describe('listPosts', () => {
  it('打的是 /post/api/posts/list', async () => {
    mock.onPost(/\/api\/posts\/list$/).reply(200, { posts: [{ uri: 'at://x' }], total: 1 })

    const result = await listPosts({ page: 1 })

    expect(result.posts).toHaveLength(1)
    expect(result.total).toBe(1)
  })

  // 不包成 PostServiceError 的话,页面拿到的是一个 AxiosError,
  // 只能以 "Uncaught (in promise)" 落到控制台
  it('超时说成"没有响应",不说成"服务出错"', async () => {
    mock.onPost(/\/api\/posts\/list$/).timeout()

    const error = (await listPosts({}).catch(e => e)) as PostServiceError

    expect(error).toBeInstanceOf(PostServiceError)
    expect(error.status).toBe(0)
    expect(error.message).toContain('没有响应')
  })

  it('连不上和服务端报错分得开', async () => {
    mock.onPost(/\/api\/posts\/list$/).networkError()
    const offline = (await listPosts({}).catch(e => e)) as PostServiceError
    expect(offline.message).toBe('连不上贴文服务')

    mock.restore()
    mock = new MockAdapter(instance)
    mock.onPost(/\/api\/posts\/list$/).reply(500)
    const failed = (await listPosts({}).catch(e => e)) as PostServiceError
    expect(failed.status).toBe(500)
    expect(failed.message).toContain('500')
  })
})
