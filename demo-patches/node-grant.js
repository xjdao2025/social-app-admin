NodeGrantForm = ({ reload }) => {
  const { userInfo } = Z4();
  const [nodes, setNodes] = c.useState([]);
  const [loading, setLoading] = c.useState(false);
  const requestId = c.useRef(null);

  const loadNodes = async () => {
    setLoading(true);
    try {
      setNodes(await ln.nodes.list());
    } catch (error) {
      Yt.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const grant = async values => {
    if (!Number.isSafeInteger(values.amount) || values.amount <= 0) {
      Yt.error("请输入有效的稻米数量");
      return false;
    }
    if (!nodes.some(node => node.id === values.node_id)) {
      Yt.error("请选择节点");
      return false;
    }

    requestId.current ||= crypto.randomUUID();
    try {
      await ln.grants.createNode(values.node_id, {
        amount: values.amount,
        memo: values.memo || "",
        code: values.code,
        client_request_id: requestId.current
      });
    } catch (error) {
      Yt.error(error.message);
      return false;
    }

    requestId.current = null;
    Promise.resolve().then(reload).catch(() => {});
    try {
      const node = await ln.catalog.get("nodes", values.node_id);
      Yt.success(`已发放给 ${node.name}，当前余额 ${node.grain_balance}`);
    } catch {
      Yt.success("发放成功");
    }
    return true;
  };

  return R.jsxs(rd, {
    trigger: R.jsx(_n, { type: "primary", icon: R.jsx(hs, {}), children: "发放给节点" }),
    width: 480,
    title: "发放给节点",
    layout: "horizontal",
    submitter: {
      render: controls => [
        R.jsx(Ca, {
          justify: "center",
          className: "w-full",
          children: R.jsx(_n, { type: "primary", onClick: controls.submit, children: "确认发放" })
        }, "submit")
      ]
    },
    modalProps: { centered: true, destroyOnClose: true },
    onOpenChange: open => {
      if (open) loadNodes();
      else {
        setNodes([]);
        requestId.current = null;
      }
    },
    onValuesChange: changed => {
      if ("node_id" in changed || "amount" in changed || "memo" in changed) {
        requestId.current = null;
      }
    },
    onFinish: grant,
    children: [
      R.jsx(w4, {
        label: "接收节点",
        name: "node_id",
        fieldProps: {
          loading,
          showSearch: true,
          optionFilterProp: "label",
          options: nodes.map(node => ({
            label: `${node.name} / ${node.id}`,
            value: node.id
          }))
        },
        rules: [{ required: true, message: "请选择节点" }]
      }),
      R.jsx(ly, {
        label: "发放稻米",
        name: "amount",
        min: 1,
        max: 1e8,
        fieldProps: { precision: 0 },
        rules: [{ required: true, message: "请填写发放数量" }]
      }),
      R.jsx(Di, {
        label: "附言",
        name: "memo",
        fieldProps: { maxLength: 256 }
      }),
      R.jsxs("div", {
        className: $_t.content,
        children: [
          R.jsxs("p", {
            className: "mb-[12px] mt-0",
            children: ["当前绑定账号：", Xle(userInfo?.phone ?? "")]
          }),
          R.jsx(Vb, {
            label: "验证码",
            name: "code",
            onGetCaptcha: () => ln.grants.challenge()
          })
        ]
      })
    ]
  });
}
