import server from "@/server";
import { proColumn } from "@/utils/pro-column-builder";
import { ProTable } from "@ant-design/pro-components";
import { useBoolean, useRequest } from "ahooks";
import { Drawer, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import S from './creditsDetail.module.less'

const CreditsDetail = (props: {
  credits: number
  userId: string
}) => {
  const { credits = 0, userId } = props;
  const [ drawerVis, { toggle, setTrue, setFalse } ] = useBoolean(false)
  const [ totalHolder, setTotalHolder ] = useState(0)

  const columns = [
    proColumn('时间', 'createdAt')
      ._render((_, record) => {
        return dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss')
      }),
    proColumn('方式', 'type')
      ._valueEnum({
        0: '',
        1: '打赏',
        2: '赠送',
        3: '后台发放',
      }),
    proColumn('用户', 'participatorDomainName'),
    proColumn('数量', 'score')
      ._render((_, record) => {
        const { score } = record
        return score > 0
          ? <span className="text-[#02B28A]">+{ String(score).replace(/^\+*/, "") }</span>
          : <span className="text-[#FF3030]">-{ String(score).replace(/^-*/, "") }</span>
      }),
    proColumn('附言', 'remark'),
  ]

  return <>
    <Typography.Link onClick={ setTrue }>{ credits }</Typography.Link>
    <Drawer
      open={ drawerVis }
      className={ S.drawer }
      width={ 600 }
      title={ <h3 className="m-0 text-5">稻米明细</h3> }
      onClose={ setFalse }
    >
      <h3 className="m-0 text-5">当前稻米：{ credits }</h3>
      <ProTable
        headerTitle={ `明细` }
        search={ false }
        columns={ columns }
        options={ false }
        className={ S.table }
        request={ async (params) => {
          const result = await server.dao('POST /admin/score/user-sore-record-page', {
            userId,
            ...params,
            pageNum: params.current,
          })
          setTotalHolder(result?.total || 0)
          return {
            data: result?.items,
            total: result?.total,
            success: true,
          }
        } }
        pagination={ {
          pageSize: 10,
          showTotal: false,
          hideOnSinglePage: true,
        } }
      />
    </Drawer>
  </>
}

export default CreditsDetail;