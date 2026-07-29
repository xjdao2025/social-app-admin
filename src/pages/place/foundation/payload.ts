/**
 * 金库配置表单 → `PATCH /api/admin/settings` 的 body。
 *
 * 单独拎出来是因为这里错了是**破坏性**的:`document_ids` 是整份替换,
 * 而 rice 那边「不传这个键」才等于「别动」。三种情况必须分清:
 *
 *   * 字段没出现(表单还没加载好、控件没注册)→ **不传**,别动服务端的
 *   * 字段是空数组(运营真的把文件全删了)→ **传空数组**,照他说的做
 *   * 字段有值 → 传值,顺序即展示顺序
 *
 * 把前两种混起来的代价不对称:少传一次,运营再点一下保存就是了;
 * 多传一个空数组,十份公开的财务文件就没了,而界面上只显示「编辑成功」。
 */
export interface FoundationFields {
  fund_scale?: number
  document_ids?: string | string[] | null
}

export function toSettingsPayload(fields: FoundationFields) {
  const documentIds = normalizeIds(fields.document_ids)

  return {
    fund_scale: fields.fund_scale,
    ...(documentIds === undefined ? {} : { document_ids: documentIds }),
  }
}

function normalizeIds(value: FoundationFields['document_ids']): string[] | undefined {
  if (value === undefined || value === null) return undefined
  // maxCount=1 的控件给的是一个裸字符串,不是数组
  if (typeof value === 'string') return value ? [value] : []
  return value
}
