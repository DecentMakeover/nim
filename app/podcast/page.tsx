import type { Metadata } from 'next'
import podcast from '../podcast.json'
import { LINKS } from '../links'

export const metadata: Metadata = {
  title: 'The Podcast',
  description:
    '250+ long conversations since 2021. Economists, founders, reporters.',
}

export default function PodcastPage() {
  return (
    <div className="pb-4">
      <h1 className="text-3xl font-medium tracking-tight">The podcast</h1>
      <div className="essay mt-6">
        <p>
          <em>250+ conversations since 2021.</em> Subscribe on{' '}
          <a href={LINKS.youtube} target="_blank" rel="noreferrer" className="doc-link">
            YouTube
          </a>{' '}
          or listen on{' '}
          <a href={LINKS.spotify} target="_blank" rel="noreferrer" className="doc-link">
            Spotify
          </a>
          .
        </p>
      </div>

      {/* Guest gallery: portrait, name, one word. The card is the link. */}
      <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
        {podcast.episodes.map((e) => (
          <li key={e.url}>
            <a href={e.url} target="_blank" rel="noreferrer" className="group block">
              <img
                src={e.image}
                alt={e.guest}
                width={480}
                height={600}
                className="aspect-[4/5] w-full object-cover grayscale transition duration-300 ease-out group-hover:grayscale-0"
              />
              <span className="mt-4 block font-serif text-lg leading-snug transition-colors group-hover:text-terracotta">
                {e.guest}
              </span>
              <span className="mt-0.5 block text-[11px] font-medium tracking-[0.14em] text-gray uppercase">
                {e.tag}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
