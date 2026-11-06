'use client'

type Option = { slug: string; label: string }

export function BrowseControls({
  label,
  options,
  filter,
  setFilter,
  query,
  setQuery,
  placeholder,
  resultCount,
  noun,
}: {
  label: string
  options: Option[]
  filter: string
  setFilter: (slug: string) => void
  query: string
  setQuery: (q: string) => void
  placeholder: string
  resultCount: number
  noun: string
}) {
  const all = [{ slug: 'all', label: 'All' }, ...options]
  return (
    <div>
      <ul aria-label={label} className="flex flex-wrap gap-x-6 text-sm">
        {all.map((o) => {
          const on = filter === o.slug
          return (
            <li key={o.slug}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(o.slug)}
                className={`hover:text-terracotta cursor-pointer py-3 transition-colors ${
                  on
                    ? 'text-ink underline decoration-1 underline-offset-[6px]'
                    : 'text-gray'
                }`}
              >
                {o.label}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="border-hairline focus-within:border-gray mt-3 flex items-baseline gap-4 border-b">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="placeholder:text-gray-soft min-w-0 flex-1 bg-transparent py-3 font-serif text-base outline-none"
        />
        <span aria-live="polite" className="text-gray-soft shrink-0 text-xs">
          {resultCount} {noun}
          {resultCount === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}

export function ShowMore({
  remaining,
  onClick,
}: {
  remaining: number
  onClick: () => void
}) {
  if (remaining <= 0) return null
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-gray hover:text-terracotta mt-8 w-full cursor-pointer py-3 text-[11px] font-medium tracking-[0.14em] uppercase transition-colors"
    >
      Show more
      <span className="text-gray-soft ml-1.5 font-normal">{remaining}</span>
    </button>
  )
}
