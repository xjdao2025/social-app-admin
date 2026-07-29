import axios, { type AxiosError } from 'axios'

/**
 * post 服务。**不经过 rice**,也从来没经过 core —— 管理端一直是直连的。
 *
 * 只用来读贴文列表。下架和恢复走 rice 的 `/api/admin/post_takedowns` 代理:
 * 那一步要 post 服务的管理凭据,不该下发到浏览器。
 *
 * 开发时它指向哪由 `VITE_POST_ORIGIN` 决定(见 `vite.config.ts`)。默认那个
 * 线上地址在有些网络下根本不可达 —— 所以这里的超时要短,失败要说得清楚,
 * 不能让页面白等半分钟再往控制台扔一个没人接的 Promise。
 */
const instance = axios.create({
  baseURL: '/post',
  // 这是一个列表请求,人在等着。连不上就早点说,别耗满 30 秒。
  timeout: 10_000,
  paramsSerializer: { indexes: null },
})

/** post 服务的失败。和 `RiceError` 分开 —— 它是另一个服务,错误形状也不一样。 */
export class PostServiceError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'PostServiceError'
    this.status = status
  }
}

export interface PostAuthor {
  did: string
  handle?: string
  displayName?: string
  avatar?: string
}

export interface Post {
  uri: string
  cid: string
  author?: PostAuthor
  record?: Record<string, unknown>
  labels?: string[]
  is_banned?: boolean
  indexedAt?: string
  [key: string]: unknown
}

export interface PostListResponse {
  posts: Post[]
  total: number
}

/**
 * 贴文列表。
 *
 * `ban_labels: ['blacklist']` 是排除已下架的 —— rice 的下架就是给贴文
 * 打上这个标签。
 */
export async function listPosts(params: Record<string, unknown>): Promise<PostListResponse> {
  try {
    const { data } = await instance.post('/api/posts/list', params)
    return data
  } catch (error) {
    throw toPostError(error as AxiosError)
  }
}

function toPostError(error: AxiosError): PostServiceError {
  // 超时和连不上都没有 response。这跟"服务端返回了一个错误"是两回事,
  // 说成"服务出错了"会让人去查服务端日志,而那边可能压根没收到请求。
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return new PostServiceError('贴文服务没有响应，请检查网络或服务地址', 0)
  }

  if (!error.response) {
    return new PostServiceError('连不上贴文服务', 0)
  }

  return new PostServiceError(`贴文服务返回 ${error.response.status}`, error.response.status)
}

/** 导出实例是为了测试能拦住它 —— MockAdapter 挂在全局 axios 上拦不到自建实例。 */
export { instance }

export default { listPosts }
