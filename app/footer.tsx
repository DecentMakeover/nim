'use client'
import { usePathname } from 'next/navigation'
import { EMAIL, LINKS } from './links'

const FOOTER_LINKS = [
  { label: 'X', href: LINKS.x },
  { label: 'Instagram', href: LINKS.blueprintInstagram },
  { label: 'LinkedIn', href: LINKS.linkedin },
  { label: 'Substack', href: LINKS.substack },
  { label: 'Email', href: `mailto:${EMAIL}` },
]

export function Footer() {
  if (usePathname() === '/') return null

  return (
    <footer className="mt-28 border-t border-hairline py-10">
      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray">
        {FOOTER_LINKS.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-terracotta"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  )
}
