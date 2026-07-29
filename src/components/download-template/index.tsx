import useTemplates from "@/hooks/useTemplates.ts";
import type { Templates } from "@/server/rice";

/**
 * 下载批量操作的 Excel 模板。
 *
 * core 返回的是两个裸 fileId,前端得自己拼 `/api/v1/file/download?fileId=…&fileType=2`;
 * rice 返回的是完整的附件对象,`url` 直接可用。
 */
const DownLoadTemplate = (props: {
  temName: keyof Templates
}) => {
  const { templates } = useTemplates()
  const attachment = templates?.[props.temName]

  // 模板没配时不给一个点了没反应的链接
  if (!attachment) return null

  return <a href={`${attachment.url}?download=1`} download={attachment.filename}>下载模板</a>
}

export default DownLoadTemplate;
