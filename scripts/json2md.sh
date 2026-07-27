#!/usr/bin/env bash
set -euo pipefail

for f in temp/*.json; do
  base="$(basename "$f" .json)"
  npm run render:concept -- "$f" "content-source/safety/concepts/functional-safety-management/${base}.md"
done
