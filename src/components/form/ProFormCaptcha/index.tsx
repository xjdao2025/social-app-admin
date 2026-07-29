import { ConfigProvider } from "antd";
import styles from './index.module.less';
import { ProFormCaptcha, ProFormCaptchaProps, ProFormContext, ProFormDependency } from "@ant-design/pro-components";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { useContext, useRef } from "react";
import { useToast } from "@/components/styled-components/toast";

/**
 * 发验证码的按钮。
 *
 * **发码这件事由调用方给,不再有默认实现。** core 那边所有验证码都走同一个
 * **公开的** `/sms/send`,带一个 `codeType` 区分用途 —— 也就是说不知道密码
 * 也能让管理员的手机响。
 *
 * rice 没有这个公开接口:登录的码由 `POST /admin/session/challenge` 在**验过密码之后**
 * 发,发放的码由 `POST /admin/grain_grants/challenge` 发给管理员自己。
 * 各有各的前置条件,组件替它们决定不了。
 */
type StyledProFormCaptchaProps = Omit<ProFormCaptchaProps, 'onGetCaptcha'> & {
  onGetCaptcha: NonNullable<ProFormCaptchaProps['onGetCaptcha']>;
  /** 发送成功后的提示语。 */
  successMessage?: string;
}

export default function StyledProFormCaptcha(props: StyledProFormCaptchaProps) {
  const { onGetCaptcha, successMessage, ...restProps } = props;
  const { t } = useTranslation("component.captcha")
  const formCtx = useContext(ProFormContext);
  const [toast, toastContext] = useToast();
  const isFirstSendRef = useRef(true);
  return (
    <ConfigProvider wave={{ disabled: true }}>
      <ProFormCaptcha
        {...restProps}
        formItemProps={{ ...restProps.formItemProps, className: classNames(styles.styledCaptcha, restProps.formItemProps?.className) }}
        fieldProps={{
          variant: 'borderless',
          ...restProps.fieldProps,
          className: classNames(styles.input, restProps.fieldProps?.className),
          onChange() {
            formCtx.formRef?.current.setFields([
              {
                name: restProps.name,
                errors: []
              }
            ])
          }
        }}
        captchaProps={{ autoInsertSpace: false, ...restProps.captchaProps, className: classNames(styles.button, restProps.captchaProps?.className) }}
        captchaTextRender={(timing, count) => {
          if (!timing) return isFirstSendRef.current ? t("send") : t("retry");
          return `${count}s`;
        }}
        onGetCaptcha={async (receiver: string) => {
          await onGetCaptcha(receiver);
          toast.show(successMessage ?? t("message.success"));
          isFirstSendRef.current = false;
        }}
      />
      {toastContext}
      {
        restProps.phoneName
          ? (
            <ProFormDependency name={[restProps.phoneName]}>
              {() => {
                isFirstSendRef.current = true;
                return null;
              }}
            </ProFormDependency>
          )
          : null
      }
    </ConfigProvider>
  )
}
