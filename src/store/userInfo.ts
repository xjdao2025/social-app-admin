import { create } from 'zustand'
import throttle from 'lodash/throttle'
import createSelectors from '@/store/helper/createSelectors'
import storage from '@/utils/stroage'
import server, { setUnauthorizedHandler, type Admin, type AdminSession } from '@/server/rice'

interface UserInfoStore {
  token?: string
  /** 当前登录的管理员。没登录或还没拉到时是 null。 */
  userInfo: Admin | null
  fetchUserInfo: ReturnType<typeof throttle<() => Promise<void>>>
  logout: () => void
  login: (session: AdminSession) => void
}

const useUserInfoStore = createSelectors(
  create<UserInfoStore>((set, get) => ({
    token: storage.getToken() ?? '',
    userInfo: null,

    fetchUserInfo: throttle(
      async () => {
        const userInfo = await server.admins.me()
        set(() => ({ userInfo }))
      },
      1000,
      { leading: true, trailing: false },
    ),

    /**
     * 登出会**告诉服务端**,不只是清本地。
     *
     * rice 的令牌是可撤销的(库里存 sha256,删行即失效),不像 JWT 只能等过期 ——
     * 只清本地等于把一把还能用的钥匙留在世界上。
     */
    logout: () => {
      // 撤销请求要在清本地**之前**发出去 —— 客户端是从 storage 里取令牌的,
      // 先清掉的话这个请求就成了一个没带令牌的 401,服务端那把钥匙还留着。
      // 不 await:撤销失败也不该把人卡在已登录状态里。
      if (get().token) {
        server.session.destroy().catch(() => {})
      }

      storage.removeToken()
      set(() => ({ userInfo: null, token: '' }))
    },

    /** 登录成功后:存令牌 + 记下管理员。`admin` 登录响应里就有,不必再拉一次。 */
    login: (session: AdminSession) => {
      storage.setToken(session.token)
      set(() => ({ token: session.token, userInfo: session.admin }))
    },
  })),
)

/**
 * 401 时清掉本地会话。
 *
 * 挂在这里而不是 client 里,是为了让 client 不反过来依赖 store —— 那样测 client
 * 就得把整个 zustand 拖进来。
 */
setUnauthorizedHandler(() => {
  useUserInfoStore.getState().logout()
})

export default useUserInfoStore
