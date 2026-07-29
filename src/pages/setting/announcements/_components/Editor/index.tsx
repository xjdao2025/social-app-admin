import QuillEditor, { type QuillEditorApi } from '@/components/Quill'
import server from "@/server/rice";
import { Input } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import S from './index.module.less'

export type EditorApi = {
  validate: () => void
  getData: () => Promise<{ title: string, attachment_id: string }>
  setData: (title: string, attachmentUrl: string) => Promise<void>
}

type EditorProps = {}

const Editor = forwardRef<EditorApi, EditorProps>((_props, ref) => {

  const quillRef = useRef<QuillEditorApi>(null)

  const [ title, setTitle ] = useState('')

  useImperativeHandle(
    ref,
    () => {
      return {
        validate: () => {
          if (!title) {
            throw new Error("请输入公告标题")
          }

          if (!quillRef.current?.getHtml()) {
            throw new Error("请输入公告内容")
          }
        },
        getData: async () => {
          const content = quillRef.current?.getHtml() ?? ""

          // 公告正文是一个 html 附件,不是库里的一个字段 —— core 也是这么存的
          const attachment = await server.attachments.upload(
            new File([ content ], "announcement.html", { type: "text/html" }),
            'file'
          );

          return {
            title,
            attachment_id: attachment.id
          }
        },
        setData: async (title: string, attachmentUrl: string) => {
          setTitle(title)

          // 没有正文附件时什么都不做。`fetch('')` 会去取当前页面 ——
          // 也就是把这个单页应用的 index.html 灌进编辑器。
          if (!attachmentUrl) return

          // 附件是公开可读的,直接 fetch 就行,不必走带令牌的客户端
          const response = await fetch(attachmentUrl)
          if (!response.ok) return

          quillRef.current?.setHtml(await response.text())
        }
      }
    }
  )


  return (
    <div className={ S.wrap }>
      <div className={ S.contents }>

        <div className={ S.title }>
          <label className={ S.label } htmlFor="announcement-title">标题：</label>
          <Input
            id="announcement-title"
            className={ S.input }
            size="small"
            placeholder="请输入"
            value={ title }
            onChange={ e => setTitle(e.target.value) }
          />
        </div>

        <QuillEditor
          ref={ quillRef }
          className={ S.editor }
        />
      </div>
    </div>
  )
})

export default Editor
