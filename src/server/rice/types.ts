/**
 * rice 的响应类型。字段名照抄接口文档(`rice/docs/api/`),不做驼峰化 ——
 * 两头对不上时,能直接拿字段名去搜文档和后端代码。
 *
 * 主键是 TSID:13 个字符的**字符串**,不是自增整数。别用 number 接。
 */

/** 附件。没有附件的地方是 null,不是空对象。 */
export interface Attachment {
  id: string
  kind: 'image' | 'file'
  filename: string
  content_type: string | null
  byte_size: number | null
  url: string
}

/** 别人看到的用户。 */
export interface PublicUser {
  id: string
  did: string
  handle: string
  nickname: string
  bio: string | null
  avatar: Attachment | null
  node_member: boolean
}

/** 后台看到的用户 —— 多了联系方式、余额和停用状态。 */
export interface AdminUser extends PublicUser {
  grain_balance: number
  email: string | null
  phone: string | null
  phone_region: string | null
  disabled: boolean
  disabled_at: string | null
  inserted_at: string
}

/** 管理员。和 C 端用户是两张表,没有 DID。 */
export interface Admin {
  id: string
  nickname: string
  email: string | null
  phone: string | null
  phone_region: string | null
  role: 'admin' | 'operator'
  superuser: boolean
  avatar: Attachment | null
  last_login_at: string | null
  inserted_at: string
}

export interface AdminSession {
  token: string
  admin: Admin
}

/** 新建管理员时多一个初始密码 —— 只有这一次能看到。 */
export interface CreatedAdmin extends Admin {
  initial_password: string
}

export interface App {
  id: string
  name: string
  description: string | null
  url: string | null
  position: number
  logo: Attachment | null
  inserted_at: string
}

export interface Banner {
  id: string
  url: string | null
  position: number
  image: Attachment | null
  inserted_at: string
}

export interface Announcement {
  id: string
  title: string
  position: number
  attachment: Attachment | null
  inserted_at: string
}

export interface Node {
  id: string
  name: string
  description: string | null
  position: number
  logo: Attachment | null
  owner: (PublicUser & { grain_balance: number }) | null
  inserted_at: string
}

export type CatalogKind = 'apps' | 'banners' | 'announcements' | 'nodes'

/** 一笔稻米发放。发放没有付款人,所以没有 from。 */
export interface Grant {
  id: string
  amount: number
  memo: string | null
  to: (PublicUser & { email: string | null; phone: string | null; phone_region: string | null }) | null
  inserted_at: string
}

/** 一笔转账。`direction` 是相对被查看者算的,不是相对登录的管理员。 */
export interface Transfer {
  id: string
  kind: 'grant' | 'reward' | 'gift'
  amount: number
  memo: string | null
  subject_uri: string | null
  from: PublicUser | null
  to: PublicUser | null
  direction: 'in' | 'out' | null
  inserted_at: string
}

export interface Comment {
  id: string
  body: string
  author: PublicUser | null
  inserted_at: string
}

/** 后台看到的提案 —— 多了 listed 和 deleted_at,没有 my_vote。 */
export interface Proposal {
  id: string
  title: string
  status: 'open' | 'passed' | 'rejected'
  listed: boolean
  closes_at: string
  agree_count: number
  oppose_count: number
  total_votes: number
  attachment: Attachment | null
  author: PublicUser | null
  deleted_at: string | null
  inserted_at: string
}

export interface ProposalDetail extends Proposal {
  comments: Comment[]
}

export interface Badge {
  id: string
  name: string
  image: Attachment | null
  /** 现算的持有人数。新建返回的对象上是 null。 */
  holder_count: number | null
  inserted_at: string
}

export interface BadgeHolder extends PublicUser {
  email: string | null
  phone: string | null
  awarded_at: string
}

export interface SiteSettings {
  fund_scale: number
  issued_grain_scale: number
  proposal_approval_votes: number
  documents: Attachment[]
}

export interface Templates {
  grain_distribution: Attachment | null
  badge_distribution: Attachment | null
}

/** 后台列表的通用查询参数。 */
export interface PageQuery {
  page?: number
  per_page?: number
  [key: string]: unknown
}

/** 贴文:AppView 的 postView,加上审核服务给的下架状态。 */
export interface Post {
  uri: string
  cid: string
  author: { did: string; handle?: string; displayName?: string; avatar?: string }
  record?: Record<string, unknown>
  indexedAt?: string
  is_banned: boolean
  [key: string]: unknown
}

/** 后台贴文列表的筛选:正文、发布方(DID 或 handle)、标签、时间范围(sortAt)、是否已下架。 */
export interface PostQuery extends PageQuery {
  q?: string
  author?: string
  tag?: string
  since?: string
  until?: string
  taken_down?: boolean
}
