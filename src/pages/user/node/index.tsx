import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import ChainHash from "@/components/chain-hash";
import { Flex, message, Popconfirm, Typography } from "antd";
import AddNodeUser from "./AddNodeUser.tsx";
import server from "@/server";
import { useRef, useState } from "react";
import { ActionType } from "@ant-design/pro-table/es/typing";
import dayjs from "dayjs";
import CreditsDetail from './CreditsDetail'

const NodeUser = () => {
  const actionRef = useRef<ActionType>()

  const reload = () => {
    actionRef.current?.reload()
  }


  const enableOrDisableUser = async (type: 'enable' | 'disable', id: string) => {
    switch (type) {
      case "enable":
        await server.dao('POST /admin/user-manage/user/enable', { id })
        break;
      case "disable":
        await server.dao('POST /admin/user-manage/user/disable', { id })
        break;
    }
    reload()
  }

  const cancelNodeUser = async (id: string) => {
    await server.dao('POST /admin/user-manage/user/cancel-node-user', { id })
    message.success('取消成功');
    reload()
  }

  const columns = [
    proColumn('昵称', 'nickName')
      ._enableSearch(),
    proColumn('DID', 'did')
      ._enableSearch()
      ._render((_, record) => {
        return <ChainHash
          copyable={'tooltip'}
          ellipsis
          hash={record.did}
        />
      }),
    proColumn('域名', 'domainName')._enableSearch(),
    proColumn('手机号', 'phone')._enableSearch(),
    proColumn('邮箱', 'email')._enableSearch(),
    proColumn('稻米', 'score')
      ._render((_, record) => {
        return (
          <CreditsDetail
            credits={record.score}
            userId={record.id}
          />
        )
      }),
    proColumn('创建时间', 'createdAt', { width: 180 })
      ._render((_, record) => dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')),
    proColumn('操作', 'opt', { width: 150 })
      ._option()
      ._render((_, record) => {
        return <Flex gap={'middle'}>
          <Typography.Link onClick={() => cancelNodeUser(record.id)}>
            取消节点用户
          </Typography.Link>
          {record.disable ?
            <Popconfirm
              title={'确定恢复该节点用户'}
              onConfirm={() => enableOrDisableUser('enable', record.id)}
            >
              <Typography.Link>
                恢复
              </Typography.Link>
            </Popconfirm> : <Popconfirm
              title={'确定禁用该节点用户'}
              onConfirm={() => enableOrDisableUser('disable', record.id)}
            >
              <Typography.Link
                type={'danger'}
              >
                禁用
              </Typography.Link>
            </Popconfirm>}
        </Flex>
      }),
  ]

  return <Page title={'节点用户'}>
    <ProTable
      actionRef={actionRef}
      headerTitle={'列表'}
      search={{
        collapsed: false,
        collapseRender: false,
        labelWidth: 70
      }}
      options={false}
      toolBarRender={() => [
        <AddNodeUser reload={reload} />
      ]}
      columns={columns}
      request={async (params) => {
        const obj = {
          ...params,
          pageNum: params.current,
        }
        const result = await server.dao('POST /admin/user-manage/node-user/page', obj)
        return {
          data: result?.items,
          total: result?.total,
          success: true,
        }
      }}
      pagination={{
        showTotal: false,
        pageSize: 15,
        hideOnSinglePage: true
      }}
    />
  </Page>
}

export default NodeUser;