import type { Metadata } from 'next'
import content from '../content.json'
import { LINKS } from '../links'

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

type Person = {
  id: string
  name: string
  title: string | null
  company: string | null
}

export default function BlueprintPage() {
  const clips = content.blueprint.clips as Clip[]
  const people = content.blueprint.people as Person[]

  // One section per interviewee, newest conversation first.
  const groups = people
    .map((p) => ({
      person: p,
      clips: clips.filter((c) => c.person_id === p.id),
    }))
    .filter((g) => g.clips.length > 0)
    .sort((a, b) =>
      (b.clips[0].published_at ?? '').localeCompare(
        a.clips[0].published_at ?? '',
      ),
    )

  return (
    <div className="pb-4">
      <h1 className="text-3xl font-medium tracking-tight">The Blueprint</h1>
      <div className="essay mt-6">
        <p>
          <em>What Bengaluru actually earns.</em> Street interviews about
          salaries, savings, rent, and the work behind them. One person, one
          honest conversation, cut by question. Follow along on{' '}
          <a
            href={LINKS.blueprintInstagram}
            target="_blank"
            rel="noreferrer"
            className="doc-link"
          >
            Instagram
          </a>
          .
        </p>
      </div>

      {groups.map((g) => (
        <section key={g.person.id} className="mt-14">
          <h2 className="text-xl font-medium tracking-tight">
            {g.person.name}
          </h2>
          <p className="mt-1 text-sm text-gray">
            {[g.person.title, g.person.company].filter(Boolean).join(', ')}
          </p>
          <ul className="mt-5">
            {g.clips.map((c) => (
              <li key={c.name} className="border-t border-hairline">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-baseline justify-between gap-6 py-3.5"
                >
                  <span className="font-serif text-[1.0625rem] leading-snug transition-colors group-hover:text-terracotta">
                    {c.question}
                  </span>
                  {c.topic && (
                    <span className="shrink-0 text-[10px] font-medium tracking-[0.18em] text-gray-soft uppercase">
                      {c.topic}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
