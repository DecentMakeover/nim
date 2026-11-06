# Site sync

The episode list on /podcast and the video list on /blueprint are generated from
YouTube. Do not edit `app/data/*.json` by hand: the next run overwrites them.

**How it runs.** launchd job `com.decentmakeover.site-sync` on the Air, every two
hours, from a dedicated clone at `~/Developer/nim-site-sync`. `run.sh` calls
`sync_youtube.py` and, if the lists changed, commits those two files and pushes to
`main`, which deploys. It reads with the street lane's YouTube token and uses that
lane's Python, which already has macOS access to `~/Downloads`. Log:
`~/.local/share/site-sync/sync.log`. A failure lasting over a day sends a phone push.

**Changing what appears.**

- A new upload appears by itself. Private and scheduled videos never do.
- Episode topics: add the episode to a topic playlist on YouTube. Until then it gets
  a topic from `TOPIC_RULES`.
- "Start here" is the channel's Start Here playlist.
- A title that parses badly: pin `guest`, `detail`, `title` or `topics` by video ID in
  `episode_curation.json`.
- Blueprint themes are keyword rules: edit `THEMES` in `sync_youtube.py`.

**Guard.** A run refuses to publish if a list shrinks by more than 20%. After removing
many videos on purpose, delete that list's JSON from the clone and re-run.

Install on the Air:

    git clone https://github.com/DecentMakeover/nim ~/Developer/nim-site-sync
    cp ~/Developer/nim-site-sync/scripts/site_sync/com.decentmakeover.site-sync.plist ~/Library/LaunchAgents/
    launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.decentmakeover.site-sync.plist
