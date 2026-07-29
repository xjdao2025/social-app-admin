

import styles from './index.module.less';
import BgLeftBottom from './assets/bg.left.bottom.svg?react';
import BgRightTop from './assets/bg.right.top.svg?react';
import { ProForm, ProFormDependency, ProFormText } from '@ant-design/pro-components';
import GoBack from '@/components/go-back';
import LanPicker from '@/components/lan-picker';
import { useTranslation } from 'react-i18next';
import StyledProFormCaptcha from '@/components/form/ProFormCaptcha';
import useCurrentUserInfo from '@/hooks/useCurrentUserInfo';
import { Button, ConfigProvider, message } from 'antd';
import server, { RiceError } from '@/server/rice';
import { useNavigate } from '@/router';
import ProFormPassword from "@/components/styled-components/ProFormPassword";
import { useEffect, useState } from 'react';


export default function ChangePassword() {
  const { t, i18n } = useTranslation("page.change-password");
  const { userInfo, logout } = useCurrentUserInfo();
  const [form] = ProForm.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    form.validateFields();
  }, [i18n.language])

  return (
    <div className={styles.page}>
      <BgLeftBottom className={styles.bgLB} />
      <BgRightTop className={styles.bgRT} />
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.topActions}>
            <GoBack onClick={() => window.history.back()} />
            <LanPicker />
          </div>
          <div className={styles.form}>
            <div className={styles.formTitle}>{t("title")}</div>
            <div className={styles.info}>验证码将发送至手机号+86 {userInfo?.phone}，注意查收</div>
            <ConfigProvider
              theme={{
                token: { motion: false },
                components: {
                  Input: {
                    controlHeightLG: 54,
                  },
                  Form: {
                    labelFontSize: 16,
                    labelHeight: '24px',
                    verticalLabelPadding: '0 0 15px 0',
                    itemMarginBottom: 40,
                    // label
                  },
                  Button: {
                    controlHeightLG: 54,
                    // sizeLG: 66
                  },
                  Select: {
                    controlHeightLG: 54,
                  }
                }
              }}
            >
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
                    // rice 改完密码会撤销该管理员的全部会话,本地也得跟着清
                    message.success(t("success"));
                    logout();
                    navigate("/")
                  } catch (error) {
                    const { fields: fieldErrors, message: text } = error as RiceError;
                    const entries = Object.entries(fieldErrors);
                    if (entries.length) {
                      form.setFields(entries.map(([name, errors]) => ({ name, errors })));
                    } else {
                      message.error(text);
                    }
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {userInfo?.phone && <ProFormText name="phone" initialValue={userInfo?.phone} hidden />}
                {/* <ProFormText
                  name="email"
                  label={t("fields.email")}
                  placeholder=""
                /> */}
                <ProFormPassword
                  name="newPassword"
                  placeholder=""
                  // labelCol={{ prefixCls: styles.withActions }}
                  label={t("fields.password")}
                  fieldProps={{
                    autoComplete: 'new-password',
                    onChange() {
                      form.validateFields(["confirmNewPassword"]);
                    }
                  }}
                />
                <ProFormDependency name={["newPassword"]}>
                  {({ newPassword }) => (
                    <ProFormPassword
                      name="confirmNewPassword"
                      placeholder=""
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

                <StyledProFormCaptcha
                  name="code"
                  phoneName="phone"
                  onGetCaptcha={async (phone: string) => {
                    await server.passwords.challenge({ phone, phone_region: '86' });
                  }}
                  label={t("fields.verify-code")}
                />
                <ProFormDependency name={['newPassword', 'confirmNewPassword', 'code']}>
                  {({ newPassword, confirmNewPassword, code }) => {
                    const clickable = newPassword && confirmNewPassword && code;
                    return (
                      <Button loading={loading} block className={styles.submit} disabled={!clickable} type="primary" htmlType="submit">{t("button")}</Button>
                    )
                  }}
                </ProFormDependency>
              </ProForm>
            </ConfigProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

