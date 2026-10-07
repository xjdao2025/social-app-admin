const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const hooks = [];
let hookIndex = 0;
let reloads = 0;
let nextId = 0;
const requests = [];
const nodes = [{ id: "node-1", name: "测试节点", grain_balance: 12 }];

const context = {
  c: {
    useState(initial) {
      const index = hookIndex++;
      hooks[index] ??= initial;
      return [hooks[index], value => { hooks[index] = value; }];
    },
    useRef(initial) {
      const index = hookIndex++;
      hooks[index] ??= { current: initial };
      return hooks[index];
    }
  },
  R: {
    jsx: (type, props) => ({ type, props }),
    jsxs: (type, props) => ({ type, props })
  },
  Z4: () => ({ userInfo: { phone: "13800138000" } }),
  Xle: phone => phone,
  $_t: { content: "content" },
  Yt: { error() {}, success() {} },
  ln: {
    nodes: { list: async () => nodes },
    grants: {
      challenge: async () => {},
      createNode: async (id, body) => {
        requests.push({ id, body });
        if (requests.length === 1) throw new Error("connection lost");
      }
    },
    catalog: { get: async () => ({ ...nodes[0], grain_balance: 15 }) }
  },
  crypto: { randomUUID: () => `request-${++nextId}` },
  rd: "modal", _n: "button", hs: "icon", Ca: "row",
  w4: "select", ly: "number", Di: "text", Vb: "captcha"
};

const source = fs.readFileSync(require("node:path").join(__dirname, "node-grant.js"), "utf8");
const NodeGrantForm = vm.runInNewContext(`var NodeGrantForm; ${source}; NodeGrantForm`, context);
const render = () => {
  hookIndex = 0;
  return NodeGrantForm({ reload: () => { reloads++; } });
};

(async () => {
  let form = render();
  form.props.onOpenChange(true);
  await new Promise(setImmediate);
  form = render();
  assert.equal(form.props.children[0].props.fieldProps.options[0].value, "node-1");

  const values = { node_id: "node-1", amount: 3, code: "123456" };
  assert.equal(await form.props.onFinish({ ...values, amount: 1.5 }), false);
  assert.equal(requests.length, 0);
  assert.equal(await form.props.onFinish(values), false);
  assert.equal(await form.props.onFinish(values), true);
  assert.equal(requests.length, 2);
  assert.deepEqual(requests.map(request => request.body.client_request_id), ["request-1", "request-1"]);
  assert.equal(requests[1].id, "node-1");
  await new Promise(setImmediate);
  assert.equal(reloads, 1);
  console.log("Node grant form retries one transaction and reloads the Rice record");
})().catch(error => { console.error(error); process.exitCode = 1; });
