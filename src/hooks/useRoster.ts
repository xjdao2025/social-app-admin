import { message } from 'antd'
import { useRef, useState } from 'react'
import { parseRecipients } from '@/utils/recipients'

/**
 * 批量发放 / 批量授勋的名单选择。
 *
 * 解析是异步的,而这份名单决定钱和勋章发给谁,所以有两个必须挡住的坑:
 *
 *   1. **旧名单残留。** 选了一个空文件或坏文件之后,如果只是弹个错就返回,
 *      `recipients` 还留着上一份 —— 界面显示着新文件名,点确认发的是旧名单。
 *      所以每次选择先清空。
 *   2. **迟到的结果盖住新的。** 连着选两个文件,先解析完的未必是后选的那个。
 *      每次选择发一个递增的号,只有最新那次的结果算数。
 *
 * `parsing` 给调用方禁用提交按钮用 —— 解析没完就不该能点确认。
 */
export function useRoster(labels: { empty: string; failed: string; ok: (n: number) => string }) {
  const [recipients, setRecipients] = useState<string[]>([])
  const [fileName, setFileName] = useState('')
  const [parsing, setParsing] = useState(false)
  const tokenRef = useRef(0)

  const clear = () => {
    setRecipients([])
    setFileName('')
  }

  const select = async (file: File) => {
    const token = ++tokenRef.current

    // 先清空再解析:中间这段时间里点确认,发的应该是"没有名单",不是上一份
    clear()
    setParsing(true)

    try {
      const list = await parseRecipients(file)

      // 已经有更晚的一次选择了,这次的结果作废
      if (token !== tokenRef.current) return

      if (!list.length) {
        message.error(labels.empty)
        return
      }

      setRecipients(list)
      setFileName(file.name)
      message.success(labels.ok(list.length))
    } catch {
      if (token !== tokenRef.current) return
      message.error(labels.failed)
    } finally {
      if (token === tokenRef.current) setParsing(false)
    }
  }

  /** 弹窗关闭时调用 —— 下次打开不该还留着上次的名单。 */
  const reset = () => {
    tokenRef.current++
    clear()
    setParsing(false)
  }

  return { recipients, fileName, parsing, select, reset }
}
