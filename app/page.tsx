import Link from 'next/link'
import { EMAIL, LINKS } from './links'

const BOTTOM_LINKS = [
  { label: 'YouTube', href: LINKS.youtube },
  { label: 'Spotify', href: LINKS.spotify },
  { label: 'Instagram', href: LINKS.blueprintInstagram },
  { label: 'X', href: LINKS.x },
  { label: 'Substack', href: LINKS.substack },
  { label: 'Email', href: `mailto:${EMAIL}` },
]

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* The mark in the middle, a word on each side. */}
      <section className="flex flex-1 items-center justify-center gap-7 pb-20 sm:gap-14">
        <Link
          href="/podcast"
          className="text-[11px] tracking-[0.18em] text-gray uppercase transition-colors hover:text-ink sm:text-[13px] sm:tracking-[0.22em]"
        >
          Podcast
        </Link>
        <h1 className="wordmark font-wordmark w-fit shrink-0 text-[22px] leading-[1.6] uppercase sm:text-4xl">
          <span aria-hidden className="flex justify-between">
            <span>R</span>
            <span>Y</span>
            <span>A</span>
            <span>N</span>
          </span>
          <span aria-hidden className="block">
            D&rsquo;Souza
          </span>
          <span className="sr-only">Ryan D&rsquo;Souza</span>
        </h1>
        <Link
          href="/blueprint"
          className="text-[11px] tracking-[0.18em] text-gray uppercase transition-colors hover:text-ink sm:text-[13px] sm:tracking-[0.22em]"
        >
          Blueprint
        </Link>
      </section>

      {/* Links, quietly at the bottom. */}
      <footer className="pb-10">
        <ul className="flex flex-wrap items-baseline justify-center gap-x-6 gap-y-2 text-xs text-gray-soft">
          {BOTTOM_LINKS.map((l) => (
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
    </div>
  )
}
