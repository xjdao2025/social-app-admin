import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button, Flex, message } from "antd";
import ProFormUpload from "@/components/styled-components/ProFormUpload";
import { ModalFormProps } from "@ant-design/pro-form/es/layouts/ModalForm";
import server, { RiceError, type Banner } from "@/server/rice";

type AddBannerProps = {
  reload?: () => void
  initialValues?: Banner
} & Omit<ModalFormProps, 'initialValues'>

const AddBanner = (props: AddBannerProps) => {
  const { reload, initialValues, ...rest } = props;

  return <ModalForm
    width={450}
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
    // 表单里的图片是附件 id,列表里的是整个附件对象
    initialValues={initialValues && { ...initialValues, image_id: initialValues.image?.id }}
    onFinish={async (values) => {
      try {
        if (initialValues) {
          await server.banners.update(initialValues.id, values)
        } else {
          await server.banners.create(values)
        }
        message.success(rest.title + '成功')
        reload?.()
        return true
      } catch (error) {
        message.error((error as RiceError).message)
        return false
      }
    }}
  >
    <ProFormUpload
      label={'Banner'}
      name={'image_id'}
      maxSize={5}
      className={'w-[188px] h-[100px]'}
      descriptions={[
        '1.尺寸: 750 x 400 px',
        '2.大小: 5MB以内',
        '3.格式: JPG, JPEG, PNG',
      ]}
      descClassName={'mt-[15px]'}
    />
    <ProFormText label={'链接地址'} name={'url'} />
  </ModalForm>
}

export default AddBanner;