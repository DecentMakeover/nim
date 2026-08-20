'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  if (usePathname() === '/') return null

  return (
    <header className="flex items-baseline pt-8 pb-16 sm:pt-10">
      <Link
        href="/"
        className="text-[11px] font-medium tracking-[0.28em] text-gray uppercase transition-colors hover:text-ink"
      >
        Ryan&nbsp;D&rsquo;Souza
      </Link>
    </header>
  )
}
