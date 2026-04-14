
import { Typography } from "antd";
import type { TextProps } from "antd/lib/typography/Text";
import classNames from "classnames";
import styles from './typo-text.module.less';
import CopyIcon from './assets/copy.svg?react';
import QRCodePopover from "./qrcode-popover";
import { useMemo } from "react";

export interface TypoTextProps extends TextProps {
  qrcode?: boolean
}


export default function TypoText(props: TypoTextProps) {
  const { title, qrcode, ...restProps } = props;

  const contentStr = useMemo(() => {
    let mayContent = typeof restProps.copyable === 'object' ? restProps.copyable.text : restProps.children;
    if (typeof mayContent !== 'string') {
      mayContent = title;
    }
    if (typeof mayContent !== 'string') {
      console.error("TypoText: 接收到非字符串数据", mayContent);
      return '';
    }
    return mayContent;
  }, [restProps.copyable, restProps.children, title])

  return (
    <>
      <Typography.Text
        {...restProps}
        className={classNames(styles.typoText, restProps.className)}
        copyable={restProps.copyable && {
          icon: [<CopyIcon className={styles.copy} key="copy-icon" />],
          ...(typeof restProps.copyable === 'object' ? restProps.copyable : {})
        }}
      />
      {qrcode && <QRCodePopover className={styles.qrcode} value={contentStr} />}
    </>
  )
}