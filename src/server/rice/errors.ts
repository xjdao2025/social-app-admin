import type { AxiosError } from 'axios'

/**
 * rice 的错误响应形状。
 *
 * `detail` 是一句整体的话,字段错误则是按字段分组的数组:
 *
 *     {"errors": {"detail": "未认证"}}
 *     {"errors": {"phone": ["必须填手机号"], "role": ["只能是 admin 或 operator"]}}
 *
 * core 那套 `{code, message, data}` 信封没有了 —— HTTP 状态码本身表达结果。
 */
export type RiceErrors = Record<string, string | string[]>

export interface RiceErrorBody {
  errors?: RiceErrors
}

/** 请求失败时抛这个,而不是把 AxiosError 泄露到页面里。 */
export class RiceError extends Error {
  readonly status: number
  /** 按字段分组的错误,给表单 setFields 用。没有字段级错误时是空对象。 */
  readonly fields: Record<string, string[]>

  constructor(message: string, status: number, fields: Record<string, string[]> = {}) {
    super(message)
    this.name = 'RiceError'
    this.status = status
    this.fields = fields
  }
}

const STATUS_FALLBACK: Record<number, string> = {
  400: '请求格式不正确',
  401: '请登录',
  403: '没有权限',
  404: '不存在',
  422: '提交的内容不合法',
  429: '操作过于频繁，请稍后再试',
  500: '服务器出错了',
  502: '依赖的服务出错了',
  503: '依赖的服务未配置',
}

/**
 * 把 rice 的错误 body 拆成「一句给人看的话」和「按字段分组的明细」。
 *
 * 字段错误也要拼进消息里 —— 不然表单外的调用点(比如一个 Popconfirm)
 * 就只能弹一句「提交的内容不合法」,而真正的原因躺在 body 里没人看。
 */
export function parseErrors(body: RiceErrorBody | undefined, status: number): RiceError {
  const errors = body?.errors

  if (!errors) {
    return new RiceError(STATUS_FALLBACK[status] ?? '请求失败', status)
  }

  const fields: Record<string, string[]> = {}
  const messages: string[] = []

  for (const [key, value] of Object.entries(errors)) {
    const list = Array.isArray(value) ? value.map(String) : [String(value)]

    if (key === 'detail') {
      messages.push(...list)
    } else {
      fields[key] = list
      messages.push(...list)
    }
  }

  const message = messages.filter(Boolean).join('；') || STATUS_FALLBACK[status] || '请求失败'
  return new RiceError(message, status, fields)
}

/** axios 的失败(含网络层失败)统一转成 RiceError。 */
export function toRiceError(error: AxiosError<RiceErrorBody>): RiceError {
  const status = error.response?.status

  // 没有 response 就是压根没连上 —— 这跟「服务端返回了一个错误」是两回事,
  // 提示语也不该一样。
  if (status === undefined) {
    return new RiceError('无法连接到服务器', 0)
  }

  return parseErrors(error.response?.data, status)
}
