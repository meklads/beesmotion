#!/bin/zsh
# Bees Motion: commit, push and deploy in one step. Double-click to run.
cd "$(dirname "$0")"
LOG="$PWD/.deploy-log.txt"
STAGE="/tmp/bm-deploy-$$"
{
  echo "== $(date)"
  echo "== folder: $PWD"
  echo "== git status (before)"; git status --short | head -40
  echo "== git add"
  git add functions assets/css/re-journey.css assets/js/re-lead.js assets/js/translations-re.js \
    index.html propmotion/index.html case-study-imc.html case-study-real-estate.html README.md
  echo "== git commit"
  git commit -m "Real estate journey on PropMotion, assessment form, temporary preview gate" \
    -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" \
    -m "Claude-Session: https://claude.ai/code/session_0136g4Yv2yeoiUukpenMJaNb" || echo "(no new commit)"
  echo "== git log"; git log --oneline -3
  echo "== git push"; git push origin main; echo "push exit code: $?"
  echo "== node / npm"; node -v; npm -v
  [ -d node_modules/wrangler ] || { echo "== npm install"; npm install; }
  echo "== wrangler whoami"; npx wrangler whoami
  echo "== prepare clean copy (excludes node_modules, .git, this script, log)"
  rm -rf "$STAGE"; mkdir -p "$STAGE"
  rsync -a --exclude node_modules --exclude .git --exclude .github --exclude .cursor \
    --exclude deploy-now.command --exclude .deploy-log.txt --exclude .DS_Store --exclude functions ./ "$STAGE/"
  echo "== deploy"
  npx wrangler pages deploy "$STAGE" --project-name=beesmotion --branch=main --commit-dirty=true
  echo "deploy exit code: $?"
  rm -rf "$STAGE"
  echo "== done $(date)"
} 2>&1 | tee "$LOG"
echo
echo "انتهى. يمكنك إغلاق هذه النافذة والعودة إلى Claude."
read -k 1
