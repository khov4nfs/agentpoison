#!/usr/bin/env bash
set -euo pipefail

mkdir -p runs
asciinema rec runs/agentpoison.cast --overwrite --command "npm run demo"

echo "Recorded runs/agentpoison.cast"
echo "Convert to GIF with: agg runs/agentpoison.cast runs/agentpoison.gif"
