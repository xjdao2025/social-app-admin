import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import ChainHash from "@/components/chain-hash";
import { Flex, message, Popconfirm, Typography } from "antd";
import AddNodeUser from "./AddNodeUser.tsx";
import server, { RiceError, type AdminUser } from "@/server/rice";
import { tableRequest } from "@/server/rice/table";
import { useRef } from "react";
import { ActionType } from "@ant-design/pro-table/es/typing";
import dayjs from "dayjs";
import CreditsDetail from './CreditsDetail'

/**
 * 节点用户列表 = `GET /api/admin/users?node_member=true`。
 *
 * core 有四个动词接口(enable / disable / set-node-user / cancel-node-user),
 * 在 rice 那里是同一行上的两个布尔位,一个 PATCH 就够。
 */
const NodeUser = () => {
  const actionRef = useRef<ActionType>()

  const reload = () => {
    actionRef.current?.reload()
  }

  const patch = async (id: string, changes: { disabled?: boolean; node_member?: boolean }, ok: string) => {
    try {
      await server.users.update(id, changes)
      message.success(ok)
      reload()
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  const columns = [
    proColumn('搜索', 'q', { hideInTable: true })
      ._enableSearch()
      ._extend({
        fieldProps: { placeholder: '昵称 / DID / 域名 / 手机号 / 邮箱' },
      }),
    proColumn('昵称', 'nickname'),
    proColumn('DID', 'did')
      ._render((_, record: AdminUser) => {
        return <ChainHash
          copyable={'tooltip'}
          ellipsis
          hash={record.did}
        />
      }),
    proColumn('域名', 'handle'),
    proColumn('手机号', 'phone'),
    proColumn('邮箱', 'email'),
    proColumn('稻米', 'grain_balance')
      ._render((_, record: AdminUser) => {
        return (
          <CreditsDetail
            credits={record.grain_balance}
            userId={record.id}
          />
        )
      }),
    proColumn('创建时间', 'inserted_at', { width: 180 })
      ._render((_, record: AdminUser) => dayjs(record.inserted_at).format('YYYY-MM-DD HH:mm:ss')),
    proColumn('操作', 'opt', { width: 150 })
      ._option()
      ._render((_, record: AdminUser) => {
        return <Flex gap={'middle'}>
          <Popconfirm
            title={'确定取消该用户的节点用户身份吗？'}
            onConfirm={() => patch(record.id, { node_member: false }, '取消成功')}
          >
            <Typography.Link>
              取消节点用户
            </Typography.Link>
          </Popconfirm>
          {record.disabled ?
            <Popconfirm
              title={'确定恢复该节点用户'}
              onConfirm={() => patch(record.id, { disabled: false }, '已恢复')}
            >
              <Typography.Link>
                恢复
              </Typography.Link>
            </Popconfirm> : <Popconfirm
              title={'确定禁用该节点用户？该用户当前的登录会立刻失效。'}
              onConfirm={() => patch(record.id, { disabled: true }, '已禁用')}
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
      rowKey="id"
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
      request={tableRequest(query => server.users.list({ ...query, node_member: true }))}
      pagination={{
        pageSize: 15,
        hideOnSinglePage: true
      }}
    />
  </Page>
}

export default NodeUser;
