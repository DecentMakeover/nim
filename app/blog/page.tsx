import type { Metadata } from 'next'
import Link from 'next/link'
import { POSTS } from './posts'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Write-ups of LLM projects: what I built, how, and what came out.',
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export default function BlogIndex() {
  return (
    <div className="flex flex-col">
      <h1 className="text-gray text-[11px] tracking-[0.24em] uppercase">
        Blog
      </h1>
      <ul className="border-hairline mt-6 border-t">
        {POSTS.map((p) => (
          <li key={p.slug} className="border-hairline border-b">
            <Link href={`/blog/${p.slug}`} className="group block py-8">
              <div className="text-gray text-[11px] tracking-[0.24em] uppercase">
                {p.tag}
              </div>
              <h2 className="group-hover:text-terracotta mt-3 text-2xl leading-snug font-medium text-balance transition-colors">
                {p.title}
              </h2>
              <p className="text-ink/80 mt-3 font-serif text-lg leading-relaxed">
                {p.summary}
              </p>
              <time dateTime={p.date} className="text-gray mt-3 block text-sm">
                {formatDate(p.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
