import type { Metadata } from 'next'
import {
  BlueprintBrowser,
  type BlueprintVideo,
} from '@/components/blueprint-browser'
import { blueprintUrl } from '@/lib/youtube-urls'
import { QuestionStage } from '@/components/question-stage'
import blueprint from '../data/blueprint.json'
import { LINKS } from '../links'

export const metadata: Metadata = {
  title: 'The Blueprint',
  description:
    'Street interviews in Bengaluru about what people actually do at, and after, work: role, journey, earnings.',
}

const videos = blueprint.videos as BlueprintVideo[]
const themeName = (slug: string) =>
  blueprint.themes.find((t) => t.slug === slug)?.name ?? null

// Long titles wrap past the deck's height, so they stay out of the riffle.
const DECK_TITLE_MAX = 60
const deck = videos
  .filter((v) => v.title.length <= DECK_TITLE_MAX && v.theme !== 'compilations')
  .map((v) => ({
    name: v.id,
    question: v.title,
    topic: themeName(v.theme),
    person: '',
    url: blueprintUrl(v),
  }))

export default function BlueprintPage() {
  return (
    <div className="flex flex-col">
      {/* A fixed height, so the list below stays put as the deck riffles. */}
      <section
        aria-label="Latest questions"
        className="flex h-[19rem] flex-col justify-center overflow-hidden sm:h-[22rem]"
      >
        <QuestionStage clips={deck} />
      </section>

      <section className="mt-8">
        <h1 className="text-gray text-[11px] tracking-[0.24em] uppercase">
          The Blueprint
        </h1>
        <p className="essay mt-4 text-balance">
          Ever wondered what people actually do at, and after, work? Street
          interviews in Bengaluru with working professionals: their role, their
          journey, what they earn.
        </p>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 font-serif">
          <a className="doc-link" href={LINKS.blueprintYoutube} target="_blank" rel="noreferrer">
            Watch on YouTube
          </a>
          <a className="doc-link" href={LINKS.blueprintInstagram} target="_blank" rel="noreferrer">
            Follow on Instagram
          </a>
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-gray mb-2 text-[11px] tracking-[0.24em] uppercase">
          Every video, by theme
        </h2>
        <BlueprintBrowser videos={videos} themes={blueprint.themes} />
      </section>
    </div>
  )
}
