import { Drawer, Typography } from "antd";
import { ProTable } from "@ant-design/pro-components";
import S from './userBadgeDetail.module.less'
import { proColumn } from "@/utils/pro-column-builder";
import { useBoolean } from "ahooks";
import server, { type Badge, type BadgeHolder } from "@/server/rice";
import { pageParams, toProTable } from "@/server/rice/table";
import OssImage from "@/components/oss-image";
import { useState } from "react";

const UserBadgeDetail = (props: {
  record: Badge
}) => {
  const { record } = props;
  const [drawerVis, { setTrue, setFalse }] = useBoolean(false)
  const [totalHolder, setTotalHolder] = useState(0)

  const columns = [
    proColumn('昵称','nickname')
      ._render((_, item: BadgeHolder) => {
        return <div className={'flex items-center gap-[10px]'}>
          <OssImage attachId={item.avatar?.id} className={'w-[24px] h-[24px] rounded-full'} />
          <span>{item.nickname}</span>
        </div>
      }),
    proColumn('域名','handle'),
    proColumn('手机号','phone'),
    proColumn('邮箱','email'),
    proColumn('搜索','q', { hideInTable: true })
      ._enableSearch()
      ._extend({ fieldProps: { placeholder: '昵称 / 域名 / 手机号 / 邮箱' } }),
  ]

  return <>
    <Typography.Link onClick={setTrue}>{record.holder_count ?? 0}</Typography.Link>
    <Drawer
      open={drawerVis}
      className={S.drawer}
      width={600}
      title={record.name}
      onClose={setFalse}
    >
      <ProTable
        headerTitle={`获得用户（${totalHolder}）`}
        columns={columns}
        options={false}
        className={S.table}
        rowKey="id"
        request={async (params) => {
          const page = await server.badges.holders(record.id, pageParams(params))
          setTotalHolder(page.meta.total ?? page.data.length)
          return toProTable(page)
        }}
        search={{
          labelWidth: 100,
          span: 12
        }}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
      />
    </Drawer>
  </>
}

export default UserBadgeDetail;