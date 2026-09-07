import { CSSProperties } from "react";
import styles from './index.module.less';
import classNames from "classnames";

type GoBackProps = {
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}


export default function GoBack(props: GoBackProps) {
  const { className, style, onClick } = props;

  return (
    <div className={classNames(styles.goBack, className)} style={style} onClick={onClick}>
      <div className={styles.iconWrapper}>
        <BackIcon />
      </div>
      <span className={styles.label}>返回</span>
    </div>
  )

}






function BackIcon() {

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="red" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_373_568)">
        <path d="M3.29532 3.73732L0.682652 6.34998C0.258402 6.79456 0.021698 7.38547 0.021698 7.99999C0.021698 8.6145 0.258402 9.20541 0.682652 9.64999L3.29532 12.2627C3.38757 12.3582 3.49791 12.4343 3.61991 12.4868C3.74192 12.5392 3.87314 12.5668 4.00592 12.5679C4.1387 12.5691 4.27038 12.5438 4.39327 12.4935C4.51617 12.4432 4.62782 12.3689 4.72171 12.275C4.81561 12.1812 4.88986 12.0695 4.94014 11.9466C4.99042 11.8237 5.01572 11.692 5.01457 11.5593C5.01342 11.4265 4.98583 11.2953 4.93342 11.1732C4.88101 11.0512 4.80483 10.9409 4.70932 10.8487L2.85665 8.99465L15.0233 8.97932C15.2885 8.97932 15.5429 8.87396 15.7304 8.68643C15.918 8.49889 16.0233 8.24453 16.0233 7.97932C16.0233 7.7141 15.918 7.45975 15.7304 7.27221C15.5429 7.08467 15.2885 6.97932 15.0233 6.97932L2.86665 6.99465L4.70932 5.15132C4.89148 4.96271 4.99227 4.71011 4.98999 4.44792C4.98771 4.18572 4.88255 3.93491 4.69714 3.7495C4.51173 3.56409 4.26092 3.45892 3.99872 3.45664C3.73652 3.45436 3.48392 3.55516 3.29532 3.73732Z" fill="currentColor" />
      </g>
      <defs>
        <clipPath id="clip0_373_568">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>

  )
}