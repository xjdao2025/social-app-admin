import emtpyImg from '@/assets/list.no-data.svg';
import styles from './empty.module.less';
import { CSSProperties, ReactNode } from 'react';
import classNames from 'classnames';

type EmptyProps = {
  className?: string;
  style?: CSSProperties;
  text?: ReactNode;
  tips?: ReactNode;
  /** 用于衔接ConfigProvider.renderEmpty, 现在默认用于table */
  componentName?: string;
}

export default function Empty(props: EmptyProps) {
  const { text, tips, className, style, componentName } = props;
  return (
    <div className={classNames(styles.empty, styles[componentName?.toLocaleLowerCase() ?? ''] , className)} style={style}>
      <img src={emtpyImg} />
      <div className={styles.text}>{text || <span style={{ color: '#6F869F' }}>暂无数据</span>}</div>
      {tips ? <div className={styles.tips}>{tips}</div> : null}
    </div>
  )
}