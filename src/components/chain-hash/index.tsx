import { isNil } from "lodash";
import styles from './index.module.less';
import TypoText from "./typo-text";
import { QRCode, Tooltip } from "antd";
import { useMemo } from "react";


const defaultEllipsisConfig = { head: 10, tail: -6 };

type ChainHashProps = {
  hash?: string;
  /**
   * 复制功能的位置 默认为false
   * * false: 不显示复制功能
   * * true: 复制按钮追加的文字后面
   * * 'tooltip': 复制按钮在tooltip内
   * */
  copyable?: false | 'tooltip' | true;
  /**
   * 二维码功能的位置 默认为false
   * * false: 不显示
   * * true: 二维码图标展示在文案尾部，并点击弹窗弹窗展示二维码
   * * 'tooltip': 二维码直接展示在tooltip内
   * */
  qrcode?: false | 'tooltip' | true;
  /**
   * 缩略展示 true时使用默认的规则
   */
  ellipsis?: boolean | { head?: number, tail?: number };
  /**
   * hash跳转地址
   */
  url?: string
}


export const renderHash = (hash: string | undefined, ellipsis: NonNullable<ChainHashProps['ellipsis']>) => {
  if (!ellipsis || !hash) return hash;
  const { head, tail } = ellipsis === true ? defaultEllipsisConfig : ellipsis;
  const ellipsisLen = (head || 0) + (isNil(tail) ? 0 : (tail < 0 ? -tail : hash.slice(tail).length)); // ((tail || 0) < 0 ? -(tail || 0) : hash.slice(tail).length);

  if (hash.length <= ellipsisLen) return hash;
  return (
    <>
      {hash.slice(0, head)}<span className={styles.ellipsis} />{!!tail ? hash.slice(tail) : ''}
    </>
  )
}

export default function ChainHash(props: ChainHashProps) {
  const { hash, ...rest } = props;

  if (!hash) return <span>-</span>;

  return <ChainHashInner hash={hash} {...rest} />
}


function ChainHashInner(props: ChainHashProps & { hash: NonNullable<ChainHashProps['hash']> }) {
  const { hash, qrcode = false, ellipsis = false, copyable = false, url } = props;
  const displayHash = useMemo(() => renderHash(hash, ellipsis), [hash, ellipsis]);
  const tooltipContent = useMemo(() => {
    const text = displayHash !== hash ? hash : undefined;
    const showCopy = copyable === 'tooltip';
    const showQrcode = qrcode === 'tooltip';

    if (!text && !showCopy && !showQrcode) return undefined;

    const content = (
      <div className={styles.popover}>
        {(text || showCopy) && <TypoText copyable={showCopy} >{hash}</TypoText>}
        {showQrcode && <QRCode className={styles.qrcode} size={150} value={hash} />}
      </div>
    );
    return content;
  }, [displayHash, hash, copyable, qrcode])

  return (
    <TypoText
      copyable={copyable === true ? { text: hash } : false}
      qrcode={qrcode === true}
      title={hash}
    >
      <Tooltip title={tooltipContent}>
        {url ? <a href={url} target={'_blank'}>{displayHash}</a> : <span className={styles.hash}>{displayHash}</span>}
      </Tooltip>
    </TypoText>
  )
}