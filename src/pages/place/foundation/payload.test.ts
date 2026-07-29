import { describe, expect, it } from 'vitest'
import { toSettingsPayload } from './payload'

/**
 * `document_ids` 是整份替换。这里区分不清「没传」和「传了空」的话,
 * 运营改一下金库金额就会把十份公开的财务文件删光,而界面上只显示「编辑成功」。
 */
describe('toSettingsPayload', () => {
  it('字段没出现时不传这个键 —— 让服务端别动', () => {
    expect(toSettingsPayload({ fund_scale: 100 })).toEqual({ fund_scale: 100 })
    expect(toSettingsPayload({ fund_scale: 100, document_ids: undefined }))
      .not.toHaveProperty('document_ids')
    expect(toSettingsPayload({ fund_scale: 100, document_ids: null }))
      .not.toHaveProperty('document_ids')
  })

  // 反过来也不能一刀切成「空就不传」—— 那样运营就永远删不掉最后一份文件
  it('空数组要传出去 —— 那是「全删掉」的意思', () => {
    expect(toSettingsPayload({ document_ids: [] })).toEqual({
      fund_scale: undefined,
      document_ids: [],
    })
  })

  it('有值时原样传,顺序就是展示顺序', () => {
    expect(toSettingsPayload({ fund_scale: 1, document_ids: ['a', 'b'] })).toEqual({
      fund_scale: 1,
      document_ids: ['a', 'b'],
    })
  })

  // maxCount=1 的上传控件给的是裸字符串
  it('单个字符串包成数组', () => {
    expect(toSettingsPayload({ document_ids: 'only' })).toEqual({
      fund_scale: undefined,
      document_ids: ['only'],
    })
  })

  it('空字符串当成空数组,不是 [""]', () => {
    expect(toSettingsPayload({ document_ids: '' })).toEqual({
      fund_scale: undefined,
      document_ids: [],
    })
  })
})
