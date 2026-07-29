import server, { RiceError, type App } from "@/server/rice";
import { message, Typography } from "antd";
import type { FC } from 'react'
import AppModalForm from './AppModalForm'

const { Link } = Typography

type EditAppProps = {
  initialValues?: App
  reload?: () => void
}

const EditApp: FC<EditAppProps> = (props) => {
  const { initialValues, reload } = props

  return (
    <AppModalForm
      title={ '编辑' }
      trigger={ <Link>编辑</Link> }
      // 表单里的 logo 是附件 id,而列表里的 logo 是整个附件对象
      initialValues={ initialValues && { ...initialValues, logo_id: initialValues.logo?.id } }
      onFinish={ async values => {
        if (!initialValues) return false
        try {
          await server.apps.update(initialValues.id, values)
          reload?.()
          message.success('编辑成功');
          return true
        } catch (error) {
          message.error((error as RiceError).message)
          return false
        }
      } }
    />
  )
}

export default EditApp
