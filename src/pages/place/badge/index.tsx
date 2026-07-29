import Page from "@/components/Page";
import { ProTable } from "@ant-design/pro-components";
import { proColumn } from "@/utils/pro-column-builder";
import AddBadgeModal from "./AddBadgeModal.tsx";
import UserBadgeDetail from "@/pages/place/badge/UserBadgeDetail.tsx";
import server, { type Badge } from "@/server/rice";
import { tableRequest } from "@/server/rice/table";
import { useRef } from "react";
import OssImage from "@/components/oss-image";
import { ActionType } from "@ant-design/pro-table/es/typing";

const BadgePlace = () => {
  const actionRef = useRef<ActionType>()

  const reload = () => {
    actionRef.current?.reload()
  }

  const columns = [
    proColumn('徽章','image', { width: 120})
      ._render((_, record: Badge) => {
        return <OssImage className={'w-[64px] h-[64px]'} attachId={record.image?.id} />
      }),
    proColumn('徽章名称','name'),
    proColumn('获得用户','holder_count')
      ._render((_, record: Badge) => {
        return <UserBadgeDetail record={record} />
      }),
  ]

  return <Page title={'发放徽章'}>
    <ProTable
      actionRef={actionRef}
      headerTitle={'徽章列表'}
      columns={columns}
      search={false}
      options={false}
      toolBarRender={() => {
        return [<AddBadgeModal reload={reload} />]
      }}
      rowKey="id"
      request={tableRequest(query => server.badges.list(query))}
      pagination={{
        showTotal: false,
        hideOnSinglePage: true
      }}
    />
  </Page>
}

export default BadgePlace;