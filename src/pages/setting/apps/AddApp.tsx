import server, { RiceError } from "@/server/rice";
import { PlusOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import type { FC } from 'react'
import AppModalForm from './AppModalForm'

type AddAppProps = {
  reload?: () => void
}

const AddApp: FC<AddAppProps> = (props) => {
  return (
    <AppModalForm
      title={ '新增' }
      trigger={
        <Button
          type={ 'primary' }
          icon={ <PlusOutlined/> }
        >
          新增
        </Button>
      }
      onFinish={async values => {
        try {
          // 不传 position:新建的排到最后。core 是排最前,但后台本来就是拖拽排序的,
          // 追加到末尾更符合「我刚加了一个」的直觉。
          await server.apps.create(values)
          props.reload?.()
          message.success('新增成功');
          return true
        } catch (error) {
          message.error((error as RiceError).message)
          return false
        }
      }}
    />
  )
}

export default AddApp
