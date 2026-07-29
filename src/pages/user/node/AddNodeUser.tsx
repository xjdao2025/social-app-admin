import { Button, Flex, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProFormSelect } from "@ant-design/pro-components";
import server, { RiceError } from "@/server/rice";
import { debounce } from "lodash";
import { useState } from "react";

/**
 * 把一个普通用户设成节点用户。
 *
 * core 是 `user/search`(按手机或邮箱)+ `set-node-user` 两个接口;
 * rice 是同一个用户列表加过滤,再 PATCH 一个布尔位。
 */
const AddNodeUserModal = (props: { reload: () => void }) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  const searchUser = async (keyWords: string) => {
    if (!keyWords) {
      setOptions([]);
      return
    }

    try {
      // 只找还不是节点用户的 —— 已经是的没必要再设一遍
      const { data } = await server.users.list({ q: keyWords, node_member: false, per_page: 20 })

      setOptions(data.map(user => ({
        label: [user.nickname, user.phone, user.email].filter(Boolean).join(' / ') || user.handle,
        value: user.id,
      })))
    } catch (error) {
      message.error((error as RiceError).message)
      setOptions([])
    }
  }

  return <>
    <ModalForm
      trigger={<Button
        type="primary"
        icon={<PlusOutlined />}
      >新增</Button>}
      width={450}
      layout="horizontal"
      title={'新增'}
      modalProps={{
        centered: true,
        destroyOnClose: true,
      }}
      submitter={{
        render: (submitterProps) => {
          return <Flex
            className={'w-full mt-[20px]'}
            justify="center"
          >
            <Button
              type="primary"
              onClick={submitterProps.submit}
            >设为节点用户</Button>
          </Flex>
        }
      }}
      onFinish={async (values: { id: string }) => {
        try {
          await server.users.update(values.id, { node_member: true })
          message.success('新增成功')
          props.reload();
          return true
        } catch (error) {
          message.error((error as RiceError).message)
          return false
        }
      }}
    >
      <div className={'mt-[30px]'} />
      <ProFormSelect
        label={'账号'}
        name={'id'}
        placeholder={'请输入昵称、手机号或邮箱'}
        fieldProps={{
          showSearch: true,
          filterOption: false,
          onSearch: debounce(searchUser, 300),
          options: options,
        }}
      />

    </ModalForm>
  </>
}

export default AddNodeUserModal;
