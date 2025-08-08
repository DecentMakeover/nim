'use client'
import { motion } from 'motion/react'
import Image from 'next/image'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}
const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}
const TRANSITION_SECTION = { duration: 0.25 }

export default function AboutPage() {
  return (
    <motion.main
      className="mx-auto max-w-4xl space-y-12 px-4 md:px-6"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h1 className="mb-4 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">About</h1>
        <p className="max-w-3xl text-zinc-600 dark:text-zinc-400">
          Hi, I&apos;m Ryan. I was born in Bantwal B.C Road and did my early schooling in Bantwal, after which I moved to Mangalore for a few years. I did my 10th in Padua High School and my 11th and 12th in St. Aloysius College (BSBA 21st Batch, Hi Juan!).
        </p>
      </motion.section>

      <motion.section variants={VARIANTS_SECTION} transition={TRANSITION_SECTION}>
        <h2 className="mb-3 text-xl font-medium">Recommendations</h2>
        <div className="space-y-10">
          <div>
            <h3 className="mb-2 font-medium">Movies</h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {[
                { title: 'Incendies', poster: '/movie-posters/incendies.jpg' },
                { title: 'The Wailing', poster: '/movie-posters/the-wailing.jpg' },
                { title: 'Oldboy', poster: '/movie-posters/oldboy.jpg' },
                { title: 'Nine Queens', poster: '/movie-posters/nine-queens.jpg' },
                { title: 'Sicario', poster: '/movie-posters/sicario.jpg' },
                { title: 'Iratta', poster: '/movie-posters/iratta.jpg' },
              ].map((m) => (
                <div key={m.title} className="overflow-hidden rounded-md border border-zinc-200/80 dark:border-zinc-800/80">
                  <Image src={m.poster} alt={m.title} width={300} height={450} className="aspect-[2/3] w-full object-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Books</h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {[
                { title: 'Superintelligence', cover: '/books/superintelligence.jpg' },
                { title: 'The Black Swan', cover: '/books/theblackswan.jpg' },
                { title: 'Antifragile', cover: '/books/antifragile.jpg' },
                { title: 'Fooled by Randomness', cover: '/books/fooldebyrandomness.jpg' },
              ].map((b) => (
                <div key={b.title} className="overflow-hidden rounded-md border border-zinc-200/80 dark:border-zinc-800/80">
                  <Image src={b.cover} alt={b.title} width={300} height={450} className="aspect-[2/3] w-full object-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-medium">TV Shows</h3>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {[
                { title: 'Game of Thrones', poster: '/tvshows/gameofthrones.jpg' },
                { title: 'Better Call Saul', poster: '/tvshows/bettercallsaul.jpg' },
                { title: 'The Thick of It', poster: '/tvshows/the thick of it.jpg' },
                { title: 'Intelligence', poster: '/tvshows/intelligence.jpg' },
              ].map((t) => (
                <div key={t.title} className="overflow-hidden rounded-md border border-zinc-200/80 dark:border-zinc-800/80">
                  <Image src={t.poster} alt={t.title} width={300} height={450} className="aspect-[2/3] w-full object-cover" unoptimized />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </motion.main>
  )
}


