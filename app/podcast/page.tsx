import type { Metadata } from 'next'
import podcast from '../podcast.json'
import { LINKS } from '../links'

export const metadata: Metadata = {
  title: 'The Podcast',
  description:
    '250+ long conversations since 2021. Economists, founders, reporters.',
}

function Tape({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {podcast.episodes.map((e) => (
        <a
          key={e.url}
          href={e.url}
          target="_blank"
          rel="noreferrer"
          tabIndex={hidden ? -1 : undefined}
          className="group mr-24 block whitespace-nowrap sm:mr-36"
        >
          <span className="wordmark font-wordmark block text-2xl uppercase transition-colors sm:text-4xl">
            {e.guest}
          </span>
          <span className="mt-2 block text-[10px] font-medium tracking-[0.24em] text-gray uppercase transition-colors group-hover:text-terracotta sm:text-[11px]">
            {e.tag}
          </span>
        </a>
      ))}
    </div>
  )
}

export default function PodcastPage() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col justify-center">
        {/* The tape. Full-bleed, hover to pause, tap a name to listen. */}
        <div className="ticker ml-[calc(50%-50vw)] w-screen">
          <div className="ticker-track">
            <Tape />
            <Tape hidden />
          </div>
        </div>

      </section>
    </div>
  )
}
