import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import { Badge, Flex, message, Popconfirm, Typography } from 'antd'
import PostDetailDrawer from "./PostDetailDrawer.tsx";
import server, { RiceError, type Proposal } from "@/server/rice";
import { tableRequest } from "@/server/rice/table";
import { useRef, useState } from "react";
import { ActionType } from "@ant-design/pro-table/es/typing";
import dayjs from "dayjs";
import InitiatorAvatar from "./InitiatorAvatar.tsx";

const { Link } = Typography;

/** rice 的状态是字符串,不是 core 的 1/2/3。 */
export const ProposalStatus = {
  open: {
    text: '进行中',
    status: 'Processing',
  },
  passed: {
    text: '已通过',
    status: 'Success',
  },
  rejected: {
    text: '未通过',
    status: 'Error',
  },
}

const timeFormat = 'YYYY/MM/DD HH:mm:ss'

const PostList = () => {
  const actionRef = useRef<ActionType>()

  const reload = () => {
    actionRef.current?.reload()
  }

  /** 下架 / 恢复。core 的 take-off 只能单向下架,没有恢复的入口。 */
  const setListed = async (id: string, listed: boolean) => {
    try {
      await server.proposals.setListed(id, listed)
      message.success(listed ? '恢复成功' : '下架成功')
      reload()
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  const columns = [
    proColumn('名称', 'q', { hideInTable: true })
      ._enableSearch()
      ._extend({ fieldProps: { placeholder: '按标题搜索' } }),
    proColumn('名称', 'title', { width: 300 }),
    proColumn('发布方（节点）', 'author', { width: 200 })
      ._render((_, record: Proposal) => {
        if (!record.author) return '-'
        return <InitiatorAvatar
          avatar={record.author.avatar?.url}
          name={record.author.nickname || record.author.handle}
        />
      }),
    proColumn('状态', 'status', { width: 125 })
      ._enableSearch()
      ._valueEnum(ProposalStatus),
    proColumn('上下架', 'listed', { width: 100 })
      ._render((_, record: Proposal) => {
        return record.listed ? <Badge status="success" text="已上架" /> : <Badge status="error" text="已下架" />
      }),
    proColumn('发布时间', 'inserted_at',{ width: 125 })
      ._dateRange('since', 'until')
      ._enableSearch()
      ._render((_, record: Proposal) => dayjs(record.inserted_at).format(timeFormat)),
    proColumn('截止时间', 'closes_at',{ width: 125 })
      ._render((_, record: Proposal) => dayjs(record.closes_at).format(timeFormat)),
    proColumn('操作', '', { width: 140 })
      ._option()
      ._render((_, record: Proposal) => {
        return <Flex gap={10}>
          <PostDetailDrawer proposalId={record.id} takeDown={() => setListed(record.id, false)} />
          {record.listed
            ? <Popconfirm title={'确定下架该提案吗？'} onConfirm={() => setListed(record.id, false)}>
                <Link>下架</Link>
              </Popconfirm>
            // core 下架之后就找不回来了 —— 后台列表和 C 端用的是同一个「只看上架」的查询
            : <Popconfirm title={'确定恢复该提案吗？'} onConfirm={() => setListed(record.id, true)}>
                <Link>恢复</Link>
              </Popconfirm>}
        </Flex>
      })
  ]

  return <Page title={'提案'}>
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
      rowKey="id"
      request={tableRequest(query => server.proposals.list(query))}
      pagination={{
        showTotal: false,
        hideOnSinglePage: true,
      }}
    />
  </Page>
}

export default PostList;