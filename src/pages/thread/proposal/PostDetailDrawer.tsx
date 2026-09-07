import S from "./index.module.less";
import { Button, Divider, Drawer, Flex, List, message, Popconfirm, Typography } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import cx from "classnames";
import { useBoolean, useRequest } from "ahooks";
import server, { RiceError, type ProposalDetail } from "@/server/rice";
import { ProDescriptions } from "@ant-design/pro-components";
import { ProposalStatus } from "./index.tsx";
import dayjs from "dayjs";
import VoteProgress from "./VoteProgress.tsx";
import InitiatorAvatar from "./InitiatorAvatar.tsx";

const timeFormat = 'YYYY/MM/DD HH:mm:ss'

const PostDetailDrawer = (props:
                            {
                              proposalId: string;
                              takeDown: () => void
                            }
) => {
  const [drawerVis, { setTrue, setFalse }] = useBoolean(false)
  const { data: detail, refresh } = useRequest(
    () => server.proposals.get(props.proposalId),
    {
      ready: drawerVis,
      onError: error => message.error((error as RiceError).message),
    }
  )

  // 提案正文是一个附件。附件公开可读,直接 fetch 就行,不必走带令牌的客户端。
  const { data: proposalContent } = useRequest(async () => {
    const response = await fetch(detail!.attachment!.url)
    return await response.text()
  }, {
    ready: !!detail?.attachment,
    refreshDeps: [detail?.attachment?.url]
  })

  const handleDeleteComment = async (commentId: string) => {
    try {
      await server.proposals.removeComment(props.proposalId, commentId)
      refresh()
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  return <>
    <Typography.Link onClick={setTrue}>详情</Typography.Link>
    <Drawer
      open={drawerVis}
      className={S.drawer}
      width={600}
      title={'查看'}
      onClose={setFalse}
      footer={<Flex
        gap={8}
        justify={'end'}
      >
        <Button onClick={setFalse}>取消</Button>
        {detail?.listed && <Button
          type="primary"
          onClick={() => {
            props.takeDown()
            setFalse()
          }}
        >下架</Button>}
      </Flex>}
    >
      <div className={S.header}>
        {detail?.title}
      </div>
      <InitiatorAvatar
        avatar={detail?.author?.avatar?.url}
        name={detail?.author?.nickname || detail?.author?.handle}
        className={'mt-[16px] mb-[16px]'}
      />
      <ProDescriptions<ProposalDetail>
        className={S.proDes}
        dataSource={detail!}
        column={2}
        columns={[{
          title: '发布时间',
          dataIndex: 'inserted_at',
          render: (_, record) => dayjs(record.inserted_at).format(timeFormat),
        }, {
          title: '截止时间',
          dataIndex: 'closes_at',
          render: (_, record) => dayjs(record.closes_at).format(timeFormat),
        }, {
          title: '提案状态',
          dataIndex: 'status',
          valueEnum: ProposalStatus
        }]}
      />

      <Divider className={'mt-[12px] mb-[20px] border-[#D4DBE2]'} />

      <pre dangerouslySetInnerHTML={{ __html: proposalContent ?? '' }} />

      <div className={S.voteWrap}>
        <p className={S.title}>总投票数</p>
        <div className={S.content}>
          <div className={cx(S.progress, 'mb-[12px]')}>
            <span className={S.type}>同意</span>
            <VoteProgress
              numerator={detail?.agree_count}
              denominator={detail?.total_votes}
            />
          </div>
          <div className={S.progress}>
            <span className={S.type}>反对</span>
            <VoteProgress
              numerator={detail?.oppose_count}
              denominator={detail?.total_votes}
              color={'#FD615B'}
            />
          </div>
        </div>
      </div>

      {(detail?.comments?.length || 0) > 0 && (
        <div className={S.commentWrap}>
          <p className={S.title}>评论</p>
          <List
            className={S.commentList}
            dataSource={detail?.comments}
            renderItem={(item) => (
              <List.Item className={S.commentItem}>
                <div className={S.commentHeader}>
                  <div className={S.commentMeta}>
                    <span className={S.commentUser}>{item.author?.nickname || item.author?.handle}</span>
                    <span className={S.commentTime}>{dayjs(item.inserted_at).format(timeFormat)}</span>
                  </div>
                  <Popconfirm
                    title="确定删除该评论？"
                    onConfirm={() => handleDeleteComment(item.id)}
                  >
                    <DeleteOutlined className={S.commentDelete} />
                  </Popconfirm>
                </div>
                <div className={S.commentContent}>{item.body}</div>
              </List.Item>
            )}
          />
        </div>
      )}
    </Drawer>
  </>
}

export default PostDetailDrawer;
