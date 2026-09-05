#!/usr/bin/env bash
# Points beesmotion.com DNS at GitHub Pages (temporary while Cloudflare Pages deploy is blocked).
# Prefer: export CLOUDFLARE_API_TOKEN=... (Zone DNS Edit on beesmotion.com)
set -euo pipefail
ZONE_ID="98030f56341db5805fbac3a63caa8a99"
GH_TARGET="meklads.github.io"

if [[ -n "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  TOKEN="$CLOUDFLARE_API_TOKEN"
elif [[ -f "${HOME}/Library/Preferences/.wrangler/config/default.toml" ]]; then
  TOKEN=$(python3 -c "import tomllib,pathlib; print(tomllib.loads(pathlib.Path('${HOME}/Library/Preferences/.wrangler/config/default.toml').read_text())['oauth_token'])")
else
  echo "Set CLOUDFLARE_API_TOKEN or run: npx wrangler login"
  exit 1
fi

api() {
  curl -fsS --max-time 60 "$@" -H "Authorization: Bearer ${TOKEN}" -H "Content-Type: application/json"
}

list_records() {
  api "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?per_page=100"
}

upsert_cname() {
  local name=$1 content=$2
  local fqdn=$name
  if [[ "$name" == "@" ]]; then
    fqdn="beesmotion.com"
  elif [[ "$name" != *.* ]]; then
    fqdn="${name}.beesmotion.com"
  fi

  local id
  id=$(list_records | python3 -c "
import sys, json
name = '''${fqdn}'''
data = json.load(sys.stdin)
for r in data.get('result') or []:
    if r.get('type') in ('CNAME', 'A', 'AAAA') and r.get('name') == name:
        print(r['id'])
        break
")

  local body
  body=$(python3 -c "import json; print(json.dumps({'type':'CNAME','name':'${name}','content':'${content}','proxied':True,'ttl':1}))")

  if [[ -n "${id}" ]]; then
    echo "Updating ${fqdn} → ${content}…"
    api -X PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${id}" --data "${body}" \
      | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('success'), d.get('errors'))"
  else
    echo "Creating ${fqdn} → ${content}…"
    api -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" --data "${body}" \
      | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('success'), d.get('errors'))"
  fi
}

echo "Pointing DNS to GitHub Pages (${GH_TARGET})…"
upsert_cname "@" "$GH_TARGET"
upsert_cname "www" "$GH_TARGET"
upsert_cname "ai" "$GH_TARGET"
echo "Done. Wait 2–5 minutes, then open https://beesmotion.com/"
