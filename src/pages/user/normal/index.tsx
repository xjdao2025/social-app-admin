import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import ChainHash from "@/components/chain-hash";
import { Popconfirm, Typography } from "antd";
import server from "@/server";
import { useRef, useState } from "react";
import { ActionType } from "@ant-design/pro-table/es/typing";
import dayjs from "dayjs";

const UserNormal = () => {
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

  const columns = [
    proColumn('昵称', 'nickName', { width: 125 })
      ._enableSearch(),
    proColumn('DID', 'did', { width: 200 })
      ._enableSearch()
      ._render((_, record) => {
        return <ChainHash
          copyable={'tooltip'}
          ellipsis
          hash={record.did}
        />
      }),
    proColumn('域名', 'domainName', { width: 125 })
      ._enableSearch(),
    proColumn('手机号', 'phone', { width: 125 })._enableSearch(),
    proColumn('邮箱', 'email', { width: 125 })._enableSearch(),
    proColumn('稻米', 'score', { width: 80 }),
    proColumn('创建时间', 'createdAt', { width: 180 })
      ._render((_, record) => dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')),
    proColumn('操作', 'opt', { width: 100 })
      ._option()
      ._render((_, record) => {
        if (record.disable) {
          return <Popconfirm
            title={'确定恢复该普通用户吗？'}
            onConfirm={() => enableOrDisableUser('enable', record.id)}
          >
            <Typography.Link>
              恢复
            </Typography.Link>
          </Popconfirm>
        }
        return <Popconfirm
          title={'确定禁用该普通用户吗？'}
          onConfirm={() => enableOrDisableUser('disable', record.id)}
        >
          <Typography.Link
            type={'danger'}
          >
            禁用
          </Typography.Link>
        </Popconfirm>
      }),
  ]

  return <Page title={'普通用户'}>
    <ProTable
      actionRef={actionRef}
      headerTitle={'列表'}
      search={{
        collapsed: false,
        collapseRender: false,
        labelWidth: 70
      }}
      options={false}
      columns={columns}
      request={async (params) => {
        const obj = {
          ...params,
          pageNum: params.current,
        }
        const result = await server.dao('POST /admin/user-manage/user/page', obj)
        return {
          data: result?.items,
          total: result?.total,
          success: true,
        }
      }}
      pagination={{
        showTotal: false,
        hideOnSinglePage: true,
        pageSize: 15,
      }}
    />
  </Page>
}

export default UserNormal;