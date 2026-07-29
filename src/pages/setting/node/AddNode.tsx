import { ModalForm, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, Flex, message } from "antd";
import ProFormUpload from "@/components/styled-components/ProFormUpload";
import { ModalFormProps } from "@ant-design/pro-form/es/layouts/ModalForm";
import { debounce } from "lodash";
import { useMemo } from "react";
import S from './index.module.less'
import server, { RiceError, type Node } from "@/server/rice";

type AddNodeProps = {
  reload?: () => void
  initialValues?: Node
} & Omit<ModalFormProps, 'initialValues'>

const AddNode = (props: AddNodeProps) => {
  const { initialValues, reload, ...rest } = props

  // core 有个专门的 unbound-node-user-search 接口;rice 是同一个用户列表加过滤
  const {
    data: candidates,
    run: searchNodeUsers
  } = useRequest(
    async (q = "") => (await server.users.list({ q, node_member: true, per_page: 20 })).data,
    { manual: true }
  )

  // 编辑时,当前节点主未必在搜索结果里 —— 先把它放进去,否则下拉框显示成一个裸 id
  const userList = useMemo(
    () => {
      const owner = initialValues?.owner
      const rest = (candidates ?? []).filter(item => item.id !== owner?.id)
      return owner ? [owner, ...rest] : rest
    },
    [candidates, initialValues]
  )

  return <ModalForm
    width={600}
    submitter={{
      render: (submitterProps) => {
        return <Flex justify={'center'} className={'w-full'}>
          <Button type={'primary'} onClick={submitterProps.submit}>确认</Button>
        </Flex>
      }
    }}
    layout={'horizontal'}
    labelCol={{ span: 4 }}
    modalProps={{
      centered: true,
      destroyOnClose: true
    }}
    {...rest}
    initialValues={initialValues && {
      ...initialValues,
      logo_id: initialValues.logo?.id,
      user_id: initialValues.owner?.id,
    }}
    onFinish={async (values) => {
      try {
        if (initialValues) {
          await server.nodes.update(initialValues.id, values)
        } else {
          await server.nodes.create(values)
        }
        message.success((rest.title ?? '保存') + '成功')
        reload?.()
        return true
      } catch (error) {
        message.error((error as RiceError).message)
        return false
      }
    }}
  >
    <ProFormUpload
      label={'节点logo'}
      name={'logo_id'}
      maxSize={5}
      listType="picture-circle"
      circleClassName={'!bg-transparent !border-0'}
      className={S.circleUpload}
      descPosition={'right'}
      descriptions={[
        '1.建议比例: 1:1',
        '2.大小: 5MB以内',
        '3.格式: JPG, JPEG, PNG',
      ]}
      formItemProps={{
        rules: [
          { required: true, message: "请上传节点logo" }
        ]
      }}
    />
    <ProFormSelect
      label="节点用户"
      fieldProps={{
        showSearch: true,
        filterOption: false,
        onSearch: debounce(searchNodeUsers, 300),
        options: userList.map(item => ({
          label: [item.nickname, item.handle].filter(Boolean).join(' / ') || item.id,
          value: item.id
        })),
      }}
      name="user_id"
      rules={[
        { required: true, message: '请选择节点用户' }
      ]}
    />
    <ProFormText
      label={'节点名称'}
      name={'name'}
      rules={[
        { required: true, message: '请输入节点名称' },
      ]}
    />
    <ProFormTextArea
      label={'节点介绍'}
      name={'description'}
      rules={[
        {required: true, message: '请输入节点介绍'},
        { max: 500 }
      ]}
    />
  </ModalForm>
}

export default AddNode;