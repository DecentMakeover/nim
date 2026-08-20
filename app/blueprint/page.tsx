import type { Metadata } from 'next'
import content from '../content.json'

export const metadata: Metadata = {
  title: 'The Blueprint',
  description:
    'Street interviews in Bengaluru about salaries, savings, rent, and the work behind them.',
}

type Clip = {
  name: string
  question: string | null
  topic: string | null
  person_id: string | null
  published_at: string | null
  url: string
}

type Person = { id: string; name: string }

function Tape({ clips, hidden }: { clips: Clip[]; hidden?: boolean }) {
  const people = content.blueprint.people as Person[]
  const nameOf = (id: string | null) =>
    people.find((p) => p.id === id)?.name ?? ''

  return (
    <div aria-hidden={hidden} className="flex shrink-0 items-baseline">
      {clips.map((c) => (
        <a
          key={c.name}
          href={c.url}
          target="_blank"
          rel="noreferrer"
          tabIndex={hidden ? -1 : undefined}
          className="group mr-16 block whitespace-nowrap sm:mr-24"
        >
          <span className="block font-serif text-lg text-ink transition-colors group-hover:text-terracotta sm:text-2xl">
            {c.question}
          </span>
          <span className="mt-1.5 block text-[10px] font-medium tracking-[0.22em] text-gray-soft uppercase">
            {nameOf(c.person_id)}
            {c.topic ? <>&ensp;&middot;&ensp;{c.topic}</> : null}
          </span>
        </a>
      ))}
    </div>
  )
}

export default function BlueprintPage() {
  const clips = content.blueprint.clips as Clip[]
  // Deal the questions across three tapes, round-robin.
  const rows: Clip[][] = [[], [], []]
  clips.forEach((c, i) => rows[i % 3].push(c))
  const speeds = ['', 'ticker-track-reverse', 'ticker-track-slow']

  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col justify-center gap-14 sm:gap-20">
        {rows.map((row, i) => (
          <div key={i} className="ticker ml-[calc(50%-50vw)] w-screen">
            <div className={`ticker-track ${speeds[i]}`}>
              <Tape clips={row} />
              <Tape clips={row} hidden />
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
