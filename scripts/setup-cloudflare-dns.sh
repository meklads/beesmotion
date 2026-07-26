#!/usr/bin/env bash
# Adds DNS for beesmotion.com → Cloudflare Pages.
# Prefer: export CLOUDFLARE_API_TOKEN=... (Zone DNS Edit on beesmotion.com)
# Fallback: OAuth from `npx wrangler login` (may lack DNS write — use API token if it fails).
set -euo pipefail
ZONE_ID="98030f56341db5805fbac3a63caa8a99"
PAGES_TARGET="beesmotion.pages.dev"

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

add_record() {
  local type=$1 name=$2 content=$3 proxied=$4
  api -X POST "https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records" \
    --data "{\"type\":\"${type}\",\"name\":\"${name}\",\"content\":\"${content}\",\"proxied\":${proxied},\"ttl\":1}"
}

echo "Creating CNAME apex → ${PAGES_TARGET} (proxied)…"
add_record CNAME "@" "$PAGES_TARGET" true | python3 -c "import sys,json; d=json.load(sys.stdin); print('apex', d.get('success'), d.get('errors'))"

echo "Creating CNAME www → ${PAGES_TARGET} (proxied)…"
add_record CNAME "www" "$PAGES_TARGET" true | python3 -c "import sys,json; d=json.load(sys.stdin); print('www', d.get('success'), d.get('errors'))"

echo "Done. Wait 2–5 minutes, then open https://beesmotion.com/"
