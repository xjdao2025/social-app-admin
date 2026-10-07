"""Patch the test admin's published Rice component; reject any other bundle version."""
import hashlib
import sys
from pathlib import Path

source, target = map(Path, sys.argv[1:])
original = source.read_bytes()
expected = "cc8374282ae06fa1e9cf5ba4d2b452d57b9d2bcf24db744a610a0659750021ca"
if hashlib.sha256(original).hexdigest() != expected:
    raise SystemExit("Admin bundle differs from the reviewed baseline; refusing to patch")
text = original.decode()
start = text.index("mOt=()=>")
end = text.index(",hOt=", start)
component = text[start:end]
if component.count('label:"提案通过票数设置"') != 1:
    raise SystemExit("Expected proposal form is missing")
replacement = Path(__file__).with_name("proposal-percentage.js").read_text().strip()
patched = text[:start] + replacement + text[end:]
target.write_text(patched)
print(f"Patched only the proposal form: {len(component)} -> {len(replacement)} characters")
