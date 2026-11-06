import type { Metadata } from 'next'
import {
  EpisodeBrowser,
  EpisodeRow,
  type Episode,
} from '@/components/episode-browser'
import { episodeUrl } from '@/lib/youtube-urls'
import podcast from '../data/podcast.json'
import { LINKS } from '../links'

export const metadata: Metadata = {
  title: 'The Podcast',
  description:
    "Slow takes only. Long conversations about India's economy, technology, and the people building both.",
}

const episodes = podcast.episodes as Episode[]
const onTape = episodes.filter((e) => e.guest)
const topicName = (slug?: string) =>
  podcast.topics.find((t) => t.slug === slug)?.name
const startHere = podcast.start_here
  .map((id) => episodes.find((e) => e.id === id))
  .filter((e): e is Episode => Boolean(e))

// The tape's pace stays the same however many guests are on it.
const SECONDS_PER_GUEST = 9

function Tape({ hidden }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {onTape.map((e) => (
        <a
          key={e.id}
          href={episodeUrl(e.id)}
          target="_blank"
          rel="noreferrer"
          tabIndex={hidden ? -1 : undefined}
          className="group mr-24 block whitespace-nowrap sm:mr-36"
        >
          <span className="wordmark font-wordmark block text-2xl uppercase transition-colors sm:text-4xl">
            {e.guest}
          </span>
          <span className="text-gray group-hover:text-terracotta mt-2 block text-[10px] font-medium tracking-[0.24em] uppercase transition-colors sm:text-[11px]">
            {e.detail ?? topicName(e.topics[0])}
          </span>
        </a>
      ))}
    </div>
  )
}

export default function PodcastPage() {
  return (
    <div className="flex flex-col">
      {/* The tape. Full-bleed, hover to pause, tap a name to listen. */}
      <section aria-label="Guests" className="pt-4 pb-16 sm:pt-8 sm:pb-20">
        <div className="ticker ml-[calc(50%-50vw)] w-screen">
          <div
            className="ticker-track"
            style={{
              animationDuration: `${onTape.length * SECONDS_PER_GUEST}s`,
            }}
          >
            <Tape />
            <Tape hidden />
          </div>
        </div>
      </section>

      <section>
        <h1 className="text-gray text-[11px] tracking-[0.24em] uppercase">
          The Podcast
        </h1>
        <p className="essay mt-4 text-balance">
          Slow takes only. Long conversations with the people shaping how we
          live, work and think, mostly about India&rsquo;s economy, technology,
          and the people building both.
        </p>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-serif">
          <a className="doc-link" href={LINKS.youtube} target="_blank" rel="noreferrer">
            Watch on YouTube
          </a>
          <a className="doc-link" href={LINKS.spotify} target="_blank" rel="noreferrer">
            Listen on Spotify
          </a>
          <a className="doc-link" href={LINKS.youtubeClips} target="_blank" rel="noreferrer">
            Clips
          </a>
        </p>
      </section>

      {startHere.length > 0 && (
        <section className="mt-16">
          <h2 className="text-gray text-[11px] tracking-[0.24em] uppercase">
            Start here
          </h2>
          <ul className="border-hairline mt-4 border-t">
            {startHere.map((e) => (
              <EpisodeRow key={e.id} episode={e} />
            ))}
          </ul>
        </section>
      )}

      <section className="mt-16">
        <h2 className="text-gray mb-2 text-[11px] tracking-[0.24em] uppercase">
          Every episode, by topic
        </h2>
        <EpisodeBrowser episodes={episodes} topics={podcast.topics} />
      </section>
    </div>
  )
}
