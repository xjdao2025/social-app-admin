import Page from "@/components/Page";
import { DragSortTable, ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { proColumn } from "@/utils/pro-column-builder";
import { Button, message, Space, Typography } from "antd";
import server, { RiceError, type Banner as BannerType } from "@/server/rice";
import OssImage from "@/components/oss-image";
import AddBanner from "@/pages/setting/banner/AddBanner.tsx";

const { Link } = Typography;

const Banner = () => {
  const [dataSrc, setDataSrc] = useState<BannerType[]>([])

  const reload = async () => {
    try {
      setDataSrc(await server.banners.list())
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  useEffect(() => {
    reload()
  }, []);

  const delBanner = async (id: string) => {
    try {
      await server.banners.remove(id);
      reload();
      message.success('删除成功');
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  const columns: ProColumns<BannerType>[] = [
    proColumn('排序', 'position'),
    proColumn('Banner', 'image')
      ._render((_, record: BannerType) => {
        return <OssImage attachId={record.image?.id} className={'w-[188px] h-[100px]'} />
      }),
    proColumn('链接', 'url'),
    proColumn('操作')
      ._option()
      ._render((_, record: BannerType) => {
        return <Space size={'middle'}>
          <AddBanner
            title={'编辑'}
            trigger={
              <Link>编辑</Link>
            }
            reload={reload}
            initialValues={record}
          />
          <Link type="danger" onClick={() => delBanner(record.id)}>删除</Link>
        </Space>
      }),
  ];

  const handleDragSortEnd = async (
    _beforeIndex: number,
    _afterIndex: number,
    newDataSource: BannerType[],
  ) => {
    setDataSrc(newDataSource);
    try {
      setDataSrc(await server.banners.reorder(newDataSource.map(item => item.id)))
      message.success('排序成功');
    } catch (error) {
      message.error((error as RiceError).message)
      reload()
    }
  };

  const dragHandleRender = (_rowData: BannerType, idx: number) => (
    <>
      <MenuOutlined style={{ cursor: 'grab', color: '#909399' }} />
      &nbsp;&nbsp;{idx + 1}
    </>
  );

  return <Page title={'Banner配置'} full className="bg-white">
    <DragSortTable
      options={false}
      headerTitle={'Banner列表'}
      columns={columns}
      dataSource={dataSrc}
      rowKey="id"
      search={false}
      pagination={false}
      dragSortKey="position"
      onDragSortEnd={handleDragSortEnd}
      dragSortHandlerRender={dragHandleRender}
      toolBarRender={() => [
        <AddBanner
          title={'新增'}
          trigger={<Button type={'primary'} icon={<PlusOutlined />}>新增</Button>}
          reload={reload}
        />
      ]}
    />
  </Page>
}

export default Banner;