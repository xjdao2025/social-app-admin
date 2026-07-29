import { ModalForm, ProFormItem, ProFormText } from "@ant-design/pro-components";
import { Button, Flex, message, Upload } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import ProFormUpload from "@/components/styled-components/ProFormUpload";
import server, { RiceError } from "@/server/rice";
import DownloadTemplate from "@/components/download-template";
import { useRoster } from "@/hooks/useRoster";

/**
 * 新建勋章。
 *
 * core 是把名单 Excel 传上去(`fileId`),服务端解析并在同一次调用里发下去。
 * rice 收一个数组,语义一样 —— 建和发在一个事务里,名单里一个人认不出来,
 * 勋章也不建。名单在浏览器里解析,文件不上传。
 */
const AddBadgeModal = (props: { reload: () => void }) => {
  const { recipients, fileName, parsing, select, reset } = useRoster({
    empty: '名单里没有读到用户，请检查第一列',
    failed: '名单解析失败，请确认是 Excel 文件',
    ok: n => `已读取 ${n} 个用户`,
  })

  return <ModalForm
    width={450}
    title={'新增'}
    trigger={<Button type="primary" icon={<PlusOutlined />}>新增</Button>}
    submitter={{
      render: (submitterProps) => {
        return <Flex justify="center" className="w-full mt-[20px]">
          <Button type='primary' onClick={submitterProps.submit}>确认</Button>
        </Flex>
      }
    }}
    layout="horizontal"
    labelCol={{ span: 5 }}
    modalProps={{
      centered: true,
      destroyOnClose: true,
      afterClose: reset,
    }}
    onFinish={async (values: { name: string; image_id?: string }) => {
      if (parsing) {
        message.error('名单还在解析，请稍候')
        return false
      }

      if (!recipients.length) {
        message.error('请先导入名单')
        return false
      }

      try {
        await server.badges.create({ ...values, to: recipients })
        message.success('新增成功')
        props.reload()
        return true
      } catch (error) {
        message.error((error as RiceError).message)
        return false
      }
    }}
  >
    <div className={'mt-[20px]'} />
    <ProFormUpload
      label={'徽章'}
      name={'image_id'}
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
    <ProFormItem label="获得用户">
      <Flex align="center" gap={6} wrap>
        <Upload
          accept={'.xls, .xlsx, .xlsm, .xltx'}
          maxCount={1}
          showUploadList={false}
          // 名单不上传,只在本地解析
          beforeUpload={file => {
            select(file)
            return Upload.LIST_IGNORE
          }}
        >
          <Button icon={<UploadOutlined />} loading={parsing}>导入名单</Button>
        </Upload>
        <div className={'flex items-center ml-[6px] gap-[4px] text-[12px]'}>
          <span className={'text-[#6F869F]'}>仅支持excel格式</span>
          <DownloadTemplate temName={'badge_distribution'} />
        </div>
      </Flex>
      {recipients.length > 0 && (
        <div className={'mt-[8px] text-[12px] text-[#6F869F]'}>
          {fileName}：共 {recipients.length} 个用户
        </div>
      )}
    </ProFormItem>

  </ModalForm>
}

export default AddBadgeModal;