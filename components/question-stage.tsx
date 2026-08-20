'use client'
import { useEffect, useRef, useState } from 'react'

type Clip = {
  name: string
  question: string | null
  topic: string | null
  person: string
  url: string
}

const DWELL_MS = 5000

/*
 * One question at a time, center stage. Rotates on a quiet timer;
 * hover or focus holds it; the whole stage links to the reel.
 */
export function QuestionStage({ clips }: { clips: Clip[] }) {
  const [index, setIndex] = useState(0)
  const [held, setHeld] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
  }, [])

  useEffect(() => {
    if (held || reduced.current || clips.length < 2) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % clips.length), DWELL_MS)
    return () => clearTimeout(t)
  }, [index, held, clips.length])

  const c = clips[index]
  if (!c) return null

  return (
    <a
      key={c.name}
      href={c.url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      className="stage-enter group block text-center"
    >
      {c.topic && (
        <span className="block text-[11px] font-medium tracking-[0.28em] text-gray-soft uppercase">
          {c.topic}
        </span>
      )}
      <span className="mx-auto mt-6 block max-w-3xl font-serif text-3xl leading-[1.25] text-ink transition-colors group-hover:text-terracotta sm:text-5xl sm:leading-[1.2]">
        {c.question}
      </span>
      <span className="mt-7 block text-[11px] font-medium tracking-[0.24em] text-gray uppercase">
        {c.person}
      </span>
    </a>
  )
}
