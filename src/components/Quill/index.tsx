import { attachIdToUrl } from "@/components/oss-image";
import server from "@/server/rice";
import DOMPurify from 'dompurify';
import Quill from 'quill'
import "quill/dist/quill.core.css";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import "quill/dist/quill.snow.css";

const AlignStyle = Quill.import('attributors/style/align');
Quill.register(AlignStyle, true);

type QuillEditorProps = {
  className?: string
}

export type QuillEditorApi = {
  getHtml: () => string
  setHtml: (html: string) => void
}

const QuillEditor = forwardRef<QuillEditorApi, QuillEditorProps>((props, ref) => {
  const { className } = props


  const [ container, setContainer ] = useState<HTMLDivElement | null>(null)
  const editorRef = useRef<Quill | null>(null)

  useImperativeHandle(
    ref,
    () => {
      return {
        getHtml: () => editorRef.current?.getSemanticHTML() ?? "",
        setHtml: (html: string) => {
          const safeHtml = DOMPurify.sanitize(html)
          editorRef.current?.clipboard.dangerouslyPasteHTML(safeHtml)
        }
      }
    }
  )

  useEffect(
    () => {
      if (!container) return

      const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

      const editor = new Quill(editorContainer, {
        theme: 'snow',
        placeholder: "请输入内容",
        modules: {
          toolbar: {
            container: [
              [ { header: [1, 2, 3, 4, 5, 6, false] } ],
              [ 'bold', 'italic', 'underline' ],
              [ 'link', 'image' ],
              [ { 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] } ],
            ],
            handlers: {
              image: function () {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();
                input.onchange = async function (event) {
                  // @ts-ignore
                  const { id: fileId } = await server.attachments.upload(event.target.files[0], 'image');
                  const url = attachIdToUrl(fileId)
                  const cursorPosition = editor.getSelection()?.index ?? 0;
                  editor.insertEmbed(
                    cursorPosition,
                    'image',
                    url
                  )
                  editor.setSelection(cursorPosition + 1);
                };
              }
            }
          }
        },
      })
      editorRef.current = editor

      return () => {
        editorRef.current = null
        container.innerHTML = ''
      }

    },
    [ container ]
  )

  return (
    <div
      ref={ setContainer }
      className={ className }
    />
  )
})

export default QuillEditor
