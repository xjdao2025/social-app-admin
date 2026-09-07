import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import ChainHash from "@/components/chain-hash";
import { message, Popconfirm, Typography } from "antd";
import server, { RiceError, type AdminUser } from "@/server/rice";
import { tableRequest } from "@/server/rice/table";
import { useRef } from "react";
import { ActionType } from "@ant-design/pro-table/es/typing";
import dayjs from "dayjs";

/**
 * 普通用户列表。
 *
 * core 有五个列表接口(page / node-user-page / search / search-by-name /
 * unbound-node-user-search),rice 是一个带过滤的 `GET /api/admin/users`。
 * 「禁用 / 恢复」原本是两个接口,现在是同一行上的一个布尔位。
 */
const UserNormal = () => {
  const actionRef = useRef<ActionType>()

  const setDisabled = async (id: string, disabled: boolean) => {
    try {
      await server.users.update(id, { disabled })
      // 禁用会连带撤销该用户的全部令牌 —— core 只改标记,JWT 还能用满 30 天
      message.success(disabled ? '已禁用' : '已恢复')
      actionRef.current?.reload()
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  const columns = [
    // core 是五个搜索接口分别按昵称 / DID / 域名 / 手机 / 邮箱找,rice 是一个 q 全找。
    // 所以搜索区只留一个框 —— 每列一个搜索框会发出五个 rice 不认的参数。
    proColumn('搜索', 'q', { hideInTable: true })
      ._enableSearch()
      ._extend({
        fieldProps: { placeholder: '昵称 / DID / 域名 / 手机号 / 邮箱' },
      }),
    proColumn('昵称', 'nickname', { width: 125 }),
    proColumn('DID', 'did', { width: 200 })
      ._render((_, record: AdminUser) => {
        return <ChainHash
          copyable={'tooltip'}
          ellipsis
          hash={record.did}
        />
      }),
    proColumn('域名', 'handle', { width: 125 }),
    proColumn('手机号', 'phone', { width: 125 }),
    proColumn('邮箱', 'email', { width: 125 }),
    proColumn('稻米', 'grain_balance', { width: 80 }),
    proColumn('创建时间', 'inserted_at', { width: 180 })
      ._render((_, record: AdminUser) => dayjs(record.inserted_at).format('YYYY-MM-DD HH:mm:ss')),
    proColumn('操作', 'opt', { width: 100 })
      ._option()
      ._render((_, record: AdminUser) => {
        if (record.disabled) {
          return <Popconfirm
            title={'确定恢复该普通用户吗？'}
            onConfirm={() => setDisabled(record.id, false)}
          >
            <Typography.Link>
              恢复
            </Typography.Link>
          </Popconfirm>
        }
        return <Popconfirm
          title={'确定禁用该普通用户吗？该用户当前的登录会立刻失效。'}
          onConfirm={() => setDisabled(record.id, true)}
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
      rowKey="id"
      headerTitle={'列表'}
      search={{
        collapsed: false,
        collapseRender: false,
        labelWidth: 70
      }}
      options={false}
      columns={columns}
      // core 的五个搜索接口在 rice 这里是同一个 q:昵称 / handle / DID / 邮箱 / 手机号
      request={tableRequest(query => server.users.list({ ...query, node_member: false }))}
      pagination={{
        hideOnSinglePage: true,
        pageSize: 15,
      }}
    />
  </Page>
}

export default UserNormal;
