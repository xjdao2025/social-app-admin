import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from '../../form.module.less';
import { ProForm, ProFormDependency, ProFormText } from "@ant-design/pro-components";
import { Button, message } from "antd";
import GoBack from "@/components/go-back";
import StyledProFormCaptcha from "@/components/form/ProFormCaptcha";
import server, { RiceError } from "@/server/rice";
import ProFormPassword from "@/components/styled-components/ProFormPassword";





type ForgetFormProps = {
  navBack: () => void;
}

export default function ForgetForm(props: ForgetFormProps) {
  const { t, i18n } = useTranslation("component.login");
  const [form] = ProForm.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    form.validateFields();
  }, [i18n.language])

  return (
    <>
      <GoBack className={styles.navBack} onClick={() => { props.navBack() }} />
      <div className={styles.formTitle}>{t("title.forgetPassword")}</div>
      <ProForm
        size="large"
        submitter={false}
        form={form}
        onFinish={async (fields) => {
          setLoading(true)
          try {
            await server.passwords.reset({
              phone: fields.phone,
              phone_region: '86',
              code: fields.code,
              password: fields.newPassword,
            });
            message.success(t("message.reset-sucess"));
            props.navBack();
          } catch (error) {
            // rice 按字段分组返回错误,直接贴回对应的输入框
            const { fields: fieldErrors, message: text } = error as RiceError;
            const entries = Object.entries(fieldErrors);
            if (entries.length) {
              form.setFields(entries.map(([name, errors]) => ({ name, errors })));
            } else {
              message.error(text);
            }
            throw error;
          } finally {
            setLoading(false);
          }
        }}
      >
        <ProFormText
          name="phone"
          label={'手机号'}
          placeholder={'请输入手机号'}
        />
        <StyledProFormCaptcha
          name="code"
          phoneName="phone"
          onGetCaptcha={async (phone: string) => {
            // 手机号不是管理员时服务端也返回 202 —— 不泄露谁是管理员
            await server.passwords.challenge({ phone, phone_region: '86' });
          }}
          placeholder={t("placeholder.verify-code")}
          label={t("fields.verify-code")}
          formItemProps={{
            className: styles.captcha
          }}
          fieldProps={{
            className: styles.input
          }}
          captchaProps={{
            className: styles.button
          }}
        />
        <ProFormPassword
          name="newPassword"
          placeholder={t("placeholder.new-password")}
          // labelCol={{ prefixCls: styles.withActions }}
          label={t("fields.new-password")}
          fieldProps={{
            autoComplete: "new-password",
            onChange() {
              form.validateFields(["confirmNewPassword"]);
            }
          }}
        />
        <ProFormDependency name={["newPassword"]}>
          {({ newPassword }) => (
            <ProFormPassword
              name="confirmNewPassword"
              placeholder={t("placeholder.confirm-password")}
              // labelCol={{ prefixCls: styles.withActions }}
              label={t("fields.confirm-password")}
              rules={[{
                validator(_, val) {
                  if (!val) return Promise.resolve();
                  if (val !== newPassword) {
                    return Promise.reject(t("tips.password-not-same"))
                  }
                  return Promise.resolve();
                }
              }]}
            />
          )}
        </ProFormDependency>
        <ProFormDependency name={['newPassword', 'confirmNewPassword', 'code']}>
          {({ newPassword, confirmNewPassword, code }) => {
            const clickable = newPassword && confirmNewPassword && code;
            return (
              <Button
                loading={loading}
                block
                disabled={!clickable}
                type="primary"
                htmlType="submit"
              >{t("button.reset-password")}</Button>
            )
          }}
        </ProFormDependency>
      </ProForm>
    </>
  )
}