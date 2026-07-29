import Page from "@/components/Page";
import { Link, useNavigate } from "@/router";
import server, { RiceError } from "@/server/rice";
import { useBoolean } from "ahooks";
import { Breadcrumb, Button, Flex, message } from "antd";
import { type FC, useRef } from 'react'
import Editor, { type EditorApi } from '../_components/Editor'

const NewAnnouncement: FC = () => {
  const navigate = useNavigate()

  const editorRef = useRef<EditorApi>(null)

  const [ loading, setLoading ] = useBoolean(false)

  const post = async () => {
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
      await server.announcements.create(await editor.getData())
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
      title="新增公告"
      full
      className="[&_nav.ant-breadcrumb]:font-normal flex flex-col"
    >
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/setting/announcements" className="bg-transparent! text-[#6F869F]">公告栏配置</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item className="font-500 text-[#0B0F14]">新增公告</Breadcrumb.Item>
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
          onClick={ post }
          loading={ loading }
        >
          发布
        </Button>
      </Flex>
    </Page>
  )
}

export default NewAnnouncement
