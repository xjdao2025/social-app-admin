import { ModalForm, ProFormDigit, ProFormItem } from "@ant-design/pro-components";
import { Button, Flex, message, Upload } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import StyledProFormCaptcha from "@/components/form/ProFormCaptcha";
import S from './index.module.less'
import useCurrentUserInfo from "@/hooks/useCurrentUserInfo.ts";
import { encryptPhone } from "@/utils/tool.ts";
import server, { RiceError } from "@/server/rice";
import DownloadTemplate from "@/components/download-template";
import { useRoster } from "@/hooks/useRoster";

/**
 * 批量发放。
 *
 * core 是把整个 Excel 传上去(`fileId`),由服务端解析。rice 收的是一个收款人数组 ——
 * 所以名单在**浏览器里**解析,文件根本不上传。顺带的好处:运营在点确认之前
 * 就能看到解析出多少人,而不是发完了才知道。
 *
 * 全有或全无:任何一个收款人服务端认不出来,整批都不发,并且会把认不出来的
 * 那几个报出来。
 */
const PlaceMultiPointsModal = (props: { reload: () => void }) => {
  const { userInfo } = useCurrentUserInfo()
  const { recipients, fileName, parsing, select, reset } = useRoster({
    empty: '名单里没有读到收款人，请检查第一列',
    failed: '名单解析失败，请确认是 Excel 文件',
    ok: n => `已读取 ${n} 个收款人`,
  })

  return <ModalForm
    trigger={<Button type={'primary'} icon={<PlusOutlined />}>批量发放</Button>}
    width={480}
    title={'发放稻米'}
    layout={'horizontal'}
    submitter={{
      render: (submitterProps) => [
        <Flex justify="center" className={'w-full'} key="submit">
          <Button type={'primary'} onClick={submitterProps.submit}>确认</Button>
        </Flex>
      ]
    }}
    requiredMark={false}
    modalProps={{
      centered: true,
      destroyOnClose: true,
      afterClose: reset,
    }}
    onFinish={async (values: { amount: number; code: string }) => {
      // 解析还没完就点了确认 —— 这时名单是空的,不能拿上一份顶上
      if (parsing) {
        message.error('名单还在解析，请稍候')
        return false
      }

      if (!recipients.length) {
        message.error('请先导入名单')
        return false
      }

      try {
        const { granted } = await server.grants.create({
          to: recipients,
          amount: values.amount,
          code: values.code,
        })
        message.success(`已发放给 ${granted} 人`)
        props.reload()
        return true
      } catch (error) {
        // 参数不合法时验证码没被消耗 —— 改掉名单里的笔误,同一个码接着用
        message.error((error as RiceError).message)
        return false
      }
    }}
  >
    <ProFormItem label="发放账号">
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
          <DownloadTemplate temName={'grain_distribution'} />
        </div>
      </Flex>
      {recipients.length > 0 && (
        <div className={'mt-[8px] text-[12px] text-[#6F869F]'}>
          {fileName}：共 {recipients.length} 个收款人
        </div>
      )}
    </ProFormItem>
    <ProFormDigit
      label={'发放稻米'}
      name={'amount'}
      min={1}
      max={1_0000_0000}
      fieldProps={{ precision: 0 }}
      rules={[{ required: true, message: '请填写发放数量' }]}
    />
    <div className={S.content}>
      <p className={'m-0'}>为了保证账号安全，需验证成功后，再进行发送稻米操作。</p>
      <p className={'mb-[12px] mt-0'}>当前绑定账号：{encryptPhone(userInfo?.phone ?? '')}</p>
      <StyledProFormCaptcha
        label={'验证码'}
        name={'code'}
        onGetCaptcha={() => server.grants.challenge()}
      />
    </div>
  </ModalForm>
}

export default PlaceMultiPointsModal;
