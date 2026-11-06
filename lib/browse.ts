'use client'
import { useEffect, useMemo, useState } from 'react'

const PAGE_SIZE = 30

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Filter, search and "show more" for a long list. The chosen filter lives in the
 * URL (?topic=ai) so a topic can be linked to from a bio or a post.
 */
export function useBrowse<T>(
  items: T[],
  matchesFilter: (item: T, filter: string) => boolean,
  searchText: (item: T) => string,
) {
  const [filter, setFilterState] = useState('all')
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)

  useEffect(() => {
    const topic = new URLSearchParams(window.location.search).get('topic')
    if (topic) setFilterState(topic)
  }, [])

  const setFilter = (next: string) => {
    setFilterState(next)
    setLimit(PAGE_SIZE)
    const url = new URL(window.location.href)
    if (next === 'all') url.searchParams.delete('topic')
    else url.searchParams.set('topic', next)
    window.history.replaceState(null, '', url)
  }

  const matches = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean)
    return items.filter((item) => {
      if (filter !== 'all' && !matchesFilter(item, filter)) return false
      const text = searchText(item).toLowerCase()
      return words.every((w) => text.includes(w))
    })
  }, [items, filter, query, matchesFilter, searchText])

  return {
    filter,
    setFilter,
    query,
    setQuery: (q: string) => {
      setQuery(q)
      setLimit(PAGE_SIZE)
    },
    matches,
    visible: matches.slice(0, limit),
    showMore: () => setLimit((n) => n + PAGE_SIZE),
    remaining: Math.max(matches.length - limit, 0),
  }
}
