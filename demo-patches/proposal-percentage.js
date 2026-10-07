// Only the admin input changes; save the existing fixed vote threshold.
mOt = () => {
  const [editing, {setTrue: edit, setFalse: cancel}] = Sf(false);
  const [form] = Gn.useForm();
  const {data, refresh, error} = sf(async () => {
    const [settings, nodes] = await Promise.all([ln.settings.get(), ln.nodes.list()]);
    if (!Array.isArray(nodes)) throw new Error("节点信息加载失败");
    return {settings, count: nodes.length};
  });
  c.useEffect(() => {
    if (data) form.setFieldsValue({percentage: data.count && data.settings.proposal_approval_votes
      ? Math.floor(data.settings.proposal_approval_votes / data.count * 10000) / 100 : null});
  }, [data]);
  c.useEffect(() => { if (!editing) refresh(); }, [editing]);
  return R.jsx(Ci, {
    title: "提案配置", full: true, className: "bg-white",
    children: R.jsx(Km, {
      title: "配置项", className: fOt.card,
      extra: R.jsx(Ca, {gap: 10, children: editing
        ? R.jsxs(R.Fragment, {children: [
            R.jsx(Nr.Link, {onClick: cancel, children: "取消"}),
            R.jsx(Nr.Link, {onClick: () => form.submit(), children: "提交"})
          ]})
        : R.jsx(Nr.Link, {onClick: edit, children: "编辑"})}),
      children: R.jsxs(Ro, {
        form, submitter: false,
        onFinish: async (values) => {
          try {
            const nodes = await ln.nodes.list();
            if (!Array.isArray(nodes) || !nodes.length) throw new Error("暂无节点，无法计算通过票数");
            const percentage = values.percentage;
            if (!Number.isFinite(percentage) || percentage < 0.01 || percentage > 100) throw new Error("请输入 0.01—100 的通过比例");
            await ln.settings.update({proposal_approval_votes: Math.ceil(nodes.length * Math.round(percentage * 100) / 10000)});
            cancel(); Yt.success("编辑成功"); return true;
          } catch (error) { Yt.error(error.message); return false; }
        },
        children: [
          R.jsx(ly, {
            disabled: !editing || !data || !data.count, label: "提案通过比例（%）", name: "percentage",
            placeholder: "0.01—100", width: 405,
            fieldProps: {precision: 2, min: 0.01, max: 100},
            rules: [{required: true, type: "number", min: 0.01, max: 100, message: "请输入 0.01—100 的通过比例"}]
          }),
          R.jsx(cc, {name: ["percentage"], children: (values) => {
            const percentage = values.percentage;
            return R.jsx("p", {children: error ? "节点信息加载失败，请刷新后重试。"
              : !data ? "正在加载节点信息…"
              : !data.count ? "暂无节点。"
              : `节点：${data.count} 个 · 所需同意票：${percentage == null ? data.settings.proposal_approval_votes : Math.ceil(data.count * Math.round(percentage * 100) / 10000)} 票（向上取整）。`});
          }})
        ]
      })
    })
  });
}
