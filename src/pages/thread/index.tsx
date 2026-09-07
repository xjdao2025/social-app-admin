import { Navigate } from '@/router';
import type { FC } from 'react';

// `/thread` 只是菜单分组,本身没有页面,重定向到提案列表。
// 原来写的是 `/post/proposal` —— 那是 core 时代的路径,目录改名成 thread/
// 之后没跟着改,点「帖子管理」这一层会落到一个不存在的路由上。
// 类型化的 Navigate 一直在报,只是没人跑 tsc。
const Home: FC = () => {
  return (
    <Navigate to="/thread/proposal" replace />
  )
}

export default Home;