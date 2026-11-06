#!/bin/bash
# launchd entry point: refresh the site's lists and push them if YouTube changed.
# A push to main is what deploys the site, and only the two generated lists are
# ever staged. Does nothing until the data files exist on origin/main.
set -uo pipefail
export PATH="/opt/homebrew/bin:/usr/bin:/bin"
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
LANE="$HOME/Downloads/content_pipeline"
TOKEN="$LANE/street_shorts/secrets/youtube_token.json"
PY="$LANE/street_shorts/.venv/bin/python"
STATE="$HOME/.local/share/site-sync"
GIT=(git -C "$REPO" -c credential.helper= -c 'credential.helper=!gh auth git-credential')
DATA=(app/data/podcast.json app/data/blueprint.json)
ALERT_AFTER_S=$((24 * 3600))
mkdir -p "$STATE"
touch -a "$STATE/last_success"

# Stale data is the failure this job exists to prevent, so a long outage must not be silent.
fail() {
  echo "FAILED: $1"
  local age=$(( $(date +%s) - $(stat -f %m "$STATE/last_success") ))
  local alerted=$(( $(date +%s) - $(stat -f %m "$STATE/last_alert" 2>/dev/null || echo 0) ))
  if [ "$age" -gt "$ALERT_AFTER_S" ] && [ "$alerted" -gt "$ALERT_AFTER_S" ]; then
    local url
    url="$(grep -E '^NTFY_TOPIC_URL=' "$LANE/hook_shorts_publisher/config.env" | cut -d= -f2- | tr -d '"')"
    [ -n "$url" ] && curl -fsS -m 20 -H 'Title: ryandsouza.org lists are stale' \
      -d "site sync has failed for over a day: $1. Log: ~/.local/share/site-sync/sync.log" "$url" >/dev/null \
      && touch "$STATE/last_alert"
  fi
  exit 1
}

for i in $(seq 1 18); do
  /usr/bin/host -W 3 www.googleapis.com >/dev/null 2>&1 && break
  sleep 10
done

"${GIT[@]}" fetch -q origin main || fail "git fetch"
if ! "${GIT[@]}" cat-file -e "origin/main:${DATA[0]}" 2>/dev/null; then
  echo "$(date '+%F %T') waiting: the site PR is not merged yet"
  touch "$STATE/last_success"
  exit 0
fi
"${GIT[@]}" checkout -q main || fail "git checkout"
"${GIT[@]}" reset -q --hard origin/main || fail "git reset"

"$PY" -I "$REPO/scripts/site_sync/sync_youtube.py" --token "$TOKEN" --out "$REPO/app/data" \
  || fail "sync_youtube.py"

if "${GIT[@]}" diff --quiet -- "${DATA[@]}"; then
  touch "$STATE/last_success"
  exit 0
fi
"${GIT[@]}" add -- "${DATA[@]}" || fail "git add"
"${GIT[@]}" -c user.name='DecentMakeover' -c user.email='25679895+DecentMakeover@users.noreply.github.com' \
  commit -q -m 'Sync episode and Blueprint lists from YouTube' || fail "git commit"
"${GIT[@]}" push -q origin main || fail "git push"
echo "$(date '+%F %T') pushed $("${GIT[@]}" rev-parse --short HEAD)"
touch "$STATE/last_success"
