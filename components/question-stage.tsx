'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type Clip = {
  name: string
  question: string | null
  topic: string | null
  person: string
  url: string
}

// Deck shuffle: a fast riffle through the deck that decelerates into a
// steady cruise. It never stops; hover holds the card.
const FIRST_DELAY_MS = 28
const DECAY = 1.13
const CRUISE_MS = 850

export function QuestionStage({ clips }: { clips: Clip[] }) {
  const [index, setIndex] = useState(0)
  const [cruising, setCruising] = useState(false)
  const held = useRef(false)
  const delay = useRef(FIRST_DELAY_MS)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const tick = useCallback(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      // The heartbeat never dies: while held (or the pointer is genuinely
      // over the card) we simply don't advance, and try again next beat.
      const hovered = document.querySelector('a[data-stage]:hover') !== null
      if (!held.current && !hovered) {
        setIndex((i) => (i + 1) % clips.length)
        if (delay.current < CRUISE_MS) {
          delay.current = Math.min(delay.current * DECAY, CRUISE_MS)
          if (delay.current >= CRUISE_MS) setCruising(true)
        }
      } else if (!hovered) {
        // Element remounted under a parked cursor: :hover is gone but the
        // ref was never cleared by a mouseleave. Heal it.
        held.current = false
      }
      tick()
    }, delay.current)
  }, [clips.length])

  useEffect(() => {
    if (clips.length < 2) {
      setCruising(true)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCruising(true)
      return
    }
    tick()
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [clips.length, tick])

  const hold = (on: boolean) => {
    held.current = on
  }

  const c = clips[index]
  if (!c) return null

  return (
    <a
      key={cruising ? index : 'riffle'}
      href={c.url}
      target="_blank"
      rel="noreferrer"
      data-stage=""
      onMouseEnter={() => hold(true)}
      onMouseLeave={() => hold(false)}
      onFocus={() => hold(true)}
      onBlur={() => hold(false)}
      className={`group block text-center ${cruising ? 'stage-enter' : ''}`}
    >
      {c.topic && (
        <span className="block text-[11px] font-medium tracking-[0.28em] text-gray-soft uppercase">
          {c.topic}
        </span>
      )}
      <span className="wordmark font-wordmark mx-auto mt-8 block max-w-4xl text-lg leading-[1.75] uppercase sm:text-[27px] sm:leading-[1.8]">
        {c.question}
      </span>
      <span className="mt-8 block text-[11px] font-medium tracking-[0.24em] text-gray uppercase">
        {c.person}
      </span>
    </a>
  )
}
