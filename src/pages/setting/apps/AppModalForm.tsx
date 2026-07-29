import ProFormUpload from "@/components/styled-components/ProFormUpload";
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { ModalFormProps } from "@ant-design/pro-form/es/layouts/ModalForm";
import { Button, Flex } from "antd";
import type { FC } from 'react'

type AppModalFormProps = ModalFormProps

const AppModalForm: FC<AppModalFormProps> = (props) => {
  return (
    <ModalForm
      width={ 600 }
      submitter={ {
        render: (submitterProps) => {
          return <Flex justify={ 'center' } className={ 'w-full' }>
            <Button type={ 'primary' } onClick={ submitterProps.submit }>确认</Button>
          </Flex>
        }
      } }
      layout={ 'horizontal' }
      labelCol={ { span: 4 } }
      modalProps={ {
        centered: true,
        destroyOnClose: true
      } }
      { ...props }
    >
      <ProFormUpload
        label="应用图标"
        name="logo_id"
        maxSize={ 5 }
        listType="picture-card"
        className="size-25 rounded-5"
        descPosition="right"
        descriptions={ [
          "1. 尺寸: 推荐512X512px（比例1:1）",
          "2. 大小: 5MB以内",
          "3. 格式: JPG, JPEG, PNG"
        ] }
        formItemProps={ {
          rules: [
            { required: true, message: "请上传应用图标" }
          ]
        } }
      />
      <ProFormText
        label="应用名称"
        name="name"
        rules={ [
          { required: true, message: '请输入应用名称' },
        ] }
      />
      <ProFormText
        label="描述"
        name="description"
        fieldProps={ { maxLength: 16, showCount: true } }
        rules={ [
          { required: true, message: '请输入描述' },
        ] }
      />
      <ProFormText
        label="链接"
        name="url"
        fieldProps={ { type: 'url' } }
        rules={ [
          { required: true, message: '请输入链接' },
        ] }
      />
    </ModalForm>
  )
}

export default AppModalForm
