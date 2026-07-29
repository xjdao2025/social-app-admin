import axios from 'axios'

/**
 * post 服务。**不经过 rice**,也从来没经过 core —— 管理端一直是直连的。
 *
 * 只用来读贴文列表。下架和恢复走 rice 的 `/api/admin/post_takedowns` 代理:
 * 那一步要 post 服务的管理凭据,不该下发到浏览器。
 */
const instance = axios.create({
  baseURL: '/post',
  timeout: 30_000,
  paramsSerializer: { indexes: null },
})

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
  const { data } = await instance.post('/api/posts/list', params)
  return data
}

export default { listPosts }
