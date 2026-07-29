import Page from "@/components/Page";
import { ProCard, ProForm, ProFormDigit } from "@ant-design/pro-components";
import ProFormUploadFile from "@/components/styled-components/ProFormUploadFile";
import { Flex, Form, message, Typography } from "antd";
import S from './index.module.less'
import { useBoolean, useRequest } from "ahooks";
import server, { RiceError, type SiteSettings } from "@/server/rice";
import { useEffect } from "react";

const FoundationSetting = () => {
  const [editable, { toggle, setTrue, setFalse }] = useBoolean(false)
  const [form] = Form.useForm()
  
  const { data: globalConfig, refresh: updateGlobalConfig } = useRequest(() => server.settings.get())

  useEffect(() => {
    if (!globalConfig) return
    // 表单里的文件是附件 id 数组,响应里是附件对象数组
    form.setFieldsValue({
      ...globalConfig,
      document_ids: globalConfig.documents.map(doc => doc.id),
    })
  }, [globalConfig])

  const submit = () => {
    form.submit();
    // setFalse()
  }
  useEffect(() => {
    if (!editable) {
      updateGlobalConfig();
    }
  }, [editable])

  return <Page
    title={'乡建DAO金库财务公示'}
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
        onFinish={async (fields: Partial<SiteSettings> & { document_ids?: string | string[] }) => {
          try {
            // document_ids 传了就是整份替换,顺序即展示顺序
            await server.settings.update({
              fund_scale: fields.fund_scale,
              document_ids: ([] as string[]).concat(fields.document_ids ?? []),
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
          label={'金库规模'}
          name={'fund_scale'}
          placeholder={'0'}
          width={405}
          fieldProps={{ precision: 0 }}
        />
        <ProFormDigit
          readonly
          label={'发行稻米规模'}
          name={'issued_grain_scale'}
          placeholder={'0'}
          width={405}
          fieldProps={{ precision: 0 }}
        />
        <ProFormUploadFile
          disabled={!editable}
          label={'金库信息公开文件'}
          buttonText={'上传PDF'}
          accept={'.pdf'}
          name={'document_ids'}
        />
      </ProForm>
    </ProCard>
  </Page>
}

export default FoundationSetting;