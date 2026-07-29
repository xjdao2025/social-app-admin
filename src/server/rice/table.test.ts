import { describe, expect, it, vi } from 'vitest'
import { pageParams, tableRequest, toProTable } from './table'

/**
 * 分页模型换了:core 是 `{pageNum, pageSize}` + `{items, total}`,
 * rice 是 `{page, per_page}` + `{data, meta}`。
 *
 * 这一层错了的表现很安静 —— 表格照常渲染,只是永远停在第一页,或者搜索条件
 * 根本没发出去。所以这里逐条钉住。
 */

describe('pageParams', () => {
  it('current/pageSize 换成 page/per_page', () => {
    expect(pageParams({ current: 3, pageSize: 15 })).toEqual({ page: 3, per_page: 15 })
  })

  it('ProTable 第一次不给 current 时按第 1 页', () => {
    expect(pageParams({})).toEqual({ page: 1, per_page: 20 })
  })

  it('搜索条件原样带过去', () => {
    expect(pageParams({ current: 1, pageSize: 10, q: '张三', disabled: 'true' })).toEqual({
      page: 1,
      per_page: 10,
      q: '张三',
      disabled: 'true',
    })
  })

  // 搜索框清空后 ProTable 给的是 '',发出去就成了 ?q=
  it('空值不进 query', () => {
    expect(pageParams({ current: 1, pageSize: 10, q: '', node_member: undefined })).toEqual({
      page: 1,
      per_page: 10,
    })
  })

  it('false 和 0 要留下 —— 它们是有意义的过滤条件', () => {
    expect(pageParams({ current: 1, pageSize: 10, node_member: false, amount: 0 })).toEqual({
      page: 1,
      per_page: 10,
      node_member: false,
      amount: 0,
    })
  })
})

describe('toProTable', () => {
  it('把 meta.total 交给分页器', () => {
    const result = toProTable({
      data: [{ id: 'a' }, { id: 'b' }],
      meta: { next_cursor: null, total: 137, page: 1, per_page: 2 },
    })

    expect(result).toEqual({ data: [{ id: 'a' }, { id: 'b' }], total: 137, success: true })
  })

  // 没有 total 时 ProTable 会拿 undefined 去算页数,渲染出 NaN
  it('没有 total 时退回本页条数,而不是 undefined', () => {
    const result = toProTable({ data: [{ id: 'a' }], meta: { next_cursor: null } })

    expect(result.total).toBe(1)
  })

  it('空列表也是成功', () => {
    const result = toProTable({ data: [], meta: { next_cursor: null, total: 0 } })

    expect(result).toEqual({ data: [], total: 0, success: true })
  })
})

describe('tableRequest', () => {
  it('把两头接起来', async () => {
    const fetch = vi.fn().mockResolvedValue({
      data: [{ id: 'a' }],
      meta: { next_cursor: null, total: 9 },
    })

    const result = await tableRequest(fetch)({ current: 2, pageSize: 5, q: '王' })

    expect(fetch).toHaveBeenCalledWith({ page: 2, per_page: 5, q: '王' })
    expect(result).toEqual({ data: [{ id: 'a' }], total: 9, success: true })
  })
})
