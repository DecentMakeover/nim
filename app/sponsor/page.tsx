import type { Metadata } from 'next'
import Link from 'next/link'
import podcast from '../podcast.json'
import sponsor from '../sponsor.json'
import { EMAIL } from '../links'

export const metadata: Metadata = {
  title: 'Sponsor',
  description:
    'Sponsor The Podcast: long conversations about work and money with economists, founders and reporters.',
}

// Filled from platform analytics: { label: 'Avg views per episode', value: '12,400', note: 'YouTube, last 90 days' }
type Stat = { label: string; value: string; note?: string }
// Filled from the survey sheet: { label: 'Founders or CXOs', value: '31%' }
type Result = { label: string; value: string }

const CHANNELS = [
  'YouTube: full episodes',
  'YouTube: a separate clips channel',
  'Shorts and Instagram Reels',
  'Spotify',
  'Substack',
  'X',
]

const PARTNERSHIP = [
  'A host-read mid-roll in every episode released during the partnership',
  'A mention in each episode’s Substack post',
  'Category exclusivity for the length of the partnership',
]

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-hairline py-10">
      <h2 className="mb-6 text-[11px] font-medium tracking-[0.24em] text-gray uppercase">
        {title}
      </h2>
      {children}
    </section>
  )
}

function StatRows({ rows }: { rows: (Stat | Result)[] }) {
  return (
    <dl className="divide-y divide-hairline">
      {rows.map((r) => (
        <div key={r.label} className="flex items-baseline justify-between gap-6 py-3">
          <dt className="font-serif text-lg">
            {r.label}
            {'note' in r && r.note ? (
              <span className="block text-xs text-gray">{r.note}</span>
            ) : null}
          </dt>
          <dd className="font-wordmark text-xl whitespace-nowrap">{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default function SponsorPage() {
  const reach = sponsor.reach as Stat[]
  const survey = sponsor.survey
  const results = survey.results as Result[]
  const showSurvey = survey.responses >= survey.publish_at && results.length > 0

  return (
    <div className="flex flex-1 flex-col">
      <header className="pb-12">
        <p className="mb-4 text-[11px] font-medium tracking-[0.24em] text-gray uppercase">
          Sponsor the podcast
        </p>
        <h1 className="font-serif text-3xl leading-snug sm:text-4xl">
          Long conversations about work and money, with the economists,
          founders and reporters who study it.
        </h1>
      </header>

      <Section title="Recent guests">
        <ul className="divide-y divide-hairline">
          {podcast.episodes.map((e) => (
            <li key={e.url} className="flex items-baseline justify-between gap-6 py-3">
              <a
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className="font-serif text-lg transition-colors hover:text-terracotta"
              >
                {e.guest}
              </a>
              <span className="text-right text-sm text-gray">{e.guest_detail}</span>
            </li>
          ))}
        </ul>
      </Section>

      {reach.length > 0 && (
        <Section title={`Reach · ${sponsor.updated}`}>
          <StatRows rows={reach} />
        </Section>
      )}

      <Section title="Audience">
        {showSurvey ? (
          <>
            <StatRows rows={results} />
            <p className="mt-4 text-sm text-gray">
              From {survey.responses.toLocaleString('en-IN')} listeners who answered
              our always-open audience survey{survey.window ? `, ${survey.window}` : ''}.
              Categories overlap.
            </p>
          </>
        ) : (
          <p className="font-serif text-lg leading-relaxed">
            We run an always-open audience survey and publish the results here
            once {survey.publish_at} listeners have answered. If you watch or
            listen,{' '}
            <Link href="/survey" className="underline decoration-hairline underline-offset-4 transition-colors hover:text-terracotta">
              it takes two minutes
            </Link>
            .
          </p>
        )}
      </Section>

      <Section title="Where it runs">
        <ul className="space-y-2 font-serif text-lg">
          {CHANNELS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Section>

      <Section title="Partnerships">
        <ul className="space-y-2 font-serif text-lg">
          {PARTNERSHIP.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <p className="mt-8 text-sm text-gray">
          Write to{' '}
          <a
            href={`mailto:${EMAIL}?subject=Sponsoring%20the%20podcast`}
            className="text-ink underline decoration-hairline underline-offset-4 transition-colors hover:text-terracotta"
          >
            {EMAIL}
          </a>
          .
        </p>
      </Section>
    </div>
  )
}
