import S from "./index.module.less";
import { Button, Drawer, Flex, Typography } from "antd";
import { useBoolean } from "ahooks";
import InitiatorAvatar from "@/pages/thread/proposal/InitiatorAvatar.tsx";
import dayjs from "dayjs";
import OssImage from "@/components/oss-image";
import { useMemo } from "react";
import { getPostTag } from "@/pages/thread/list/utils.ts";

/** app.bsky.richtext.facet 里我们用到的部分。 */
type Facet = {
  index: { byteStart: number; byteEnd: number }
  features: { $type: string; uri?: string; did?: string }[]
}

/** app.bsky.embed.images#view 的一张图。 */
type EmbedImage = { fullsize: string }

const PostDetailDrawer = ({ post = {}, takeOff }: {
  post: any
  takeOff: () => void
}) => {
  const author = post?.author
  const [visible, { setTrue, setFalse }] = useBoolean(false)

  const constructHtml = useMemo(() => {
    if (!visible) return ""
    const originText = post.record?.text
    const originTextUnit8 = new TextEncoder().encode(originText)

    const newText = ((post.record.facets || []) as Facet[]).reduce<string>((acc, facet) => {
      const { byteStart, byteEnd } = facet.index
      const feature = facet.features[0]
      if (["app.bsky.richtext.facet#link", "app.bsky.richtext.facet#mention"].includes(feature.$type)) {
        const oldUnit8 = originTextUnit8.slice(byteStart, byteEnd)
        const oldText = new TextDecoder().decode(oldUnit8)

        const isMention = feature.$type === "app.bsky.richtext.facet#mention"

        return acc.replace(oldText, `<a href="${isMention ? '' :feature.uri}" target="${isMention? '' : '_blank'}">${oldText}</a>`)
      }
      return acc
    }, originText)

    return newText?.replace(/(^|\s)(#\S+)((?=\s?))/g, "$1<a href=''>$2</a>$3") ?? ''
  }, [post, visible])

  const tags = useMemo(() => {
    return getPostTag(post.record)
  }, [post])

  return <>
    <Typography.Link onClick={setTrue}>详情</Typography.Link>
    <Drawer
      open={visible}
      className={S.drawer}
      width={600}
      title={'查看'}
      footer={<Flex gap={8} justify={'end'}>
        <Button onClick={setFalse}>取消</Button>
        <Button
          type="primary"
          onClick={() => {
            takeOff()
            setFalse()
          }}
        >下架</Button>
      </Flex>}
      onClose={setFalse}
    >
      <div className={S.header}>
        <InitiatorAvatar avatar={author.avatar} name={author.displayName || author.handle} />
        <div className={S.publish}>发布时间：{dayjs(post.indexedAt).format('YYYY/MM/DD HH:mm:ss')}</div>
        {tags.map(t => <span className={S.tag}>{t}</span>)}
      </div>
      <pre className={S.postContent} dangerouslySetInnerHTML={{ __html: constructHtml }} />
      <div className={'flex gap-[3px]'}>
        {post.embed?.media?.images?.map((image: EmbedImage) => {
          return <OssImage attachId={image.fullsize} srcType={'url'} className={'flex-1 max-h-[250px]'} preview />
        })}
        {post.embed?.images?.map((image: EmbedImage) => {
          return <OssImage attachId={image.fullsize} srcType={'url'} className={'flex-1 max-h-[250px]'} preview />
        })}
      </div>
    </Drawer>
  </>
}

export default PostDetailDrawer;