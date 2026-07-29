import { ModalForm, ProFormText } from "@ant-design/pro-components";
import S from './index.module.less';
import { Button, Form, message, Modal } from "antd";
import { FC } from "react";
import server, { RiceError } from "@/server/rice";
import FormRoleItem from "./components/FormRoleItem";

type AddUserProps = {
  trigger: JSX.Element
  reload?: () => void
}

const AddUser: FC<AddUserProps> = (props) => {
  const [modal, context] = Modal.useModal();
  return <>
    {context}
    <ModalForm
      width={450}
      title={'新增'}
      modalProps={{
        className: S.modal,
        centered: true,
        destroyOnClose: true
      }}
      trigger={props.trigger}
      layout={'horizontal'}
      submitter={{
        render: (submitterProps) => {
          return <div className={'pt-[16px]'}>
            <Button
              type="primary"
              onClick={submitterProps.submit}
            >确认</Button>
          </div>
        }
      }}
      onFinish={async (values) => {
        try {
          const admin = await server.admins.create({
            phone: values.phone,
            phone_region: '86',
            role: values.role,
          })

          // 初始密码只有这一刻能看到 —— 库里只有摘要
          modal.info({
            title: "新增成功",
            content: (
              <>
                <div>账号: {admin.phone}</div>
                <div>初始密码: {admin.initial_password}</div>
              </>
            )
          })

          props.reload?.()
          return true
        } catch (error) {
          message.error((error as RiceError).message)
          return false
        }
      }}
    >
      <div className={'mt-[15px]'} />
      <Form.Item
        name="role"
      >
        <FormRoleItem />
      </Form.Item>
      <ProFormText
        label={'账号'}
        name="phone"
        placeholder={'请输入手机号  '}
        rules={[{ required: true }]}
      />
    </ModalForm>
  </>
}

export default AddUser;