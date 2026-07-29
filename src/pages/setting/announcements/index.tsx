import Page from "@/components/Page";
import { Link as RouteLink } from '@/router.ts'
import server, { RiceError, type Announcement } from "@/server/rice";
import { proColumn } from "@/utils/pro-column-builder";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { DragSortTable, ProColumns } from "@ant-design/pro-components";
import { useRequest } from "ahooks";
import { Button, message, Space, Typography } from "antd";
import dayjs from "dayjs";
import { type FC } from "react";

const { Link } = Typography;

const Announcements: FC = () => {

  const {
    data: anncList,
    loading: anncListLoading,
    refresh: refreshAnncList,
    mutate: updateAnncList
  } = useRequest(async () => server.announcements.list())

  const {
    run: delAnnc
  } = useRequest(
    async (id: string) => server.announcements.remove(id),
    {
      manual: true,
      onError: error => message.error((error as RiceError).message),
      onFinally: refreshAnncList
    }
  )

  const columns: ProColumns<Announcement>[] = [
    proColumn('排序', 'position', { width: 120 }),
    proColumn('标题', 'title', { width: 340 }),
    proColumn('发布时间', 'inserted_at', { ellipsis: true, width: 340 })
      ._render((_, record: Announcement) => {
        return dayjs(record.inserted_at).format('YYYY-MM-DD HH:mm:ss')
      }),
    proColumn('操作', '', { width: 300 })
      ._option()
      ._render((_, record: Announcement) => {
        return (
          <Space size={ 'middle' }>
            <RouteLink to="/setting/announcements/edit/:id" params={ { id: record.id } }>编辑</RouteLink>
            <Link
              type="danger"
              onClick={ () => delAnnc(record.id) }
            >删除</Link>
          </Space>
        )
      }),
  ];

  const handleDragSortEnd = async (
    _beforeIndex: number,
    _afterIndex: number,
    newDataSource: Announcement[],
  ) => {
    updateAnncList(newDataSource);
    try {
      updateAnncList(await server.announcements.reorder(newDataSource.map(item => item.id)))
      message.success('排序成功');
    } catch (error) {
      message.error((error as RiceError).message)
      refreshAnncList()
    }
  };

  const dragHandleRender = (_rowData: Announcement, idx: number) => (
    <>
      <MenuOutlined style={ { cursor: 'grab', color: '#909399' } }/>
      &nbsp;&nbsp;{ idx + 1 }
    </>
  );

  return <Page
    title={ '公告栏配置' }
    full
    className="bg-white"
  >
    <DragSortTable
      options={ false }
      headerTitle={ '公告列表' }
      columns={ columns }
      loading={ anncListLoading }
      dataSource={ anncList! }
      rowKey="id"
      search={ false }
      dragSortKey="position"
      onDragSortEnd={ handleDragSortEnd }
      dragSortHandlerRender={ dragHandleRender }
      toolBarRender={ () => [
        <RouteLink to="/setting/announcements/new">
          <Button type={ 'primary' } icon={ <PlusOutlined/> }>新增</Button>
        </RouteLink>
      ] }
      pagination={ {
        showTotal: false,
        hideOnSinglePage: true
      } }
    />
  </Page>
}

export default Announcements;