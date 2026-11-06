// Matches SHORT_MAX_S in scripts/site_sync/sync_youtube.py.
const SHORT_MAX_S = 180

export function episodeUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`
}

export function blueprintUrl(v: { id: string; seconds: number }) {
  return v.seconds <= SHORT_MAX_S
    ? `https://www.youtube.com/shorts/${v.id}`
    : episodeUrl(v.id)
}
