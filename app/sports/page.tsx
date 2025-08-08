'use client'
import { motion } from 'motion/react'
import Image from 'next/image'

export default function SportsPage() {
  const matches = [
    { title: 'First Match', videoId: 'sAy6uXT0rfo', url: 'https://youtu.be/sAy6uXT0rfo' },
    { title: 'Second Match', videoId: 'Y5NFQnAbm5U', url: 'https://youtu.be/Y5NFQnAbm5U' },
  ]
  const events = [
    { title: 'Yoddha Race', src: '/yoddha-race.JPG' },
    { title: 'Cult Unbound Championship', src: '/cult-unbound.JPG' },
  ]

  return (
    <motion.main className="mx-auto max-w-4xl space-y-8 px-4 md:px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Sports</h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">
          Jiu‑Jitsu since 2017 (with a break), back from 2022. Two amateur matches.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {matches.map((m) => (
          <li key={m.videoId} className="overflow-hidden rounded-lg border border-zinc-200/80 dark:border-zinc-800/80">
            <a href={m.url} target="_blank" rel="noreferrer">
              <Image src={`https://img.youtube.com/vi/${m.videoId}/hqdefault.jpg`} alt={m.title} width={640} height={360} className="h-40 w-full object-cover" unoptimized />
            </a>
            <div className="px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300">{m.title}</div>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-2 gap-4">
        {events.map((e) => (
          <div key={e.title} className="overflow-hidden rounded-lg border border-zinc-200/80 dark:border-zinc-800/80">
            <Image src={e.src} alt={e.title} width={600} height={600} className="h-48 w-full object-cover" unoptimized />
          </div>
        ))}
      </div>
    </motion.main>
  )
}


