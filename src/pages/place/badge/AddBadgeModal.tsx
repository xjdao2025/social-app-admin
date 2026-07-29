import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Button, Flex } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import ProFormUpload from "@/components/styled-components/ProFormUpload";
import ProFormUploadFile from "@/components/styled-components/ProFormUploadFile";
import server from "@/server";
import DownloadTemplate from "@/components/download-template";

const AddBadgeModal = (props: { reload: () => void }) => {

  return <ModalForm
    width={450}
    title={'新增'}
    trigger={<Button type="primary" icon={<PlusOutlined />}>新增</Button>}
    submitter={{
      render: (props) => {
        return <Flex justify="center" className="w-full mt-[20px]">
          <Button type='primary' onClick={props.submit}>确认</Button>
        </Flex>
      }
    }}
    layout="horizontal"
    labelCol={{ span: 5 }}
    modalProps={{
      centered: true,
      destroyOnClose: true
    }}
    onFinish={async (values) => {
      await server.dao('POST /admin/medal/create', values)
      props.reload()
      return true
    }}
  >
    <div className={'mt-[20px]'} />
    <ProFormUpload
      label={'徽章'}
      name={'attachId'}
      descPosition="right"
      className="w-[100px] h-[100px]"
      maxSize={5}
      descriptions={[
        '1.建议比例 1:1',
        '2.大小: 5MB以内',
        '3.格式: PNG'
      ]}
      formItemProps={{
        rules: [{ required: true, message: '请选择徽章' }]
      }}
    />
    <ProFormText label="徽章名称" name="name" rules={[{ required: true }]} />
    <ProFormUploadFile
      buttonText={'导入名单'}
      label="获得用户"
      name="fileId"
      formItemProps={{
        rules: [{ required: true, message: '请导入名单' }]
      }}
      accept={'.xls, .xlsx, .xlsm, .xltx'}
      maxCount={1}
      responseType={'id'}
    >
      <div className={'flex items-center ml-[6px] gap-[4px] text-[12px]'}>
        <span className={'text-[#6F869F]'}>仅支持excel格式</span>
        <DownloadTemplate temName={'badge_distribution'} />
      </div>
    </ProFormUploadFile>

  </ModalForm>
}

export default AddBadgeModal;