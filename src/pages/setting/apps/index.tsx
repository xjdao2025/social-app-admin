import OssImage from "@/components/oss-image";
import Page from "@/components/Page";
import server, { RiceError, type App } from "@/server/rice";
import { proColumn } from "@/utils/pro-column-builder";
import { MenuOutlined } from "@ant-design/icons";
import { DragSortTable, ProColumns } from "@ant-design/pro-components";
import { message, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import AddApp from "./AddApp";
import EditApp from "./EditApp";

const { Link } = Typography;

const Apps = () => {
  const [ dataSrc, setDataSrc ] = useState<App[]>([])

  const reload = async () => {
    try {
      setDataSrc(await server.apps.list())
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  useEffect(() => {
    reload()
  }, []);

  const delApp = async (id: string) => {
    try {
      await server.apps.remove(id);
      reload();
      message.success('删除成功');
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  const columns: ProColumns<App>[] = [
    proColumn('排序', 'position', { width: 120 }),
    proColumn('应用图标', 'logo', { width: 130 })
      ._render((_, record: App) => {
        return (
          <OssImage
            attachId={ record.logo?.id }
            className="w-14 h-14 rounded-3"
          />
        )
      }),
    proColumn('应用名称', 'name', { width: 200 }),
    proColumn('描述', 'description'),
    proColumn('链接', 'url', { ellipsis: true, width: 340 }),
    proColumn('操作', '', { width: 200 })
      ._option()
      ._render((_, record: App) => {
        return <Space size={ 'middle' }>
          <EditApp
            reload={ reload }
            initialValues={ record }
          />
          <Link
            type="danger"
            onClick={ () => delApp(record.id) }
          >删除</Link>
        </Space>
      }),
  ];

  const handleDragSortEnd = async (
    _beforeIndex: number,
    _afterIndex: number,
    newDataSource: App[],
  ) => {
    setDataSrc(newDataSource);
    try {
      // 整份顺序覆盖,服务端在一个事务里做完 —— core 是一条条更新的,
      // 中途失败会留下排到一半的顺序
      setDataSrc(await server.apps.reorder(newDataSource.map(item => item.id)))
      message.success('排序成功');
    } catch (error) {
      message.error((error as RiceError).message)
      reload()
    }
  };

  const dragHandleRender = (_rowData: App, idx: number) => (
    <>
      <MenuOutlined style={ { cursor: 'grab', color: '#909399' } }/>
      &nbsp;&nbsp;{ idx + 1 }
    </>
  );

  return <Page
    title={ '应用市场配置' }
    full
    className="bg-white"
  >
    <DragSortTable
      options={ false }
      headerTitle={ '应用列表' }
      columns={ columns }
      dataSource={ dataSrc }
      rowKey="id"
      search={ false }
      dragSortKey="position"
      onDragSortEnd={ handleDragSortEnd }
      dragSortHandlerRender={ dragHandleRender }
      toolBarRender={ () => [
        <AddApp reload={ reload }/>
      ] }
      pagination={ {
        pageSize: 1e10,
        showTotal: false,
        hideOnSinglePage: true
      } }
    />
  </Page>
}

export default Apps;