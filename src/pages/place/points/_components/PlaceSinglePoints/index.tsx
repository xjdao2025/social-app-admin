import { ModalForm, ProFormDigit, ProFormText } from "@ant-design/pro-components";
import { Button, Flex, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import StyledProFormCaptcha from "@/components/form/ProFormCaptcha";
import S from './index.module.less'
import useCurrentUserInfo from "@/hooks/useCurrentUserInfo.ts";
import { encryptPhone } from "@/utils/tool.ts";
import server, { RiceError } from "@/server/rice";

/**
 * 单个发放。
 *
 * rice 的 single / batch 是同一个接口 —— 收款人永远是数组,发一个人就是长度 1。
 *
 * 验证码发到**管理员自己**手机上,和 core 一样:令牌可能被人从浏览器里捞走,
 * 短信在管理员自己手上,发钱要两样都有。core 是靠公开的 `/sms/send` 发的,
 * rice 有一个专门的 `grain_grants/challenge`。
 */
const PlaceSinglePointsModal = (props: { reload: () => void }) => {
  const { userInfo } = useCurrentUserInfo()

  return <ModalForm
    trigger={<Button type={'primary'} icon={<PlusOutlined />}>单个发放</Button>}
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
    modalProps={{
      centered: true,
      destroyOnClose: true,
    }}
    onFinish={async (values: { recipient: string; amount: number; code: string }) => {
      try {
        await server.grants.create({
          to: [values.recipient],
          amount: values.amount,
          code: values.code,
        })
        message.success('发送成功')
        props.reload()
        return true
      } catch (error) {
        message.error((error as RiceError).message)
        return false
      }
    }}
  >
    <ProFormText
      label={'发放账号'}
      name={'recipient'}
      placeholder={'手机号 / 邮箱 / 域名 / DID'}
      rules={[{ required: true, message: '请填写发放账号' }]}
    />
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
      {/* 码是发给当前管理员的,不需要填手机号 —— 服务端从令牌上认人 */}
      <StyledProFormCaptcha
        label={'验证码'}
        name={'code'}
        onGetCaptcha={() => server.grants.challenge()}
      />
    </div>
  </ModalForm>
}

export default PlaceSinglePointsModal;
