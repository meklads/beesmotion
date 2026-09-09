#!/usr/bin/env bash
# Point beesmotion.com (+ www, ai) at Cloudflare Pages.
# Requires CLOUDFLARE_API_TOKEN with Zone.DNS Edit, or wrangler OAuth with DNS write.
set -euo pipefail
ZONE_ID="98030f56341db5805fbac3a63caa8a99"
PAGES_TARGET="beesmotion.pages.dev"
ROOT_DOMAIN="beesmotion.com"

if [[ -n "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  TOKEN="$CLOUDFLARE_API_TOKEN"
elif [[ -f "${HOME}/Library/Preferences/.wrangler/config/default.toml" ]]; then
  TOKEN=$(python3 -c "import tomllib,pathlib; print(tomllib.loads(pathlib.Path('${HOME}/Library/Preferences/.wrangler/config/default.toml').read_text())['oauth_token'])")
else
  echo "Set CLOUDFLARE_API_TOKEN or run: npx wrangler login"
  exit 1
fi

api() {
  local method=$1; shift
  curl -fsS --max-time 60 -X "$method" "$@" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json"
}

upsert_cname() {
  local name=$1
  local fqdn=$name
  if [[ "$name" == "@" ]]; then
    fqdn="$ROOT_DOMAIN"
  elif [[ "$name" != *.* ]]; then
    fqdn="${name}.${ROOT_DOMAIN}"
  fi

  local list
  list=$(api GET "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records?type=CNAME&name=${fqdn}")
  local id
  id=$(python3 -c "import sys,json; d=json.load(sys.stdin); r=d.get('result') or []; print(r[0]['id'] if r else '')" <<<"$list")

  local payload
  payload=$(python3 -c "import json; print(json.dumps({'type':'CNAME','name':'''$name''','content':'''$PAGES_TARGET''','proxied':True,'ttl':1}))")

  if [[ -n "$id" ]]; then
    echo "Updating CNAME ${fqdn} → ${PAGES_TARGET}"
    api PUT "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${id}" --data "$payload" \
      | python3 -c "import sys,json; d=json.load(sys.stdin); print('  success=', d.get('success'), 'errors=', d.get('errors'))"
  else
    echo "Creating CNAME ${fqdn} → ${PAGES_TARGET}"
    api POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" --data "$payload" \
      | python3 -c "import sys,json; d=json.load(sys.stdin); print('  success=', d.get('success'), 'errors=', d.get('errors'))"
  fi
}

echo "Switching DNS to Cloudflare Pages (${PAGES_TARGET})…"
upsert_cname "@"
upsert_cname "www"
upsert_cname "ai"
echo "Done. Wait 2–5 minutes, then verify https://beesmotion.com/book-appointment/ returns 301."
