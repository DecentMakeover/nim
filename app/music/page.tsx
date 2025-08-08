'use client'
import { motion } from 'motion/react'

export default function MusicPage() {
  return (
    <motion.main className="mx-auto max-w-4xl space-y-8 px-4 md:px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Music</h1>
        <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">I enjoy singing and have performed with my college and university choirs.</p>
      </header>
      <div className="overflow-hidden rounded-lg border border-zinc-200/80 dark:border-zinc-800/80">
        <div className="aspect-video w-full">
          <iframe
            src="https://www.youtube.com/embed/DK6a4WjBSus"
            title="YouTube video player"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </motion.main>
  )
}


