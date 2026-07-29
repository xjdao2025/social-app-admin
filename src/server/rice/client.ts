import axios, { type AxiosRequestConfig } from 'axios'
import storage from '@/utils/stroage'
import { RiceError, toRiceError } from './errors'

/**
 * rice 的 HTTP 客户端。
 *
 * 和 core 那套的三个区别:
 *
 * 1. **`Bearer` 前缀。** core 的管理端把裸令牌直接塞进 `Authorization`,
 *    rice 只认标准写法。
 * 2. **没有 `{code, message, data}` 信封。** core 的 HTTP 永远 200,成败靠信封里的
 *    `code` 判断;rice 用 HTTP 状态码,body 是 `{data}` 或 `{errors}`。
 * 3. **管理端令牌和 C 端令牌是两套。** 这里只处理管理端那套。
 */
const instance = axios.create({
  baseURL: '/',
  timeout: 30_000,
  paramsSerializer: { indexes: null },
})

/** 401 时怎么办。由 store 注入,免得这一层反过来依赖 store。 */
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler
}

export interface RiceRequestConfig extends AxiosRequestConfig {
  /** 不带令牌(登录、找回密码这些匿名接口)。 */
  anonymous?: boolean
  /** 401 时不要触发登出 —— 登录页自己处理。 */
  keepSessionOnUnauthorized?: boolean
}

/** 列表响应的 meta。后台表格走页码,所以 total 一定在。 */
export interface RiceMeta {
  next_cursor: string | null
  total?: number
  page?: number
  per_page?: number
}

export interface RicePage<T> {
  data: T[]
  meta: RiceMeta
}

async function call<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  config: RiceRequestConfig = {},
): Promise<T> {
  const { anonymous, keepSessionOnUnauthorized, headers, ...rest } = config

  const token = anonymous ? null : storage.getToken()

  try {
    const response = await instance({
      ...rest,
      method,
      url,
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    // 204 没有 body。调用方拿到的是 undefined,不是空字符串。
    return (response.status === 204 ? undefined : response.data) as T
  } catch (error) {
    const riceError = toRiceError(error as never)

    if (riceError.status === 401 && !keepSessionOnUnauthorized) {
      onUnauthorized?.()
    }

    throw riceError
  }
}

/** 取整个 body(含 meta),列表接口用。 */
export function requestPage<T>(url: string, params?: object, config?: RiceRequestConfig) {
  return call<RicePage<T>>('get', url, { ...config, params })
}

/** 只要 `data`,单个资源用。 */
async function unwrap<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  config?: RiceRequestConfig,
): Promise<T> {
  const body = await call<{ data: T } | undefined>(method, url, config)
  return body?.data as T
}

export const rice = {
  get: <T>(url: string, params?: object, config?: RiceRequestConfig) =>
    unwrap<T>('get', url, { ...config, params }),

  post: <T>(url: string, data?: unknown, config?: RiceRequestConfig) =>
    unwrap<T>('post', url, { ...config, data }),

  put: <T>(url: string, data?: unknown, config?: RiceRequestConfig) =>
    unwrap<T>('put', url, { ...config, data }),

  patch: <T>(url: string, data?: unknown, config?: RiceRequestConfig) =>
    unwrap<T>('patch', url, { ...config, data }),

  /** 删除一般是 204,没有 body。 */
  delete: (url: string, config?: RiceRequestConfig) => call<void>('delete', url, config),

  page: requestPage,
}

export { RiceError }
export default instance
