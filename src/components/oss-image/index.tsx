import { ImgHTMLAttributes } from "react";
import { Image } from "antd";
import { attachments } from "@/server/rice";

type OssImageProps = Omit<ImgHTMLAttributes<any>, 'src'> & {
  attachId?: string;
  defaultSrc?: string;
  preview?: boolean
  srcType?: 'id' | 'url'
}

/**
 * 附件 id → 可访问地址。
 *
 * core 的 id 里编着文件类型(`2-abc123` 这种,还得拆出来拼进 query),
 * rice 的附件 id 就是 id,地址是 `/api/attachments/<id>`。
 */
export function attachIdToUrl(attachId?: string) {
  return attachments.url(attachId);
}

export default function OssImage(props: OssImageProps) {
  const { attachId, defaultSrc, srcType = 'id', ...imgProps } = props;
  const src = (srcType === 'id' ? attachIdToUrl(attachId) : attachId) || defaultSrc;

  if (imgProps.preview) {
    return <Image {...imgProps} src={src}  />
  }

  return <img {...imgProps} src={src} />
}
