'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

type Clip = {
  name: string
  question: string | null
  topic: string | null
  person: string
  url: string
}

// Deck shuffle: flips start fast and decelerate until the card settles.
const FIRST_DELAY_MS = 50
const DECAY = 1.22
const SETTLE_MS = 620 // once a flip takes this long, stop
const IDLE_BEFORE_RESHUFFLE_MS = 9000

export function QuestionStage({ clips }: { clips: Clip[] }) {
  const [index, setIndex] = useState(0)
  const [settled, setSettled] = useState(false)
  const held = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clear = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }

  const shuffle = useCallback(
    (delay: number) => {
      setSettled(false)
      const step = (d: number) => {
        timer.current = setTimeout(() => {
          setIndex((i) => (i + 1) % clips.length)
          if (d >= SETTLE_MS) {
            setSettled(true)
            // Rest, then riffle again from a moderate speed.
            timer.current = setTimeout(() => {
              if (!held.current) shuffle(FIRST_DELAY_MS * 2)
            }, IDLE_BEFORE_RESHUFFLE_MS)
          } else {
            step(d * DECAY)
          }
        }, d)
      }
      step(delay)
    },
    [clips.length],
  )

  useEffect(() => {
    if (clips.length < 2) {
      setSettled(true)
      return
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setSettled(true)
      return
    }
    shuffle(FIRST_DELAY_MS)
    return clear
  }, [clips.length, shuffle])

  const hold = (on: boolean) => {
    held.current = on
    if (on && settled) clear()
    else if (!on && settled && !timer.current && clips.length > 1) {
      timer.current = setTimeout(() => shuffle(FIRST_DELAY_MS * 2), IDLE_BEFORE_RESHUFFLE_MS)
    }
  }

  const c = clips[index]
  if (!c) return null

  return (
    <a
      href={c.url}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => hold(true)}
      onMouseLeave={() => hold(false)}
      onFocus={() => hold(true)}
      onBlur={() => hold(false)}
      className={`group block text-center ${settled ? 'stage-enter' : ''}`}
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
