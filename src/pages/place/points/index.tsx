import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import PlaceSinglePoints from "./_components/PlaceSinglePoints";
import PlaceMultiPoints from "./_components/PlaceMultiPoints";
import { useRef } from "react";
import server, { type Grant } from "@/server/rice";
import { tableRequest } from "@/server/rice/table";
import dayjs from "dayjs";
import { ActionType } from "@ant-design/pro-table/es/typing";

const PlacePoints = () => {
  const actionRef = useRef<ActionType>()

  const reload = () => {
    actionRef.current?.reload()
  }

  const columns = [
    // core 有「接收者」和「手机号或邮箱」两个搜索框,rice 是一个 q 全找
    proColumn('接收者', 'q', { hideInTable: true })
      ._enableSearch()
      ._extend({ fieldProps: { placeholder: '昵称 / 域名 / 手机号 / 邮箱' } }),
    proColumn('接收者', 'to')
      ._render((_, record: Grant) => record.to?.nickname || record.to?.handle || '—'),
    proColumn('手机号', 'phone')
      ._render((_, record: Grant) => record.to?.phone || '—'),
    proColumn('邮箱', 'email')
      ._render((_, record: Grant) => record.to?.email || '—'),
    proColumn('发放时间', 'time')
      ._dateRange('since', 'until', 'YYYY-MM-DDTHH:mm:ss[Z]')
      ._enableSearch()
      ._render((_, record: Grant) => dayjs(record.inserted_at).format('YYYY/MM/DD HH:mm:ss')),
    proColumn('发放稻米', 'amount'),
    proColumn('附言', 'memo'),
  ]

  return <Page title="发放稻米">
    <ProTable
      actionRef={actionRef}
      headerTitle="列表"
      columns={columns}
      options={false}
      toolBarRender={() => [
        <PlaceSinglePoints reload={reload} />,
        <PlaceMultiPoints reload={reload} />
      ]}
      rowKey="id"
      request={tableRequest(query => server.grants.list(query))}
      search={{
        labelWidth: 'auto',
        collapsed: false,
        collapseRender: false,
      }}
      pagination={{
        showTotal: false,
        hideOnSinglePage: true
      }}
    />
  </Page>
}

export default PlacePoints;