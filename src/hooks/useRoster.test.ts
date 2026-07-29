import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const parseRecipients = vi.hoisted(() => vi.fn())
vi.mock('@/utils/recipients', () => ({ parseRecipients }))
vi.mock('antd', () => ({ message: { error: vi.fn(), success: vi.fn() } }))

const { useRoster } = await import('./useRoster')

/**
 * 这份名单决定钱和勋章发给谁。它错了不会报错 —— 会静静地发给上一批人,
 * 而界面上显示的是新文件名。
 */
const labels = {
  empty: '名单是空的',
  failed: '解析失败',
  ok: (n: number) => `读到 ${n} 个`,
}

const file = (name: string) => new File([''], name)

beforeEach(() => {
  parseRecipients.mockReset()
})

describe('useRoster', () => {
  it('选中一份名单', async () => {
    parseRecipients.mockResolvedValue(['13800000001', '13800000002'])
    const { result } = renderHook(() => useRoster(labels))

    await act(() => result.current.select(file('名单.xlsx')))

    expect(result.current.recipients).toEqual(['13800000001', '13800000002'])
    expect(result.current.fileName).toBe('名单.xlsx')
    expect(result.current.parsing).toBe(false)
  })

  // 只弹个错就返回的话,recipients 还留着上一份,点确认发的是旧名单
  it('再选一个空文件时,旧名单被清掉', async () => {
    parseRecipients.mockResolvedValueOnce(['13800000001'])
    const { result } = renderHook(() => useRoster(labels))
    await act(() => result.current.select(file('好名单.xlsx')))
    expect(result.current.recipients).toHaveLength(1)

    parseRecipients.mockResolvedValueOnce([])
    await act(() => result.current.select(file('空的.xlsx')))

    expect(result.current.recipients).toEqual([])
    expect(result.current.fileName).toBe('')
  })

  it('再选一个坏文件时,旧名单也被清掉', async () => {
    parseRecipients.mockResolvedValueOnce(['13800000001'])
    const { result } = renderHook(() => useRoster(labels))
    await act(() => result.current.select(file('好名单.xlsx')))

    parseRecipients.mockRejectedValueOnce(new Error('不是 Excel'))
    await act(() => result.current.select(file('坏的.docx')))

    expect(result.current.recipients).toEqual([])
    expect(result.current.fileName).toBe('')
  })

  // 连着选两个文件,先解析完的未必是后选的那个
  it('迟到的解析结果盖不住后选的文件', async () => {
    let resolveFirst: (v: string[]) => void = () => {}
    parseRecipients.mockImplementationOnce(
      () => new Promise<string[]>(resolve => (resolveFirst = resolve)),
    )
    parseRecipients.mockResolvedValueOnce(['第二份'])

    const { result } = renderHook(() => useRoster(labels))

    let firstSelect: Promise<void>
    act(() => {
      firstSelect = result.current.select(file('先选的.xlsx'))
    })
    await act(() => result.current.select(file('后选的.xlsx')))

    expect(result.current.recipients).toEqual(['第二份'])
    expect(result.current.fileName).toBe('后选的.xlsx')

    // 第一份现在才解析完 —— 它必须被丢掉
    await act(async () => {
      resolveFirst(['第一份'])
      await firstSelect
    })

    expect(result.current.recipients).toEqual(['第二份'])
    expect(result.current.fileName).toBe('后选的.xlsx')
  })

  it('解析期间 parsing 为真 —— 调用方靠它禁用确认按钮', async () => {
    let resolve: (v: string[]) => void = () => {}
    parseRecipients.mockImplementationOnce(
      () => new Promise<string[]>(r => (resolve = r)),
    )

    const { result } = renderHook(() => useRoster(labels))

    let pending: Promise<void>
    act(() => {
      pending = result.current.select(file('慢.xlsx'))
    })

    await waitFor(() => expect(result.current.parsing).toBe(true))
    // 解析没完的时候,名单是空的 —— 这时点确认不会发出上一份
    expect(result.current.recipients).toEqual([])

    await act(async () => {
      resolve(['13800000001'])
      await pending
    })

    expect(result.current.parsing).toBe(false)
  })

  it('reset 之后回到干净状态,并丢弃在飞的解析', async () => {
    let resolve: (v: string[]) => void = () => {}
    parseRecipients.mockImplementationOnce(
      () => new Promise<string[]>(r => (resolve = r)),
    )

    const { result } = renderHook(() => useRoster(labels))
    let pending: Promise<void>
    act(() => {
      pending = result.current.select(file('慢.xlsx'))
    })

    act(() => result.current.reset())

    await act(async () => {
      resolve(['来晚了'])
      await pending
    })

    expect(result.current.recipients).toEqual([])
    expect(result.current.parsing).toBe(false)
  })
})
