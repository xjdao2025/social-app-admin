import Page from "@/components/Page";
import { DragSortTable, ProColumns } from "@ant-design/pro-components";
import { useEffect, useRef, useState } from "react";
import { MenuOutlined, PlusOutlined } from "@ant-design/icons";
import { proColumn } from "@/utils/pro-column-builder";
import { Button, message, Space, Typography } from "antd";
import server, { RiceError, type Node } from "@/server/rice";
import OssImage from "@/components/oss-image";
import pcHolder from '@/assets/banner/pc.png'
import AddNode from "./AddNode.tsx";

const { Link } = Typography;

const Nodes = () => {
  const [dataSrc, setDataSrc] = useState<Node[]>([])

  const reload = async () => {
    try {
      setDataSrc(await server.nodes.list())
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  useEffect(() => {
    reload()
  }, []);

  const delNode = async (id: string) => {
    try {
      await server.nodes.remove(id);
      reload();
      message.success('删除成功');
    } catch (error) {
      message.error((error as RiceError).message)
    }
  }

  const columns: ProColumns<Node>[] = [
    proColumn('排序', 'position', { width: 120 }),
    proColumn('节点名称', 'node', { width: 340 })
      ._render((_, record: Node) => {
        return <div className={'flex items-center gap-[10px]'}>
          <OssImage attachId={record.logo?.id} className={'w-[28px] h-[28px] rounded-full'} />
          <span>{record.name}</span>
        </div>
      }),
    proColumn('介绍', 'description', { ellipsis: true, width: 340 }),
    proColumn('操作', '', { width: 300 })
      ._option()
      ._render((_, record: Node) => {
        return <Space size={'middle'}>
          <AddNode
            title={'编辑'}
            trigger={
              <Link>编辑</Link>
            }
            reload={reload}
            initialValues={record}
          />
          <Link
            type="danger"
            onClick={() => delNode(record.id)}
          >删除</Link>
        </Space>
      }),
  ];

  const handleDragSortEnd = async (
    _beforeIndex: number,
    _afterIndex: number,
    newDataSource: Node[],
  ) => {
    setDataSrc(newDataSource);
    try {
      setDataSrc(await server.nodes.reorder(newDataSource.map(item => item.id)))
      message.success('排序成功');
    } catch (error) {
      message.error((error as RiceError).message)
      reload()
    }
  };

  const dragHandleRender = (_rowData: Node, idx: number) => (
    <>
      <MenuOutlined style={{ cursor: 'grab', color: '#909399' }} />
      &nbsp;&nbsp;{idx + 1}
    </>
  );

  return <Page
    title={'节点信息配置'}
    full
    className="bg-white"
  >
    <DragSortTable
      options={false}
      headerTitle={'节点列表'}
      columns={columns}
      dataSource={dataSrc}
      rowKey="id"
      search={false}
      dragSortKey="position"
      onDragSortEnd={handleDragSortEnd}
      dragSortHandlerRender={dragHandleRender}
      toolBarRender={() => [
        <AddNode
          title={'新增'}
          trigger={<Button
            type={'primary'}
            icon={<PlusOutlined />}
          >新增</Button>}
          reload={reload}
        />
      ]}
      pagination={{
        showTotal: false,
        hideOnSinglePage: true
      }}
    />
  </Page>
}

export default Nodes;