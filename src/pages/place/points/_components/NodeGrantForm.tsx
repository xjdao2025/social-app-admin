import { ModalForm, ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-components'
import { Button, message } from 'antd'
import { useRef } from 'react'
import StyledProFormCaptcha from '@/components/form/ProFormCaptcha'
import server, { RiceError } from '@/server/rice'

export default function NodeGrantForm({ reload, multiple = false }: { reload: () => void; multiple?: boolean }) {
  const attempt = useRef<{ payload: string; id: string }>()
  return <ModalForm
    title={multiple ? '批量向节点增发稻米' : '向节点增发稻米'}
    trigger={<Button type="primary">{multiple ? '批量增发' : '单个增发'}</Button>}
    width={520}
    modalProps={{ centered: true, destroyOnClose: true, afterClose: () => { attempt.current = undefined } }}
    onFinish={async (values: { node_ids: string | string[]; amount: number; code: string; memo?: string }) => {
      const nodeIds = [...new Set(Array.isArray(values.node_ids) ? values.node_ids : [values.node_ids])].sort()
      const payload = JSON.stringify({ node_ids: nodeIds, amount: values.amount, memo: values.memo || '' })
      if (attempt.current?.payload !== payload) attempt.current = { payload, id: crypto.randomUUID() }
      try {
        const result = await server.grants.create({ ...values, node_ids: nodeIds, client_request_id: attempt.current.id })
        message.success(`已向 ${result.granted} 个节点增发稻米`)
        reload()
        return true
      } catch (error) {
        message.error((error as RiceError).message)
        return false
      }
    }}
  >
    <p>稻米进入节点钱包，不进入负责人个人钱包。以下数量为每个节点的增发数量。</p>
    <ProFormSelect
      name="node_ids" label="接收节点"
      mode={multiple ? 'multiple' : undefined}
      request={async () => (await server.nodes.list()).map(node => ({ label: node.name, value: node.id }))}
      fieldProps={{ showSearch: true, optionFilterProp: 'label' }}
      rules={[{ required: true, message: '请选择节点' }]}
    />
    <ProFormDigit name="amount" label="每节点增发数量" min={1} max={100_000_000}
      fieldProps={{ precision: 0 }} rules={[{ required: true, message: '请填写增发数量' }]} />
    <ProFormText name="memo" label="增发原因" fieldProps={{ maxLength: 256 }} />
    <p>请使用当前平台管理员手机收到的验证码确认增发。</p>
    <StyledProFormCaptcha name="code" label="验证码" onGetCaptcha={() => server.grants.challenge()} />
  </ModalForm>
}
