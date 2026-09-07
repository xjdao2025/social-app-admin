import Page from "@/components/Page";
import { ProCard, ProForm, ProFormDigit } from "@ant-design/pro-components";
import S from './index.module.less'
import { Flex, Form, message, Typography } from "antd";
import { useBoolean, useRequest } from "ahooks";
import server, { RiceError, type SiteSettings } from "@/server/rice";
import { useEffect } from "react";

const ProposalSetting = () => {
  const [editable, { setTrue, setFalse }] = useBoolean(false)
  const [form] = Form.useForm()

  const { data: globalConfig, refresh: updateGlobalConfig } = useRequest(() => server.settings.get())

  useEffect(() => {
    if (!globalConfig) return
    form.setFieldsValue(globalConfig)
  }, [globalConfig])

  const submit = () => {
    form.submit();
    // setFalse()
  }

  useEffect(() => {
    if(!editable) {
      updateGlobalConfig();
    }
  }, [editable])

  return <Page
    title={'提案配置'}
    full
    className={'bg-white'}
  >
    <ProCard
      title={'配置项'}
      extra={<Flex gap={10}>
        {editable ? <>
          <Typography.Link onClick={setFalse}>取消</Typography.Link>
          <Typography.Link onClick={submit}>提交</Typography.Link>
        </> : <Typography.Link onClick={setTrue}>编辑</Typography.Link>}
      </Flex>}
      className={S.card}
    >
      <ProForm
        form={form}
        submitter={false}
        initialValues={globalConfig || {}}
        onFinish={async (fields: Partial<SiteSettings>) => {
          try {
            // 只传这一个字段 —— 别的配置项不受影响。core 是三个接口改同一行,
            // 这里是同一个 PATCH,所以更要小心别把没填的字段一起提交了。
            await server.settings.update({
              proposal_approval_votes: fields.proposal_approval_votes,
            });
            setFalse();
            message.success('编辑成功')
            return true
          } catch (error) {
            message.error((error as RiceError).message);
            return false;
          }
        }}
      >
        <ProFormDigit
          disabled={!editable}
          label={'提案通过票数设置'}
          name={'proposal_approval_votes'}
          placeholder={'0'}
          width={405}
          fieldProps={{ precision: 0 }}
        />
      </ProForm>
    </ProCard>
  </Page>
}

export default ProposalSetting;