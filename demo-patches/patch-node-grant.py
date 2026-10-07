"""Add node grain grants to the reviewed test admin bundle, preserving its proposal patch."""
import hashlib
import sys
from pathlib import Path

source, target = map(Path, sys.argv[1:])
original = source.read_bytes()
expected = "544a5f1f05c48ecc78b51544498345516315cd29c125deaeed96b42c4bdf84ab"
if hashlib.sha256(original).hexdigest() != expected:
    raise SystemExit("Admin bundle differs from the reviewed test version; refusing to patch")

text = original.decode()


def replace_once(old, new):
    global text
    if text.count(old) != 1:
        raise SystemExit(f"Expected exactly one bundle anchor, found {text.count(old)}: {old[:70]}")
    text = text.replace(old, new, 1)


replace_once(
    'create:e=>sr.post("/api/admin/grain_grants",e)}',
    'create:e=>sr.post("/api/admin/grain_grants",e),createNode:(id,payload)=>sr.post(`/api/admin/nodes/${id}/grain_grants`,payload)}',
)
component = Path(__file__).with_name("node-grant.js").read_text().strip()
replace_once(',O_t=()=>{', f',{component},O_t=()=>{{')
replace_once(
    'toolBarRender:()=>[R.jsx(E_t,{reload:t}),R.jsx(R_t,{reload:t})]',
    'toolBarRender:()=>[R.jsx(E_t,{reload:t}),R.jsx(R_t,{reload:t}),R.jsx(NodeGrantForm,{reload:t})]',
)
replace_once(
    'return((a=o.to)==null?void 0:a.nickname)||((i=o.to)==null?void 0:i.handle)||"—"',
    'return o.to_node?.name||((a=o.to)==null?void 0:a.nickname)||((i=o.to)==null?void 0:i.handle)||"—"',
)
target.write_text(text)
print(f"Node grant UI patched: {hashlib.sha256(target.read_bytes()).hexdigest()}")
