const postTags = ['任务','商品','活动']

/** app.bsky.richtext.facet 的一段。这里只关心 tag 分支,其余 $type 原样带过。 */
type Feature = { $type: string; tag?: string }
type Facet = { features?: Feature[] }

export const getPostTag = (postRecord: Record<string, any>): string[]  => {
  if (!postRecord.facets) return []
  const allFeatures = (postRecord.facets as Facet[]).reduce<Feature[]>((acc, cur) => {
    const features = (cur.features ?? []).filter(f => f.$type === "app.bsky.richtext.facet#tag")

    return acc.concat(features)
  }, [])

  const tags = allFeatures
    .map(f => f.tag)
    .filter((tag): tag is string => !!tag && postTags.includes(tag))

  return tags
}

export const getPostNameList = (post: Record<string, any> = {}) => {
  const postTextArray = [post.record.text]

  if (post.embed && post.embed.$type === "app.bsky.embed.images#view") {
    const images = post.embed.images
    images.forEach(() => postTextArray.push('[图片]'))
  }
  if (post.embed && post.embed.$type === "app.bsky.embed.recordWithMedia#view") {
    const images = post.embed.media.images || []
    images.forEach(() => postTextArray.push('[图片]'))
  }

  return postTextArray
}