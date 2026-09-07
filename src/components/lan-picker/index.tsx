import { CSSProperties } from 'react';

type LanPickerProps = {
  className?: string;
  style?: CSSProperties;
}

/**
 * 语言选择器 —— **当前是关闭的**。
 *
 * 组件在真正 render 之前就 `return null`，`_app`、`login-page`、
 * `change-password` 三处仍然挂着它，只是什么都不画。原来的实现（Popover +
 * 地球图标 + 中英两项）连同 LanIcon / CheckIcon 两个内联 SVG 一起被注释在
 * 这个文件里，把 `Popover`、`content`、`LanIcon` 全变成了 tsc 眼里的死符号。
 *
 * 这里删掉那些死代码，保留组件本身和它的 props 类型 —— 三个调用点不用动。
 * 要重新启用就从 git history 里取回旧 body（连同 index.module.less 里还留着的
 * `.lanPicker` / `.tab` / `.overlay` 样式），并把 store/i18n.ts 的 persist
 * 一起补回去。
 */
export default function LanPicker(_props: LanPickerProps) {
  return null;
}
