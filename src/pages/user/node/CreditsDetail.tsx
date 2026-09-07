import server, { RiceError, type Transfer } from "@/server/rice";
import { tableRequest } from "@/server/rice/table";
import { proColumn } from "@/utils/pro-column-builder";
import { ProTable } from "@ant-design/pro-components";
import { useBoolean } from "ahooks";
import { Button, Drawer, message, Tooltip, Typography } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import S from './creditsDetail.module.less'

/**
 * 某个用户的稻米明细。
 *
 * core 的记录带一个数字 `type`(1 打赏 / 2 赠送 / 3 后台发放)和一个**带符号**的
 * `score` —— 它给每笔转账写了两行带相反符号的记录。rice 一笔就是一行,
 * 方向由 `direction` 表达,`amount` 恒为正,而且是**相对被查看的这个人**算的,
 * 不是相对当前登录的管理员。
 */
const kindMap: Record<Transfer['kind'], string> = {
  reward: '打赏',
  gift: '赠送',
  grant: '后台发放',
}

/** 明细里显示对方是谁:收到就显示付款人,付出就显示收款人。 */
function counterparty(record: Transfer) {
  const other = record.direction === 'in' ? record.from : record.to
  return other?.handle || other?.nickname || '—'
}

function signedAmount(record: Transfer) {
  return record.direction === 'out' ? -record.amount : record.amount
}

const CreditsDetail = (props: {
  credits: number
  userId: string
}) => {
  const { credits = 0, userId } = props;
  const [drawerVis, { setTrue, setFalse }] = useBoolean(false)
  const [exporting, setExporting] = useState(false)

  const columns = [
    proColumn('时间', 'inserted_at')
      ._render((_, record: Transfer) => {
        return dayjs(record.inserted_at).format('YYYY-MM-DD HH:mm:ss')
      }),
    proColumn('方式', 'kind')
      ._valueEnum(kindMap),
    proColumn('用户', 'counterparty')
      ._render((_, record: Transfer) => counterparty(record)),
    proColumn('数量', 'amount')
      ._render((_, record: Transfer) => {
        const amount = signedAmount(record)
        return amount > 0
          ? <span className="text-[#02B28A]">+{amount}</span>
          : <span className="text-[#FF3030]">{amount}</span>
      }),
    proColumn('附言', 'memo'),
  ]

  const handleExport = async () => {
    setExporting(true)
    try {
      // rice 的 per_page 上限是 100,导 1000 条要翻 10 页
      const items: Transfer[] = []
      for (let page = 1; page <= 10; page++) {
        const { data } = await server.users.transfers(userId, { page, per_page: 100 })
        items.push(...data)
        if (data.length < 100) break
      }

      const headers = ['时间', '方式', '用户', '数量', '附言']
      const rows = items.map((item) => [
        dayjs(item.inserted_at).format('YYYY-MM-DD HH:mm:ss'),
        kindMap[item.kind] || '',
        counterparty(item),
        String(signedAmount(item)),
        item.memo || '',
      ])
      const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n')
      const blob = new Blob(["﻿" + csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `稻米明细_${dayjs().format('YYYYMMDD_HHmmss')}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      message.error((error as RiceError).message)
    } finally {
      setExporting(false)
    }
  }

  return <>
    <Typography.Link onClick={setTrue}>{credits}</Typography.Link>
    <Drawer
      open={drawerVis}
      className={S.drawer}
      width={600}
      title={<h3 className="m-0 text-5">稻米明细</h3>}
      onClose={setFalse}
    >
      <h3 className="m-0 text-5">当前稻米：{credits}</h3>
      <ProTable
        headerTitle={`明细`}
        rowKey="id"
        search={false}
        columns={columns}
        options={false}
        className={S.table}
        toolBarRender={() => [
          <Tooltip title="导出最近1000条记录" key="export">
            <Button loading={exporting} onClick={handleExport}>导出</Button>
          </Tooltip>
        ]}
        request={tableRequest(query => server.users.transfers(userId, query))}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
      />
    </Drawer>
  </>
}

export default CreditsDetail;
