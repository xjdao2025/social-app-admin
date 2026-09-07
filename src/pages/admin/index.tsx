import Page from "@/components/Page";
import { proColumn } from "@/utils/pro-column-builder";
import { ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddUser from "./_components/AddUser";
import server, { RiceError, type Admin } from "@/server/rice";
import { tableRequest } from "@/server/rice/table";
import { useRef } from "react";
import { ActionType } from "@ant-design/pro-table/es/typing";

const User = () => {
  const actionRef = useRef<ActionType>()

  const remove = async (id: string) => {
    try {
      // 删除会连带撤销该管理员的全部会话
      await server.admins.remove(id)
      message.success('删除成功')
      actionRef.current?.reload()
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  const columns = [
    proColumn('角色', 'role')
      ._render((_, record: Admin) => {
        if (record.superuser) return '超级管理员'
        return { admin: '管理员', operator: '运营' }[record.role] ?? record.role
      }),
    proColumn('账号', 'phone'),
    proColumn('昵称', 'nickname'),
    proColumn('操作')
      ._option()
      ._render((_, record: Admin) => {
        // 超管删不掉,自己也删不掉自己 —— 服务端也拦,这里只是不给按钮
        if (record.superuser) return '-'
        return <Popconfirm
          title={'确定删除该管理员吗？他当前的登录会立刻失效。'}
          onConfirm={() => remove(record.id)}
        >
          <Typography.Link type={'danger'}>删除</Typography.Link>
        </Popconfirm>
      }),
  ]

  return <Page full title={'管理员管理'} className={'bg-white'}>
    <ProTable
      actionRef={actionRef}
      search={false}
      options={false}
      headerTitle={'账号列表'}
      columns={columns}
      toolBarRender={() => {
        return [
          <AddUser trigger={<Button type="primary">
            <PlusOutlined />新增
          </Button>} reload={() => actionRef.current?.reload()} />
        ]
      }}
      rowKey="id"
      request={tableRequest(query => server.admins.list(query))}
      pagination={{
        hideOnSinglePage: true
      }}
    />
  </Page>
}

export default User;