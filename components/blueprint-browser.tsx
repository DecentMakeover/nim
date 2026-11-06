'use client'
import { useCallback } from 'react'
import { BrowseControls, ShowMore } from './browse-controls'
import { formatDate, useBrowse } from '@/lib/browse'
import { blueprintUrl } from '@/lib/youtube-urls'

export type BlueprintVideo = {
  id: string
  title: string
  published: string
  seconds: number
  theme: string
}

type Theme = { slug: string; name: string; count: number }

// Filter labels. Each row still shows the theme's full name.
const THEME_LABELS: Record<string, string> = {
  compilations: 'Compilations',
  ai: 'AI',
  money: 'Money',
  hiring: 'Hiring',
  college: 'College',
  life: 'Life',
  work: 'The job',
}

export function BlueprintBrowser({
  videos,
  themes,
}: {
  videos: BlueprintVideo[]
  themes: Theme[]
}) {
  const matchesFilter = useCallback(
    (v: BlueprintVideo, theme: string) => v.theme === theme,
    [],
  )
  const searchText = useCallback((v: BlueprintVideo) => v.title, [])
  const b = useBrowse(videos, matchesFilter, searchText)
  const themeName = (slug: string) => themes.find((t) => t.slug === slug)?.name

  return (
    <>
      <BrowseControls
        label="Filter videos by theme"
        options={themes
          .filter((t) => t.slug !== 'other')
          .map((t) => ({
            slug: t.slug,
            label: THEME_LABELS[t.slug] ?? t.name,
          }))}
        filter={b.filter}
        setFilter={b.setFilter}
        query={b.query}
        setQuery={b.setQuery}
        placeholder="Search by company or role"
        resultCount={b.matches.length}
        noun="video"
      />
      {b.visible.length === 0 ? (
        <p className="text-gray mt-8 font-serif">No videos match that.</p>
      ) : (
        <ul>
          {b.visible.map((v) => (
            <li key={v.id} className="border-hairline border-b">
              <a
                href={blueprintUrl(v)}
                target="_blank"
                rel="noreferrer"
                className="group block py-4"
              >
                <span className="group-hover:text-terracotta block text-base leading-snug font-medium text-balance transition-colors">
                  {v.title}
                </span>
                <span className="text-gray mt-1 block text-xs">
                  {themeName(v.theme)} · {formatDate(v.published)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <ShowMore remaining={b.remaining} onClick={b.showMore} />
    </>
  )
}
