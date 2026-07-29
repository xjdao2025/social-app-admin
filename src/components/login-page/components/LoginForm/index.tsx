import { ProForm, ProFormDependency, ProFormText } from "@ant-design/pro-components";
import { useTranslation } from "react-i18next";

import styles from '../../form.module.less';
import { Button, message, Typography } from "antd";
import { useState } from "react";
import StyledProFormCaptcha from "@/components/form/ProFormCaptcha";
import useUserInfoStore from "@/store/userInfo";
import server, { RiceError } from "@/server/rice";
import { useNavigate } from "@/router";
import ProFormPassword from "@/components/styled-components/ProFormPassword";
import { useToast } from "@/components/styled-components/toast";

type LoginFormProps = {
  toForget: () => void;
}

/**
 * 管理端登录,两步。
 *
 * core 的流程是三步:`login-with-password` 只回一个 bool,验证码要前端自己去调
 * **公开的** `/sms/send`,最后 `login-with-verification-code` 换令牌 ——
 * 也就是不知道密码也能让管理员的手机响。
 *
 * rice 把前两步合成一个:`POST /admin/session/challenge` 密码对了**才**发码。
 * 所以第二步的「重新发送」也走同一个接口,得把密码再带上一次。
 */
export default function LoginForm(props: LoginFormProps) {
  const { toForget } = props
  const { t } = useTranslation("component.login");
  const [toast, toastContext] = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [form] = ProForm.useForm();
  const { login: systemLogin } = useUserInfoStore();
  const navigator = useNavigate();

  /** 发码 = 验密码 + 发码。第一步和第二步的「重新发送」共用。 */
  const sendCode = async () => {
    const { phone, password } = form.getFieldsValue();
    await server.session.challenge({ phone, phone_region: '86', password });
  };

  return (
    <>
      {toastContext}
      <div className={styles.formTitle}>{t(step === 1 ? "title.signin" : "title.2FA")}</div>
      <ProForm
        form={form}
        size="large"
        submitter={false}
        requiredMark={false}
        onFinish={async (fields) => {
          // 第一步:验密码换验证码。密码不对时 rice 不发码,也不告诉你是
          // 密码错还是账号不存在 —— 区分开就是一个「这个手机号是不是管理员」
          // 的探测器。
          if (step === 1) {
            try {
              await sendCode();
              setStep(2);
            } catch (error) {
              toast.show((error as RiceError).message);
            }
            return;
          }

          try {
            // 密码要再传一遍 —— 只有验证码不够,不然拿到短信的人就能登进去
            const session = await server.session.create({
              phone: fields.phone,
              phone_region: '86',
              password: fields.password,
              code: fields.code,
            });

            message.success('登录成功！')
            systemLogin(session);
            navigator("/");
          } catch (error) {
            toast.show((error as RiceError).message);
            throw error;
          }
        }}
      >
        <ProFormText
          name="phone"
          label={t("fields.account")}
          required={false}
          placeholder={'请输入手机号'}
          hidden={step === 2}
        />
        <ProFormPassword
          name="password"
          labelCol={{ prefixCls: styles.withActions }}
          placeholder={t("placeholder.password")}
          hidden={step === 2}
          label={(
            <>
              <span>{t("fields.password")}</span>
              <Typography.Link onClick={toForget}>{t("tips.forgetPassword")}</Typography.Link>
            </>
          )}
        />
        <ProFormDependency name={['phone']}>
          {({ phone }) => (
            <StyledProFormCaptcha
              name="code"
              phoneName="phone"
              onGetCaptcha={sendCode}
              label={`验证码将发至手机号 +86 ${phone}`}
              hidden={step === 1}
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
          )}
        </ProFormDependency>
        <ProFormDependency name={['phone', 'password', 'code']}>
          {({ phone, password, code }) => {
            const disabled = step === 1 ? (!phone || !password) : !code;
            return (
              <Button block disabled={disabled} type="primary" htmlType="submit">{step === 1 ? t("button.signin") : t("button.2fa")}</Button>
            )
          }}
        </ProFormDependency>
      </ProForm>
    </>
  )
}
