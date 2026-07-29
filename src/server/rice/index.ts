import { rice, type RicePage, type RiceRequestConfig } from './client'
import type {
  Admin,
  AdminSession,
  AdminUser,
  Announcement,
  App,
  Attachment,
  Badge,
  BadgeHolder,
  Banner,
  CatalogKind,
  CreatedAdmin,
  Grant,
  Node,
  PageQuery,
  Proposal,
  ProposalDetail,
  SiteSettings,
  Templates,
  Transfer,
} from './types'

/**
 * rice 管理端接口。一组对应 rice 的一个控制器,和 `rice/docs/api/admin/` 一一对上。
 *
 * core 那套是 56 个动词式 POST(`/admin/user-manage/user/enable`),这里是 REST:
 * 同一件事的不同参数合成一个接口,所以调用点比原来少。
 */

const ANON: RiceRequestConfig = { anonymous: true, keepSessionOnUnauthorized: true }

/** 登录、登出。两步:先验密码换验证码,再拿密码 + 验证码换令牌。 */
export const session = {
  /**
   * 第一步:验密码,对了才发短信验证码。
   *
   * core 是 `login-with-password` 只回一个 bool,验证码要前端自己去调**公开的**
   * `/sms/send` —— 不知道密码也能让管理员的手机响。这里发码在密码验过之后。
   */
  challenge: (params: { phone: string; phone_region?: string; password: string }) =>
    rice.post<void>('/api/admin/session/challenge', params, ANON),

  /** 第二步:密码要再传一遍 —— 只有验证码不够。 */
  create: (params: {
    phone: string
    phone_region?: string
    password: string
    code: string
  }) => rice.post<AdminSession>('/api/admin/session', params, ANON),

  destroy: () => rice.delete('/api/admin/session'),
}

/** 管理员忘记密码。只走手机号 —— 邮箱没有对应的登录入口。 */
export const passwords = {
  challenge: (params: { phone: string; phone_region?: string }) =>
    rice.post<void>('/api/admin/passwords/challenge', params, ANON),

  reset: (params: {
    phone: string
    phone_region?: string
    code: string
    password: string
  }) => rice.post<void>('/api/admin/passwords', params, ANON),
}

/** 管理员账号。除了 me 那两个,其余只有 role=admin 能进(服务端强制)。 */
export const admins = {
  me: () => rice.get<Admin>('/api/admin/me'),

  updateMe: (params: { nickname?: string; avatar_id?: string | null }) =>
    rice.patch<Admin>('/api/admin/me', params),

  list: (query?: PageQuery) => rice.page<Admin>('/api/admin/admin_users', query),

  /** 返回的对象上带 `initial_password`,只有这一次能看到。 */
  create: (params: {
    phone: string
    phone_region?: string
    email?: string
    nickname?: string
    role?: 'admin' | 'operator'
  }) => rice.post<CreatedAdmin>('/api/admin/admin_users', params),

  remove: (id: string) => rice.delete(`/api/admin/admin_users/${id}`),
}

/**
 * 应用入口 / 轮播位 / 公告 / 节点。四种资源的后台操作完全同构,
 * 所以是同一组函数带一个 kind。
 *
 * core 那边是 4 × 6 = 24 个接口。
 */
export const catalog = {
  list: <T>(kind: CatalogKind) => rice.get<T[]>(`/api/admin/${kind}`),
  get: <T>(kind: CatalogKind, id: string) => rice.get<T>(`/api/admin/${kind}/${id}`),
  create: <T>(kind: CatalogKind, params: object) => rice.post<T>(`/api/admin/${kind}`, params),
  update: <T>(kind: CatalogKind, id: string, params: object) =>
    rice.patch<T>(`/api/admin/${kind}/${id}`, params),
  remove: (kind: CatalogKind, id: string) => rice.delete(`/api/admin/${kind}/${id}`),

  /** 整份顺序覆盖,数组顺序即位置。一个事务里做完,不会排到一半。 */
  reorder: <T>(kind: CatalogKind, ids: string[]) =>
    rice.put<T[]>(`/api/admin/${kind}/positions`, { ids }),
}

export const apps = {
  list: () => catalog.list<App>('apps'),
  create: (params: object) => catalog.create<App>('apps', params),
  update: (id: string, params: object) => catalog.update<App>('apps', id, params),
  remove: (id: string) => catalog.remove('apps', id),
  reorder: (ids: string[]) => catalog.reorder<App>('apps', ids),
}

export const banners = {
  list: () => catalog.list<Banner>('banners'),
  create: (params: object) => catalog.create<Banner>('banners', params),
  update: (id: string, params: object) => catalog.update<Banner>('banners', id, params),
  remove: (id: string) => catalog.remove('banners', id),
  reorder: (ids: string[]) => catalog.reorder<Banner>('banners', ids),
}

export const announcements = {
  list: () => catalog.list<Announcement>('announcements'),
  get: (id: string) => catalog.get<Announcement>('announcements', id),
  create: (params: object) => catalog.create<Announcement>('announcements', params),
  update: (id: string, params: object) => catalog.update<Announcement>('announcements', id, params),
  remove: (id: string) => catalog.remove('announcements', id),
  reorder: (ids: string[]) => catalog.reorder<Announcement>('announcements', ids),
}

export const nodes = {
  list: () => catalog.list<Node>('nodes'),
  create: (params: object) => catalog.create<Node>('nodes', params),
  update: (id: string, params: object) => catalog.update<Node>('nodes', id, params),
  remove: (id: string) => catalog.remove('nodes', id),
  reorder: (ids: string[]) => catalog.reorder<Node>('nodes', ids),
}

/**
 * 后台用户管理。
 *
 * core 的 9 个接口在这里是 3 个:一个带过滤的列表、一个详情、一个改管理位的
 * PATCH。`enable`/`disable`/`set-node-user`/`cancel-node-user` 是同一行上的
 * 两个布尔位。
 */
export const users = {
  list: (query?: PageQuery & { q?: string; node_member?: boolean; disabled?: boolean }) =>
    rice.page<AdminUser>('/api/admin/users', query),

  get: (id: string) => rice.get<AdminUser>(`/api/admin/users/${id}`),

  /** 停用会**同时撤销该用户的全部令牌** —— core 只改标记,JWT 还能用满 30 天。 */
  update: (id: string, params: { disabled?: boolean; node_member?: boolean }) =>
    rice.patch<AdminUser>(`/api/admin/users/${id}`, params),

  transfers: (id: string, query?: PageQuery) =>
    rice.page<Transfer>(`/api/admin/users/${id}/grain_transfers`, query),
}

/** 发放稻米。core 的 single / batch 在这里是同一个接口 —— 收款人永远是数组。 */
export const grants = {
  list: (query?: PageQuery & { q?: string; since?: string; until?: string }) =>
    rice.page<Grant>('/api/admin/grain_grants', query),

  /**
   * 全有或全无:任何一个收款人解析不出来,整批都不发。
   *
   * `to` 里可以混着写手机号 / 邮箱 / handle / DID / id;空字符串会被丢掉。
   */
  create: (params: { to: string[]; amount: number; memo?: string }) =>
    rice.post<{ granted: number }>('/api/admin/grain_grants', params),
}

/** 提案审核。列表看得到已下架的 —— C 端那份看不到。 */
export const proposals = {
  list: (query?: PageQuery & { status?: string; listed?: boolean; q?: string }) =>
    rice.page<Proposal>('/api/admin/proposals', query),

  /** 详情带前 100 条评论。 */
  get: (id: string) => rice.get<ProposalDetail>(`/api/admin/proposals/${id}`),

  /** 下架 / 恢复。core 的 take-off 只能单向下架。 */
  setListed: (id: string, listed: boolean) =>
    rice.patch<ProposalDetail>(`/api/admin/proposals/${id}`, { listed }),

  /** 删任意评论。C 端只能删自己的。 */
  removeComment: (proposalId: string, commentId: string) =>
    rice.delete(`/api/admin/proposals/${proposalId}/comments/${commentId}`),
}

export const badges = {
  list: (query?: PageQuery) => rice.page<Badge>('/api/admin/badges', query),

  create: (params: { name: string; image_id?: string }) =>
    rice.post<Badge>('/api/admin/badges', params),

  holders: (badgeId: string, query?: PageQuery & { q?: string }) =>
    rice.page<BadgeHolder>(`/api/admin/badges/${badgeId}/holders`, query),
}

/** 全站配置。core 的 detail + 两个 modify 改的是同一行。 */
export const settings = {
  get: () => rice.get<SiteSettings>('/api/admin/settings'),

  /** `document_ids` 传了就是整份替换,顺序即展示顺序;不传则完全不动。 */
  update: (params: {
    fund_scale?: number
    issued_grain_scale?: number
    proposal_approval_votes?: number
    document_ids?: string[]
  }) => rice.patch<SiteSettings>('/api/admin/settings', params),
}

export const templates = {
  get: () => rice.get<Templates>('/api/admin/templates'),
}

/**
 * 贴文下架 / 恢复。贴文不在 rice 库里,这只是一层代理 ——
 * 意义是 post 服务的管理凭据不必下发到浏览器。
 *
 * uri 放 body 不放路径:AT URI 里有斜杠。
 */
export const posts = {
  takeDown: (uri: string) => rice.post<void>('/api/admin/post_takedowns', { uri }),
  restore: (uri: string) => rice.delete('/api/admin/post_takedowns', { data: { uri } }),
}

/** 附件上传。**要登录** —— core 的上传接口是 AllowAnonymous。 */
export const attachments = {
  upload: (file: File, kind: 'image' | 'file' = 'image') => {
    const form = new FormData()
    form.append('file', file)
    form.append('kind', kind)

    return rice.post<Attachment>('/api/attachments', form)
  },

  /** 附件的可访问地址。响应里本来就有 `url`,这个用于只拿到 id 的地方。 */
  url: (id: string | null | undefined) => (id ? `/api/attachments/${id}` : ''),
}

const server = {
  session,
  passwords,
  admins,
  catalog,
  apps,
  banners,
  announcements,
  nodes,
  users,
  grants,
  proposals,
  badges,
  settings,
  templates,
  posts,
  attachments,
}

export default server
export type { RicePage }
export * from './types'
export { RiceError } from './errors'
export { setUnauthorizedHandler } from './client'
