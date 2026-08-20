import type { Metadata } from 'next'
import { QuestionStage } from '@/components/question-stage'
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
  url: string
}

type Person = { id: string; name: string }

export default function BlueprintPage() {
  const people = content.blueprint.people as Person[]
  const nameOf = (id: string | null) =>
    people.find((p) => p.id === id)?.name ?? ''

  const clips = (content.blueprint.clips as Clip[])
    .filter((c) => c.question)
    .map((c) => ({
      name: c.name,
      question: c.question,
      topic: c.topic,
      person: nameOf(c.person_id),
      url: c.url,
    }))

  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col justify-center pb-10">
        <QuestionStage clips={clips} />
      </section>
    </div>
  )
}
