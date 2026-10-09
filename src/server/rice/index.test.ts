import MockAdapter from 'axios-mock-adapter'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import storage from '@/utils/stroage'
import instance from './client'
import server, { type Post } from './index'

/**
 * 每个函数打到哪个方法、哪个路径。
 *
 * 打错了不会报错 —— 会 404,而 404 在界面上和「这条数据不存在」长得一模一样。
 * 这里的路径和 `rice/docs/api/admin/` 逐条对得上,后端改路由时这些用例会先红。
 */

let mock: MockAdapter

beforeEach(() => {
  mock = new MockAdapter(instance)
  storage.setToken('tok')
  mock.onAny().reply(200, { data: {}, meta: { next_cursor: null } })
})

afterEach(() => mock.restore())

/**
 * 返回这次调用打出去的 `方法 路径`。
 *
 * 每次先清历史 —— axios-mock-adapter 的 history 是按方法分组的,
 * 跨方法拼起来不是时间序,「最后一条」会取错。
 */
async function called(run: () => Promise<unknown>) {
  mock.resetHistory()
  await run()

  const all = [...mock.history.get, ...mock.history.post, ...mock.history.put,
    ...mock.history.patch, ...mock.history.delete]

  expect(all).toHaveLength(1)
  return `${all[0].method?.toUpperCase()} ${all[0].url}`
}

describe('会话与密码', () => {
  it('两步登录打两个不同的路径', async () => {
    expect(await called(() => server.session.challenge({ phone: '138', password: 'p' })))
      .toBe('POST /api/admin/session/challenge')
    expect(await called(() => server.session.create({ phone: '138', password: 'p', code: '1' })))
      .toBe('POST /api/admin/session')
  })

  it('登出是 DELETE,不是再 POST 一次', async () => {
    expect(await called(() => server.session.destroy())).toBe('DELETE /api/admin/session')
  })

  it('找回密码', async () => {
    expect(await called(() => server.passwords.challenge({ phone: '138' })))
      .toBe('POST /api/admin/passwords/challenge')
    expect(await called(() => server.passwords.reset({ phone: '138', code: '1', password: 'p' })))
      .toBe('POST /api/admin/passwords')
  })
})

describe('管理员账号', () => {
  it('me 的读和改是同一个路径的两个方法', async () => {
    expect(await called(() => server.admins.me())).toBe('GET /api/admin/me')
    expect(await called(() => server.admins.updateMe({ nickname: 'x' }))).toBe('PATCH /api/admin/me')
  })

  it('增删查', async () => {
    expect(await called(() => server.admins.list())).toBe('GET /api/admin/admin_users')
    expect(await called(() => server.admins.create({ phone: '138' })))
      .toBe('POST /api/admin/admin_users')
    expect(await called(() => server.admins.remove('a1'))).toBe('DELETE /api/admin/admin_users/a1')
  })
})

// 四种资源同构,所以最容易出的错是复制粘贴时漏改一个词
describe('内容位', () => {
  const kinds = [
    ['apps', server.apps],
    ['banners', server.banners],
    ['announcements', server.announcements],
    ['nodes', server.nodes],
  ] as const

  it.each(kinds)('%s 的五个动作各打各的路径', async (kind, api) => {
    expect(await called(() => api.list())).toBe(`GET /api/admin/${kind}`)
    expect(await called(() => api.create({}))).toBe(`POST /api/admin/${kind}`)
    expect(await called(() => api.update('x1', {}))).toBe(`PATCH /api/admin/${kind}/x1`)
    expect(await called(() => api.remove('x1'))).toBe(`DELETE /api/admin/${kind}/x1`)
    expect(await called(() => api.reorder(['x1']))).toBe(`PUT /api/admin/${kind}/positions`)
  })

  // 排序必须排在 /:id 之前,否则 "positions" 会被当成一个 id
  it('排序用 PUT,body 是整份 ids 数组', async () => {
    await server.apps.reorder(['a', 'b'])

    expect(JSON.parse(mock.history.put[0].data)).toEqual({ ids: ['a', 'b'] })
  })
})

describe('用户与稻米', () => {
  it('用户列表和详情', async () => {
    expect(await called(() => server.users.list())).toBe('GET /api/admin/users')
    expect(await called(() => server.users.get('u1'))).toBe('GET /api/admin/users/u1')
  })

  // core 的 enable/disable/set-node/cancel-node 四个接口在这里是一个
  it('改管理位是 PATCH', async () => {
    expect(await called(() => server.users.update('u1', { disabled: true })))
      .toBe('PATCH /api/admin/users/u1')
  })

  it('PATCH 只送改了的那个位', async () => {
    await server.users.update('u1', { node_member: true })

    expect(JSON.parse(mock.history.patch[0].data)).toEqual({ node_member: true })
  })

  it('某人的稻米明细挂在用户下面', async () => {
    expect(await called(() => server.users.transfers('u1')))
      .toBe('GET /api/admin/users/u1/grain_transfers')
  })

  it('发放的发码和发放是两个路径', async () => {
    expect(await called(() => server.grants.challenge()))
      .toBe('POST /api/admin/grain_grants/challenge')
    expect(await called(() => server.grants.create({ to: ['a'], amount: 1, code: '1' })))
      .toBe('POST /api/admin/grain_grants')
  })
})

describe('提案与勋章', () => {
  it('提案', async () => {
    expect(await called(() => server.proposals.list())).toBe('GET /api/admin/proposals')
    expect(await called(() => server.proposals.get('p1'))).toBe('GET /api/admin/proposals/p1')
    expect(await called(() => server.proposals.setListed('p1', false)))
      .toBe('PATCH /api/admin/proposals/p1')
    expect(await called(() => server.proposals.removeComment('p1', 'c1')))
      .toBe('DELETE /api/admin/proposals/p1/comments/c1')
  })

  it('勋章', async () => {
    expect(await called(() => server.badges.list())).toBe('GET /api/admin/badges')
    expect(await called(() => server.badges.create({ name: 'x' }))).toBe('POST /api/admin/badges')
    expect(await called(() => server.badges.holders('b1')))
      .toBe('GET /api/admin/badges/b1/holders')
  })
})

describe('配置、模板与贴文', () => {
  it('配置的读和改是同一个路径', async () => {
    expect(await called(() => server.settings.get())).toBe('GET /api/admin/settings')
    expect(await called(() => server.settings.update({ fund_scale: 1 })))
      .toBe('PATCH /api/admin/settings')
  })

  it('模板', async () => {
    expect(await called(() => server.templates.get())).toBe('GET /api/admin/templates')
  })

  it('贴文列表、下架和恢复', async () => {
    const post = { uri: 'at://did:plc:abc/app.bsky.feed.post/123', cid: 'bafyc' } as Post

    expect(await called(() => server.posts.list({ tag: '#活动', page: 2 }))).toBe('GET /api/admin/posts')
    expect(await called(() => server.posts.takeDown(post))).toBe('POST /api/admin/post_takedowns')
    expect(await called(() => server.posts.restore(post))).toBe('DELETE /api/admin/post_takedowns')
  })

  // uri 放 body 不放路径 —— AT URI 里有斜杠,塞进路径要转义两遍;cid 一起定位到具体版本
  it('uri 和 cid 在 body 里,连 DELETE 也是', async () => {
    const post = { uri: 'at://did:plc:abc/app.bsky.feed.post/123', cid: 'bafyc', is_banned: false } as Post

    await server.posts.takeDown(post)
    await server.posts.restore(post)

    expect(JSON.parse(mock.history.post[0].data)).toEqual({ uri: post.uri, cid: 'bafyc' })
    expect(JSON.parse(mock.history.delete[0].data)).toEqual({ uri: post.uri, cid: 'bafyc' })
  })
})

describe('附件', () => {
  // 管理端令牌在 C 端那个上传口上是 401 —— 后台所有带图的表单都靠这条路径
  it('上传走管理端的上传口,不是 C 端那个', async () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' })

    expect(await called(() => server.attachments.upload(file)))
      .toBe('POST /api/admin/attachments')
  })

  it('上传带的是 multipart,kind 一起送', async () => {
    const file = new File(['x'], 'a.png', { type: 'image/png' })
    await server.attachments.upload(file, 'file')

    const body = mock.history.post[0].data as unknown as FormData
    expect(body.get('kind')).toBe('file')
    expect(body.get('file')).toBeInstanceOf(File)
  })

  // core 的附件 id 里编着文件类型(`2-abc`),取用前得先拆
  it('附件地址就是 id 拼出来的', () => {
    expect(server.attachments.url('3ke6kg3wk223e')).toBe('/api/attachments/3ke6kg3wk223e')
    expect(server.attachments.url(null)).toBe('')
  })
})
