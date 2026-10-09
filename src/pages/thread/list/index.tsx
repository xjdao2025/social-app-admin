import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import { Badge, Flex, message, Popconfirm, Typography } from 'antd'
import PostDetailDrawer from "./PostDetailDrawer.tsx";
import server, { RiceError, type Post } from "@/server/rice";
import InitiatorAvatar from "@/pages/thread/proposal/InitiatorAvatar.tsx";
import dayjs from "dayjs";
import { debounce } from "lodash";
import { useRef, useState } from "react";
import { getPostNameList, getPostTag } from "./utils.ts";
import S from './index.module.less'
import { ActionType } from "@ant-design/pro-table/es/typing";

const { Link } = Typography;

const tagValueEnum: Record<number, string> = {
  1: '任务',
  2: '商品',
  3: '活动'
}

const PostList = () => {
  const actionRef = useRef<ActionType>()

  const reload = () => {
    actionRef.current?.reload()
  }
  const [options, setOptions] = useState<{ label: JSX.Element; value: string }[]>([]);

  const searchUser = async (words: string) => {
    const keyWords = words.trim()
    if (!keyWords) {
      setOptions([]);
      return
    }

    try {
      // core 有个专门的 search-by-name;rice 是同一个用户列表的 q
      const { data } = await server.users.list({ q: keyWords, per_page: 20 })

      setOptions(data.map(user => ({
        label: <InitiatorAvatar avatar={user.avatar?.url} name={user.nickname || user.handle} />,
        value: user.did,
      })))
    } catch (error) {
      message.error((error as RiceError).message)
      setOptions([])
    }
  }

  // 贴文不在 rice 库里,这是一层到 aerox 审核服务的代理 —— 管理凭据不必下发到浏览器
  const moderate = async (post: Post, action: 'takeDown' | 'restore') => {
    try {
      await server.posts[action](post)
      message.success(action === 'takeDown' ? '下架成功' : '已恢复上架')
      reload()
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }
  const takeOff = (post: Post) => moderate(post, 'takeDown')

  const columns = [
    proColumn('名称', 'key', { width: 328 })
      ._enableSearch()
      ._render((_, post) => {
        const list = getPostNameList(post)

        return <div className={'truncate'} style={{width: 328}}>
          {list.map(l => {
            if (l === '[图片]') return <span style={{color: '#6F869F'}}>{l}</span>
            return l
          })}
        </div>
      }),
    proColumn('发布方', 'repo', { width: 226 })
      ._enableSearch()
      ._extend({
        valueType: 'select',
        fieldProps: {
          showSearch: true,
          filterOption: false,
          onSearch: debounce(searchUser, 300),
          options: options,
        }
      })
      ._render((_, record) => {
        const author = record.author
        return <InitiatorAvatar avatar={author.avatar} name={author.displayName || author.handle} />
      }),
    proColumn('标签', 'tag', { width: 160 })
      ._enableSearch()
      ._valueEnum(tagValueEnum)
      ._extend({
        search: {
          transform: (value: number) => {
            return {
              tag: `#${tagValueEnum[value]}`
            }
          }
        }
      })
      ._render((_, record) => {
        const tags = getPostTag(record.record)
        if (!tags || tags.length === 0) return '-'
        return <div className={'flex items-center gap-[3px]'}>
          {tags.map(i => <span className={S.postTag}>{i}</span>)}
        </div>
      }),
    proColumn('上下架', 'taken_down', { width: 100 })
      ._enableSearch()
      ._valueEnum({ false: '已上架', true: '已下架' })
      ._render((_, post) => {
        return !post.is_banned ? <Badge status="success" text="已上架" /> : <Badge status="error" text="已下架" />
      }),
    proColumn('发布时间', 'indexed_at', { width: 226 })
      ._enableSearch()
      ._extend({
        valueType: 'dateRange',
        search: {
          transform: (value: any) => {
            // aerox 认 ISO 时间;结束日要包含当天,所以取次日零点(上界不含)
            return {
              indexed_at: [
                dayjs(value[0]).startOf('day').toISOString(),
                dayjs(value[1]).add(1, 'day').startOf('day').toISOString()
              ]
            }
          }
        }
      })
      ._render((_, record) => {
        return dayjs(record.indexedAt).format('YYYY/MM/DD HH:mm:ss')
      }),
    proColumn('操作', '', { width: 226 })
      ._option()
      ._render((_, post) => {
        return <Flex gap={10}>
          <PostDetailDrawer post={post} takeOff={() => takeOff(post)} />
          {post.is_banned
            ? <Popconfirm title={'确定恢复上架该帖子吗？'} onConfirm={() => moderate(post, 'restore')}>
              <Link>恢复</Link>
            </Popconfirm>
            : <Popconfirm title={'确定下架该帖子吗？'} onConfirm={() => takeOff(post)}>
              <Link>下架</Link>
            </Popconfirm>}
        </Flex>
      })
  ]

  return <Page title={'帖子'}>
    <ProTable
      actionRef={actionRef}
      headerTitle={'帖子列表'}
      columns={columns}
      options={false}
      search={{
        collapsed: false,
        collapseRender: false,
        labelWidth: 'auto'
      }}
      rowKey="uri"
      request={async (params) => {
        const { current, pageSize, key, repo, tag, indexed_at, taken_down } = params

        try {
          // 已下架的也列出来(带「已下架」),这样才能恢复
          const result = await server.posts.list({
            q: key,
            author: repo,
            tag,
            since: indexed_at?.[0],
            until: indexed_at?.[1],
            taken_down,
            per_page: pageSize ?? 10,
            page: current ?? 1,
          })
          return {
            data: result.data,
            total: result.meta.total,
            success: true
          }
        } catch (error) {
          // 不接住的话,这个 Promise 会以 "Uncaught (in promise)" 落到控制台,
          // 而界面上只是一直空着 —— 运营看不出是没数据还是没连上。
          message.error((error as RiceError).message)
          return { data: [], total: 0, success: false }
        }
      }}
      pagination={{
        pageSize: 10,
        showSizeChanger: false,
      }}
    />
  </Page>
}

export default PostList;