'use client'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const SPECIAL_MENTION_MOVIES = [
  { title: "The Chaser", year: "2008", genre: "Crime/Thriller", poster: "/special-mentions/chaser.jpg" },
  { title: "Gattaca", year: "1997", genre: "Sci-Fi/Drama", poster: "/special-mentions/gattaca.jpg" },
  { title: "Kahaani", year: "2012", genre: "Mystery/Thriller", poster: "/special-mentions/kahaani.jpg" },
  { title: "Wild Tales", year: "2014", genre: "Comedy/Drama", poster: "/special-mentions/wildtales.jpg" },
  { title: "Remember Me", year: "2010", genre: "Drama/Romance", poster: "/special-mentions/rememberme.jpg" },
  { title: "The Sixth Sense", year: "1999", genre: "Supernatural/Thriller", poster: "/special-mentions/sixthsense.jpg" },
  { title: "A Separation", year: "2011", genre: "Drama", poster: "/special-mentions/aseparation.jpg" },
  { title: "Blue Jasmine", year: "2013", genre: "Drama/Comedy", poster: "/special-mentions/bluejasmine.jpg" },
  { title: "Kishkinda Kadam", year: "2024", genre: "Drama/Thriller", poster: "/special-mentions/kishkindakadam.jpg" }
]

export default function MoviesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Special Mentions
          </h1>

        </motion.div>

        {/* Movies Grid */}
        <motion.div
          variants={VARIANTS_CONTAINER}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {SPECIAL_MENTION_MOVIES.map((movie, index) => (
            <motion.div
              key={movie.title}
              variants={VARIANTS_ITEM}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group space-y-3"
            >
              <div className="block overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-lg">
                <div className="aspect-[2/3] w-full overflow-hidden">
                  <Image
                    src={movie.poster}
                    alt={`${movie.title} movie poster`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={400}
                    height={600}
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1 text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {movie.title}
                  </h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-1">
                    {movie.year}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-600">
                    {movie.genre}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>


      </div>
    </div>
  )
} 