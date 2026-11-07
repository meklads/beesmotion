#!/bin/zsh
# Bees Motion: publish to Cloudflare Pages from a clean copy OUTSIDE iCloud.
# Does not touch .git or node_modules (both are stuck because iCloud storage is full).
SRC="$(cd "$(dirname "$0")" && pwd)"
LOG="$SRC/.publish-log.txt"
STAGE="$HOME/bm-publish-tmp"
{
  echo "== $(date)"
  echo "== node: $(node -v 2>&1)  npm: $(npm -v 2>&1)"
  rm -rf "$STAGE"; mkdir -p "$STAGE/site"
  echo "== copying site (excluding dev files)"
  rsync -a \
    --exclude node_modules --exclude .git --exclude .github --exclude .cursor \
    --exclude '*.command' --exclude '.*-log.txt' --exclude .DS_Store \
    --exclude functions --exclude docs --exclude scripts \
    --exclude README.md --exclude package.json --exclude package-lock.json --exclude nixpacks.toml \
    "$SRC/" "$STAGE/site/"
  rsync -a "$SRC/functions/" "$STAGE/functions/"
  echo "files staged: $(find "$STAGE/site" -type f | wc -l | tr -d ' ')"
  ls "$STAGE/functions" "$STAGE/functions/api"
  cd "$STAGE"
  echo "== wrangler whoami"; npx -y wrangler@4 whoami
  echo "== deploy"
  npx -y wrangler@4 pages deploy site --project-name=beesmotion --branch=main --commit-dirty=true
  echo "deploy exit code: $?"
  echo "== done $(date)"
} 2>&1 | tee "$LOG"
echo
echo "انتهى. يمكنك إغلاق هذه النافذة والعودة إلى Claude."
read -k 1
