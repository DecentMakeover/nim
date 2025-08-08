'use client'
import { motion } from 'motion/react'
import Image from 'next/image'

export default function PodcastPage() {
  const episodes = [
    { title: 'Sasank Chilamkurthy | co-founder @ qure.ai & JOHNAIC', videoId: 'xQZDOeg0ZMY', url: 'https://youtu.be/xQZDOeg0ZMY' },
    { title: 'Vinay Dubey | Co founder & CMO @WintWealthYT', videoId: '0F8qGvrL1D8', url: 'https://youtu.be/0F8qGvrL1D8' },
    { title: 'Saurabh Jain | Co-founder @Stable_Money', videoId: 'yioS01DdpQY', url: 'https://youtu.be/yioS01DdpQY' },
  ]
  const spotifyLink = 'https://open.spotify.com/show/0IpAcQR0YB3rPxqTga8VCa?si=d525e35beda843ba'

  return (
    <motion.main className="mx-auto max-w-4xl space-y-8 px-4 md:px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Podcast</h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Since 2021, 250+ conversations. Listen on{' '}
          <a className="underline" href={spotifyLink} target="_blank" rel="noreferrer">Spotify</a>.
        </p>
      </header>

      <ul className="divide-y divide-zinc-200/70 rounded-xl border border-zinc-200/80 dark:divide-zinc-800/70 dark:border-zinc-800/80">
        {episodes.map((e) => (
          <li key={e.videoId} className="flex items-center gap-4 p-3">
            <a href={e.url} target="_blank" rel="noreferrer" className="flex items-center gap-4">
              <Image
                src={`https://img.youtube.com/vi/${e.videoId}/hqdefault.jpg`}
                alt={e.title}
                width={160}
                height={90}
                unoptimized
                className="h-20 w-32 shrink-0 rounded-md object-cover"
              />
              <span className="max-w-[52ch] text-sm text-zinc-900 dark:text-zinc-100">
                {e.title}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </motion.main>
  )
}


