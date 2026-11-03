export const LINKS = {
  youtube: 'https://www.youtube.com/@decentmakeover',
  youtubeClips: 'https://www.youtube.com/@ryandsouza-podcast-clips',
  spotify: 'https://open.spotify.com/show/0IpAcQR0YB3rPxqTga8VCa',
  blueprintInstagram: 'https://www.instagram.com/theblueprintuncut/',
  x: 'https://x.com/decentmakeovr',
  linkedin: 'https://linkedin.com/in/ryan-dsouza-74542b295',
  substack: 'https://substack.com/@decentmakeover',
}

export const EMAIL = 'ryan@soulsearching.in'

// One link row, shared by the home page and the footer on every other page.
export const SITE_LINKS = [
  { label: 'YouTube', href: LINKS.youtube },
  { label: 'Spotify', href: LINKS.spotify },
  { label: 'Instagram', href: LINKS.blueprintInstagram },
  { label: 'X', href: LINKS.x },
  { label: 'LinkedIn', href: LINKS.linkedin },
  { label: 'Substack', href: LINKS.substack },
  { label: 'Survey', href: '/survey' },
  { label: 'Email', href: `mailto:${EMAIL}` },
]
