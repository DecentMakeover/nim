'use client'
import { useCallback } from 'react'
import { BrowseControls, ShowMore } from './browse-controls'
import { formatDate, useBrowse } from '@/lib/browse'
import { episodeUrl } from '@/lib/youtube-urls'

export type Episode = {
  id: string
  title: string | null
  guest: string | null
  detail: string | null
  published: string
  minutes: number
  topics: string[]
}

type Topic = { slug: string; name: string; count: number }

export function EpisodeRow({ episode: e }: { episode: Episode }) {
  const heading = e.title ?? e.guest
  const byline = [e.title ? e.guest : null, e.detail].filter(Boolean).join(' · ')
  return (
    <li className="border-hairline border-b">
      <a
        href={episodeUrl(e.id)}
        target="_blank"
        rel="noreferrer"
        className="group flex gap-4 py-5 sm:gap-5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${e.id}/mqdefault.jpg`}
          alt=""
          width={320}
          height={180}
          loading="lazy"
          className="border-hairline bg-pill aspect-video h-fit w-28 shrink-0 border object-cover sm:w-40"
        />
        <span className="min-w-0">
          <span className="group-hover:text-terracotta block text-base leading-snug font-medium text-balance transition-colors sm:text-lg">
            {heading}
          </span>
          {byline && (
            <span className="text-ink/80 mt-1.5 block font-serif text-[15px] leading-snug">
              {byline}
            </span>
          )}
          <span className="text-gray mt-1.5 block text-xs">
            {formatDate(e.published)} · {e.minutes} min
          </span>
        </span>
      </a>
    </li>
  )
}

export function EpisodeBrowser({
  episodes,
  topics,
}: {
  episodes: Episode[]
  topics: Topic[]
}) {
  const matchesFilter = useCallback(
    (e: Episode, topic: string) => e.topics.includes(topic),
    [],
  )
  const searchText = useCallback(
    (e: Episode) => [e.title, e.guest, e.detail].filter(Boolean).join(' '),
    [],
  )
  const b = useBrowse(episodes, matchesFilter, searchText)

  return (
    <>
      <BrowseControls
        label="Filter episodes by topic"
        options={topics}
        total={episodes.length}
        filter={b.filter}
        setFilter={b.setFilter}
        query={b.query}
        setQuery={b.setQuery}
        placeholder="Search by guest, company or subject"
      />
      {b.visible.length === 0 ? (
        <p className="text-gray mt-8 font-serif">No episodes match that.</p>
      ) : (
        <ul>
          {b.visible.map((e) => (
            <EpisodeRow key={e.id} episode={e} />
          ))}
        </ul>
      )}
      <ShowMore remaining={b.remaining} onClick={b.showMore} />
    </>
  )
}
