import Page from "@/components/Page";
import { Link, useNavigate, useParams } from "@/router";
import server, { RiceError } from "@/server/rice";
import { useBoolean, useRequest } from "ahooks";
import { Breadcrumb, Button, Flex, message } from "antd";
import { type FC, useRef } from 'react'
import Editor, { type EditorApi } from '../_components/Editor'

const EditAnnouncement: FC = () => {
  const navigate = useNavigate()

  const { id } = useParams("/setting/announcements/edit/:id")

  const editorRef = useRef<EditorApi>(null)

  const [ loading, setLoading ] = useBoolean(false)


  useRequest(
    async () => server.announcements.get(id),
    {
      ready: Boolean(id),
      onSuccess: announcement => {
        // 正文在附件里,响应带的是完整 url
        if (announcement.attachment) {
          editorRef.current?.setData(announcement.title, announcement.attachment.url)
        } else {
          editorRef.current?.setData(announcement.title, '')
        }
      },
      onError: error => message.error((error as RiceError).message),
    }
  )

  const update = async () => {
    const editor = editorRef.current
    if (!editor) return

    try {
      editor.validate()
    } catch (error: any) {
      message.error(error.message)
      return
    }

    try {
      setLoading.setTrue()
      await server.announcements.update(id, await editor.getData())
      message.success("发布成功")
      navigate(-1)
    } catch (error) {
      message.error((error as RiceError).message)
    } finally {
      setLoading.setFalse()
    }

  }

  return (
    <Page
      title="编辑公告"
      full
      className="[&_nav.ant-breadcrumb]:font-normal flex flex-col"
    >
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/setting/announcements" className="bg-transparent! text-[#6F869F]">公告栏配置</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item className="font-500 text-[#0B0F14]">编辑公告</Breadcrumb.Item>
      </Breadcrumb>

      <Editor ref={ editorRef }/>

      <Flex
        justify="center"
        align="center"
        className="bg-white pb-5"
      >
        <Button
          type="primary"
          className="w-18"
          onClick={ update }
          loading={ loading }
        >
          发布
        </Button>
      </Flex>
    </Page>
  )
}

export default EditAnnouncement
