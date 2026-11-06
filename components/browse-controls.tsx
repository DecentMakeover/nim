'use client'

type Option = { slug: string; name: string; count: number }

export function BrowseControls({
  label,
  options,
  total,
  filter,
  setFilter,
  query,
  setQuery,
  placeholder,
}: {
  label: string
  options: Option[]
  total: number
  filter: string
  setFilter: (slug: string) => void
  query: string
  setQuery: (q: string) => void
  placeholder: string
}) {
  const all = [{ slug: 'all', name: 'All', count: total }, ...options]
  return (
    <div>
      <ul
        aria-label={label}
        className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] font-medium tracking-[0.14em] uppercase"
      >
        {all.map((o) => {
          const on = filter === o.slug
          return (
            <li key={o.slug}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(o.slug)}
                className={`cursor-pointer py-3.5 text-left uppercase transition-colors hover:text-terracotta ${
                  on ? 'text-ink' : 'text-gray'
                }`}
              >
                <span
                  className={
                    on ? 'underline decoration-1 underline-offset-[6px]' : ''
                  }
                >
                  {o.name}
                </span>
                <span className="text-gray-soft ml-1.5 font-normal">
                  {o.count}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="border-hairline placeholder:text-gray-soft focus:border-gray mt-3 w-full border-b bg-transparent py-3 font-serif text-base outline-none"
      />
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
