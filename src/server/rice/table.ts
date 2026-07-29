import type { RicePage } from './client'

/**
 * ProTable 和 rice 之间的翻译。
 *
 * ProTable 给的是 `{current, pageSize}`,rice 认的是 `{page, per_page}`;
 * ProTable 要的是 `{data, total, success}`,rice 给的是 `{data, meta}`。
 * 13 个表格都要做这件事,所以放在一处 —— 抄 13 遍的话,漏掉一个 `total`
 * 的那个表格就只剩一页,而且不报错。
 */

export interface ProTableParams {
  current?: number
  pageSize?: number
  [key: string]: unknown
}

/** ProTable 的分页参数 → rice 的。 */
export function pageParams(params: ProTableParams) {
  const { current, pageSize, ...rest } = params

  return {
    ...dropEmpty(rest),
    page: current ?? 1,
    per_page: pageSize ?? 20,
  }
}

/** rice 的分页响应 → ProTable 的。 */
export function toProTable<T>(page: RicePage<T>) {
  return {
    data: page.data,
    // 页码模式下 meta.total 一定在。真没有时退回本页条数 —— 分页器会只显示一页,
    // 总比 undefined 让 ProTable 渲染出 NaN 页强。
    total: page.meta?.total ?? page.data.length,
    success: true,
  }
}

/**
 * 空字符串和 undefined 不该进 query。
 *
 * ProTable 的搜索框清空后给的是 `''`,原样发出去就成了 `?q=`,
 * 而 rice 那边 `q=""` 和不传 `q` 走的是同一条分支 —— 但别的过滤器未必,
 * 在这里统一丢掉更安全。
 */
function dropEmpty(params: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined && value !== null),
  )
}

/** 一次性把 ProTable 的 request 接到一个 rice 列表接口上。 */
export function tableRequest<T>(fetch: (query: ReturnType<typeof pageParams>) => Promise<RicePage<T>>) {
  return async (params: ProTableParams) => toProTable(await fetch(pageParams(params)))
}
