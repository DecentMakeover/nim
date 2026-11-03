import type { Metadata } from 'next'
import { Noto_Serif_Kannada } from 'next/font/google'

const kannada = Noto_Serif_Kannada({
  variable: '--font-kannada',
  weight: ['400'],
  subsets: ['kannada'],
})

const HF = 'https://huggingface.co/decentmakeover/bsba-21-bantwal-konkani-4b'
const GH = 'https://github.com/DecentMakeover/bsba-21-bantwal-konkani-4b'

export const metadata: Metadata = {
  title: 'Teaching a small model to speak Mangalorean Konkani',
  description:
    'BSBA-21-Bantwal: an open 4B model for Mangalorean Konkani, trained on 400 hours of public speech on one DGX Spark, and what a native speaker made of it.',
  openGraph: {
    title: 'Teaching a small model to speak Mangalorean Konkani',
    description:
      '400 hours of public speech, one DGX Spark, three weeks, and an honest native-speaker review.',
    type: 'article',
  },
}

const link =
  'underline decoration-gray-soft underline-offset-[3px] transition-colors hover:text-terracotta hover:decoration-terracotta'

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={link}>
      {children}
    </a>
  )
}

function H2({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <h2 className="mt-16 text-2xl font-medium text-balance">
      <span className="text-gray mb-1 block text-[11px] tracking-[0.24em] uppercase">
        {n}
      </span>
      {children}
    </h2>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 font-serif text-lg leading-[1.75]">{children}</p>
}

function Setup({
  label,
  items,
}: {
  label: string
  items: [string, React.ReactNode][]
}) {
  return (
    <div className="border-hairline mt-6 border-y py-4 text-[15px] leading-relaxed">
      <div className="text-gray mb-2 text-[11px] tracking-[0.24em] uppercase">
        {label}
      </div>
      <ul>
        {items.map(([k, v]) => (
          <li
            key={k}
            className="border-hairline flex gap-3 border-t py-2 first:border-t-0"
          >
            <span className="w-24 shrink-0 font-medium">{k}</span>
            <span className="text-ink/85">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Reply({
  tag,
  ask,
  kn,
  roman,
  en,
}: {
  tag: string
  ask: string
  kn: string
  roman: string
  en: string
}) {
  return (
    <div className="border-hairline border-t py-5">
      <div className="text-gray text-[11px] tracking-[0.24em] uppercase">
        {tag}
      </div>
      <div className="text-gray mt-2 text-sm">{ask}</div>
      <p
        lang="kok"
        className="mt-2 font-[family-name:var(--font-kannada)] text-xl leading-[1.7]"
      >
        {kn}
      </p>
      <p className="text-gray mt-1 text-sm italic">{roman}</p>
      <p className="text-ink/85 mt-2 font-serif text-[17px] leading-relaxed">
        {en}
      </p>
    </div>
  )
}

/* Figure 2: perplexity on the six unseen channels, one bar per model. */
const PPL: [string, number, boolean?][] = [
  ['Start: Gemma 3 + Konkani LLM', 70.12],
  ['Stage B, first attempt', 25.83],
  ['Stage A only', 15.77],
  ['BSBA-21-Bantwal v1', 15.82, true],
]

function PerplexityChart() {
  const L = 210,
    W = 380,
    top = 10,
    row = 38,
    max = 80
  return (
    <svg
      viewBox="0 0 660 200"
      className="h-auto w-full"
      role="img"
      aria-labelledby="ppl-title"
    >
      <title id="ppl-title">
        Perplexity on six unseen Mangalorean channels: start 70.12, stage B
        first attempt 25.83, stage A 15.77, BSBA-21-Bantwal v1 15.82. Lower is
        better.
      </title>
      {[0, 20, 40, 60, 80].map((v) => {
        const x = L + (W * v) / max
        return (
          <g key={v}>
            <line
              x1={x}
              x2={x}
              y1={top - 4}
              y2={top + row * PPL.length - 6}
              stroke="rgba(33,31,26,0.14)"
            />
            <text
              x={x}
              y={top + row * PPL.length + 12}
              textAnchor="middle"
              className="fill-gray text-[13px]"
            >
              {v}
            </text>
          </g>
        )
      })}
      {PPL.map(([name, v, ours], i) => {
        const y = top + i * row,
          w = (W * v) / max
        return (
          <g key={name}>
            <title>{`${name}: perplexity ${v.toFixed(2)}`}</title>
            <text
              x={L - 12}
              y={y + 19}
              textAnchor="end"
              className={`text-[13px] ${ours ? 'fill-ink font-medium' : 'fill-gray'}`}
            >
              {name}
            </text>
            <rect
              x={L}
              y={y + 5}
              width={w}
              height={20}
              rx={4}
              className={ours ? 'fill-terracotta' : 'fill-[#57534b]'}
            />
            <text
              x={L + w + 8}
              y={y + 20}
              className="fill-ink text-[13px] font-medium tabular-nums"
            >
              {v.toFixed(2)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

/* Figure 3: the native review, one column per everyday request. */
const TASKS = [
  'Greet a neighbour after Sunday Mass',
  'Tell your mother you will be late for dinner',
  'Ask a shopkeeper the price of fish',
  'Invite a friend home for tea',
  'Ask your grandmother how she made kuswar',
  'Tell a friend about the heavy rain',
  'Ask a child how school was',
  'Explain how to make pork bafat',
  'Congratulate someone on their daughter’s engagement',
  'Ask someone to call you back later',
  'Ask for a home remedy',
  'Describe a roce ceremony',
  'Ask for directions to Hampankatta',
  'Tell your brother in Dubai everyone misses him',
  'Apologise for a forgotten birthday',
  'Ask what time Mass is tomorrow',
  'Explain why you like living in Mangalore',
  'Ask a friend to help you move house',
  'Tell someone the bus was late again',
  'Say goodnight and remind the family about church',
]
const REVIEW: {
  name: string
  ok: number[]
  missing: number[]
  ours?: boolean
}[] = [
  { name: 'Start', ok: [], missing: [2] },
  { name: 'Stage B, first', ok: [8, 12], missing: [2, 16] },
  {
    name: 'BSBA-21-Bantwal v1',
    ok: [1, 5, 6, 8, 10, 12, 17, 20],
    missing: [2],
    ours: true,
  },
]

function ReviewChart() {
  const L = 150,
    step = 24
  return (
    <svg
      viewBox="0 0 700 140"
      className="h-auto w-full"
      role="img"
      aria-labelledby="rev-title"
    >
      <title id="rev-title">
        Native review, one mark per everyday request: start 0 of 19 OK, stage B
        first attempt 2 of 18 OK, BSBA-21-Bantwal v1 8 of 19 OK. No answer was
        rated Good.
      </title>
      {REVIEW.map((r, i) => {
        const y = 20 + i * 44
        const rated = TASKS.length - r.missing.length
        return (
          <g key={r.name}>
            <text
              x={L - 14}
              y={y + 5}
              textAnchor="end"
              className={`text-[13px] ${r.ours ? 'fill-ink font-medium' : 'fill-gray'}`}
            >
              {r.name}
            </text>
            {TASKS.map((t, j) => {
              const n = j + 1,
                cx = L + j * step + 8
              if (r.missing.includes(n))
                return (
                  <g key={n}>
                    <title>{`Not rated · ${r.name}: ${t}`}</title>
                    <line
                      x1={cx - 4}
                      x2={cx + 4}
                      y1={y}
                      y2={y}
                      stroke="rgba(33,31,26,0.3)"
                    />
                  </g>
                )
              const good = r.ok.includes(n)
              return (
                <g key={n}>
                  <title>{`${good ? 'OK' : 'Poor'} · ${r.name}: ${t}`}</title>
                  <circle cx={cx} cy={y} r={11} fill="transparent" />
                  <circle
                    cx={cx}
                    cy={y}
                    r={7}
                    className={
                      good ? 'fill-terracotta' : 'stroke-gray fill-none'
                    }
                    strokeWidth={good ? 0 : 1.5}
                  />
                </g>
              )
            })}
            <text
              x={L + TASKS.length * step + 4}
              y={y + 5}
              className="fill-ink text-[13px] font-medium tabular-nums"
            >
              {`${r.ok.length} of ${rated}`}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default function KonkaniPost() {
  return (
    <article className={`${kannada.variable} flex flex-col`}>
      <header>
        <div className="text-gray text-[11px] tracking-[0.24em] uppercase">
          Open model · Mangalorean Konkani
        </div>
        <h1 className="mt-4 text-[32px] leading-[1.15] font-medium text-balance sm:text-4xl">
          Teaching a small model to speak Mangalorean Konkani
        </h1>
        <p className="text-ink/80 mt-4 font-serif text-xl leading-relaxed italic">
          400 hours of public speech, one DGX Spark on my desk, three weeks, and
          an honest native-speaker review of what came out.
        </p>
        <div className="text-gray mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          <span className="text-ink">Ryan D’Souza</span>
          <time dateTime="2026-11-03">3 November 2026</time>
          <A href={HF}>Model</A>
          <A href={GH}>Code</A>
        </div>
      </header>

      <section aria-label="Summary" className="border-ink mt-10 border-t pt-5">
        <div className="text-gray text-[11px] tracking-[0.24em] uppercase">
          TL;DR
        </div>
        <p className="mt-3 font-serif text-lg leading-[1.75]">
          <strong className="font-semibold">BSBA-21-Bantwal</strong> is an open
          4-billion-parameter model adapted to Mangalorean Konkani as people
          actually speak it, in Kannada script. I transcribed about 400 hours of
          Konkani speech from public Mangalorean YouTube videos, converted it to
          Mangalorean spelling, and trained on top of Gemma 3 and the existing
          Konkani LLM. It now answers in Konkani 90% of the time, against 5% for
          the model it started from, and it predicts real Mangalorean speech far
          better. My own review as a native speaker is more sobering: usable on
          8 of 19 everyday requests, and its Konkani is too formal. It talks
          like a sermon. Fixing that is version 2.
        </p>
      </section>

      <dl className="border-hairline mt-8 border-t">
        {[
          [
            '90% vs 5%',
            'Replies to 20 everyday requests that come back in Kannada-script Konkani.',
          ],
          [
            '15.8 vs 70.1',
            'Perplexity on 6 Mangalorean channels kept out of training. Lower is better.',
          ],
          [
            '8 of 19',
            'Everyday requests I rated usable as a native speaker. The existing Konkani model: 0 of 19.',
          ],
        ].map(([num, label]) => (
          <div
            key={num}
            className="border-hairline flex items-baseline gap-5 border-b py-3"
          >
            <dt className="w-32 shrink-0 text-xl font-medium tabular-nums">
              {num}
            </dt>
            <dd className="text-ink/80 text-[15px] leading-snug">{label}</dd>
          </div>
        ))}
      </dl>

      <figure className="mt-10">
        <video
          src="/konkani/bsba21_launch_clip.mp4"
          poster="/konkani/poster.jpg"
          controls
          muted
          playsInline
          loop
          preload="metadata"
          className="aspect-square w-full max-w-md bg-[#121213]"
          aria-label="Two everyday requests answered by the model in Mangalorean Konkani, with Roman reading and English subtitles"
        />
        <figcaption className="text-gray mt-3 text-sm leading-relaxed">
          Two real, unedited replies: asking the price of fish, and telling a
          friend about the week’s rain. Kannada script, a rough Roman reading,
          and an English subtitle.
        </figcaption>
      </figure>

      <H2 n="01">Why Mangalorean Konkani</H2>
      <P>
        Konkani is spoken along the west coast of India, but Mangalorean Konkani
        is its own thing. It has different words and different spellings from
        the Goan variety, and in Mangalore it is written in Kannada script. My
        family speaks it at home in Bantwal, a town near Mangalore.
      </P>
      <P>
        There are already Konkani language models, and good ones. The{' '}
        <A href="https://huggingface.co/konkani">Konkani LLM project</A>{' '}
        fine-tuned a whole family of open models. They are built around Goan
        Konkani, though, and the Kannada-script part of their training data was
        generated by another AI model rather than written or spoken by
        Mangaloreans. Ask them for Mangalorean Konkani and you mostly get
        English, or Goan Konkani spelt in Kannada letters.
      </P>
      <P>
        So the question was simple: if a model learns from Mangaloreans actually
        talking, does it start to sound like them?
      </P>

      <H2 n="02">Finding real speech</H2>
      <P>
        Mangalorean Konkani lives on YouTube: podcasts, cooking channels, radio
        interviews, comedy, and a great many sermons. The catch is that
        YouTube’s automatic captions do not recognise Konkani. They label it
        Hindi or Marathi and produce nonsense, so the text had to come from the
        audio itself.
      </P>
      <Setup
        label="Setup"
        items={[
          [
            'Sources',
            '20 Mangalorean channels, each sampled first with a 60-second language check that scores distinctively Konkani words, so Kannada, Hindi and English videos are filtered out.',
          ],
          [
            'Batch',
            'About 500 hours picked for conversation, recipes, radio, comedy and drama, with sermons capped at 150 hours. Prayers, Masses and songs left out.',
          ],
          [
            'Download',
            'Slow and login-free, one video at a time with long pauses, backing off for hours whenever YouTube asked to confirm I was not a bot.',
          ],
          [
            'Kept',
            '1,999 of 2,596 downloaded videos passed the Konkani check: 398.8 hours of speech.',
          ],
        ]}
      />
      <P>
        Everything ran on an NVIDIA DGX Spark at home. It survived two power
        cuts and an internet outage along the way, which is why every script in
        the pipeline can stop at any moment and pick up where it left off.
      </P>

      <H2 n="03">From audio to Mangalorean text</H2>
      <P>
        AI4Bharat’s open Konkani speech recogniser (IndicConformer) did the
        transcription, on the CPU, at about 43 times real time. It writes
        Devanagari, the script Goan Konkani uses. Converting that letter by
        letter to Kannada script gives Goan spellings, which look wrong to a
        Mangalorean reader, so I added a spelling pass: a handful of rules for
        Mangalorean print conventions, plus a list of 3,091 real Mangalorean
        spellings taken from the titles of the channels’ own videos.
      </P>
      <ul
        lang="kok"
        aria-label="Examples of the spelling fix: Goan-style spelling, then Mangalorean spelling"
        className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-[family-name:var(--font-kannada)] text-xl"
      >
        {[
          ['ಆಮೀ', 'ಆಮಿ'],
          ['ಕುಟಮಾಂ', 'ಕುಟ್ಮಾಂ'],
          ['ಭುರಗೀಂ', 'ಭುರ್ಗಿಂ'],
          ['ಕೇಲೇಂ', 'ಕೆಲೆಂ'],
        ].map(([from, to]) => (
          <li key={from}>
            <s className="text-gray">{from}</s> → {to}
          </li>
        ))}
      </ul>
      <P>
        After cleaning and removing duplicates, the training text came to{' '}
        <strong className="font-semibold">3.16 million words</strong> (about 10
        million tokens). Six channels were held back entirely, so I could later
        test the model on speech from sources it had never seen.
      </P>

      <H2 n="04">Teaching it the dialect</H2>
      <P>
        I started from Gemma 3 4B with the Konkani LLM project’s adapter merged
        in, so the model already knew some Konkani and only had to shift towards
        Mangalore. The first stage simply let it read the Mangalorean
        transcripts.
      </P>
      <Setup
        label="Setup · Stage A"
        items={[
          [
            'Method',
            'LoRA (rank 16) continued pre-training, one full pass over the 3.16 million words.',
          ],
          [
            'Compute',
            '3.3 GPU hours on the Spark, in one-hour slots on a shared queue, resuming from a checkpoint each time.',
          ],
          [
            'Measure',
            'Perplexity on Mangalorean speech: how surprised the model is by the next word. Lower is better.',
          ],
        ]}
      />
      <P>
        <strong className="font-semibold">
          Perplexity on held-out Mangalorean speech dropped from 85 to 16.
        </strong>{' '}
        The gain carried over to the six channels the model never saw (70 to
        16), so it learned the dialect rather than memorising particular videos.
      </P>

      <H2 n="05">Teaching it to answer, twice</H2>
      <P>
        A model that has only read transcripts can continue a sentence but
        cannot follow a request. The second stage taught it to answer, using the
        Kannada-script part of{' '}
        <A href="https://huggingface.co/datasets/konkani/konkani-instruct-100k">
          Konkani-Instruct-100k
        </A>
        .
      </P>
      <P>
        <strong className="font-semibold">
          The first attempt undid half of stage A.
        </strong>{' '}
        The model learned to follow instructions, but its perplexity on
        Mangalorean speech went back up from 16 to 28, and only half its answers
        stayed in Konkani. The instruction data is machine-written and formal,
        and the model drifted towards it. The fix was to keep reminding it how
        people talk.
      </P>
      <Setup
        label="Setup · Stage B, second attempt"
        items={[
          [
            'Data',
            'The instruction rows with English boilerplate and markdown removed, mixed with 40% Mangalorean speech text.',
          ],
          [
            'Method',
            'A fresh LoRA on top of stage A, lower learning rate, 1.6 GPU hours.',
          ],
          ['Kept', 'The dialect gains of stage A, and the ability to answer.'],
        ]}
      />

      <H2 n="06">The scorecard</H2>
      <P>
        I compared four models on the same tests: the starting point, stage A
        alone, the failed first instruction run, and the final model.
      </P>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm tabular-nums">
          <thead>
            <tr className="border-hairline text-gray border-b text-left text-[13px]">
              <th className="py-2 pr-3 font-normal">Model</th>
              <th className="py-2 pr-3 text-right font-normal">
                Perplexity, in-domain ↓
              </th>
              <th className="py-2 pr-3 text-right font-normal">
                Perplexity, unseen ↓
              </th>
              <th className="py-2 pr-3 text-right font-normal">
                English → Konkani chrF ↑
              </th>
              <th className="py-2 text-right font-normal">
                Stays in Konkani ↑
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              [
                'Gemma 3 4B + Konkani LLM (start)',
                '85.34',
                '70.12',
                '8.4',
                '5%',
              ],
              ['Stage A only (dialect)', '16.05', '15.77', '25.7', '95%'],
              ['Stage B, first attempt', '28.54', '25.83', '28.0', '50%'],
              ['BSBA-21-Bantwal v1', '16.09', '15.82', '31.7', '90%'],
            ].map((r, i) => (
              <tr
                key={r[0]}
                className={`border-hairline border-b ${i === 3 ? 'font-medium' : ''}`}
              >
                {r.map((c, j) => (
                  <td
                    key={j}
                    className={`py-2 pr-3 ${j ? 'text-right whitespace-nowrap' : ''}`}
                  >
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figure className="mt-8">
        <PerplexityChart />
        <figcaption className="text-gray mt-2 text-sm leading-relaxed">
          Perplexity on 15 videos from 6 Mangalorean channels never used in
          training. Lower is better.
        </figcaption>
      </figure>
      <P>
        Translation scores use{' '}
        <A href="https://huggingface.co/datasets/konkani/konkani-bench">
          Konkani-Bench
        </A>
        , 200 human-checked sentence pairs scored with chrF, an automatic
        measure of character overlap with the reference. “Stays in Konkani” is
        the share of 20 everyday English requests, such as greeting a neighbour
        after Sunday Mass or explaining how to make pork bafat, that come back
        in Kannada-script Konkani.
      </P>

      <H2 n="07">What a native speaker hears</H2>
      <P>
        Automatic scores do not tell you whether something sounds right. I had
        planned a blind review with two other native speakers. That fell
        through: one person rated four items before stopping. So the review
        below is mine, and it is not blind, because by then I knew which model
        wrote which answer. I rated each model’s answers to the everyday
        requests as Good, OK or Poor.
      </P>
      <figure className="mt-8">
        <div className="text-ink/80 mb-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px]">
          <span className="inline-flex items-center gap-2">
            <i className="bg-terracotta inline-block size-3 rounded-full" />
            OK
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="border-gray inline-block size-3 rounded-full border-[1.5px]" />
            Poor
          </span>
          <span>– Not rated</span>
          <span className="text-gray">
            No answer from any model was rated Good.
          </span>
        </div>
        <ReviewChart />
        <figcaption className="text-gray mt-2 text-sm leading-relaxed">
          One mark per everyday request, rated by me (a native speaker, not
          blind). BSBA-21-Bantwal v1: 8 OK, 11 Poor.
        </figcaption>
      </figure>
      <P>
        <strong className="font-semibold">
          It is a real step forward and not yet fluent.
        </strong>{' '}
        About half of v1’s Poor answers were decent Konkani followed by an
        English translation or a grammar note, a habit picked up from the
        instruction data. The other half were worse in a more interesting way.
      </P>
      <h3 className="mt-10 text-lg font-medium">It talks like a sermon</h3>
      <P>
        Ask someone in Mangalore how to get to the bus stand and they will say
        “go straight, take the right”. The model opens with greetings and
        blessings, or explains the question back to you, before it gets to the
        point. Its answers run to 30 or 50 words where a person would use five.
        That fits the data: a large share of the speech it learned from is
        sermons, talks and radio, and the instruction examples are formal too.
      </P>
      <div className="mt-6">
        <Reply
          tag="Sounds right"
          ask="Tell a friend about the heavy rain in Mangalore this week."
          kn="ಆಮ್ಗೆಲ್ಯಾ ಮಂಗಳೂರು ಶಹರಾಂತ್ ಹ್ಯಾ ಹಪ್ತ್ಯಾಕ್ ಬಾರೀ ಚಡ್ ಪಾವ್ಸ್ ಆಸಾ. ದೋನ್ ತೀನ್ ದಿಸಾಂ ಥಾವ್ನ್ ಸತತ್ ಪಾವಸ್ ಯೆವ್ನು ಆಸಾ ಆನಿ ಗಾಂವಾಂತ್ ಉದಕ್ ಭಾರಿಚ್ ಚಡ್ ಜಾಲಾ. ತುಕಾ ಕಶೆಂ ಜಾಲೆಂ?"
          roman="aamgelyaa mangalooru shaharaant hyaa haptyaak baaree chad paavs aasaa. don teen disaam thaavn satat paavas yevnu aasaa aani gaamvaant udak bhaarich chad jaalaa. tukaa kashem jaalem?"
          en="There’s been very heavy rain in our Mangalore this week. It’s rained non-stop for two or three days, and the water has risen a lot in the village. How’s it been for you?"
        />
        <Reply
          tag="Too formal"
          ask="Ask a shopkeeper the price of fish today."
          kn="ದೇವ್ ಬರೆಂ ಕರುಂ! ಆಜ್ ನಿಸ್ತೆಂ ಕಿತ್ಲೆಂ ಮೊಲಾಕ್ ಮೆಳ್ಟಾ ಗೀ?"
          roman="dev barem karum! aaj nistem kitlem molaak meltaa gee?"
          en="God bless! What price is fish going for today?"
        />
        <Reply
          tag="Explains instead of asking"
          ask="Ask for directions to the Hampankatta bus stand."
          kn="ಹ್ಯಾ ವಾಕ್ಯಾಂತ್ ತುಮಿ ಹ್ಯಾಂಪ್ಕಟ್ಟಾ ಬಸ್ ಸ್ಟೆಶನಾಕ್ ವಚೊಂಕ್ ವಿಚಾರ್ತಾತ್:"
          roman="hyaa vaakyaant tumi hyaampkattaa bas steshanaak vachonk vichaartaat:"
          en="In this sentence you are asking to go to the Hampankatta bus stand:"
        />
      </div>

      <H2 n="08">What else went wrong</H2>
      <ul className="mt-5 flex flex-col gap-3 font-serif text-lg leading-[1.7]">
        <li>
          <strong className="font-semibold">English tails.</strong> Even the
          final model sometimes follows a good Konkani answer with
          “(Translation: …)” and a note on grammar. The chat app in the
          repository cuts replies at the first English line.
        </li>
        <li>
          <strong className="font-semibold">It makes things up.</strong> It is a
          4B model. It will invent prices, dates and names with complete
          confidence.
        </li>
        <li>
          <strong className="font-semibold">Mostly Catholic Konkani.</strong>{' '}
          GSB (Saraswat) Konkani is only a small share of the data, mainly from
          one radio channel.
        </li>
        <li>
          <strong className="font-semibold">No live demo.</strong> I built a
          free chat page for it, then found that Hugging Face now charges for
          hosting apps, even on its free CPU tier. It runs on a laptop instead.
        </li>
        <li>
          <strong className="font-semibold">Waiting, mostly.</strong> The
          Spark’s GPU is shared with other projects through a queue. The model
          work itself took about 12 GPU hours; the rest of the three weeks was
          queues, downloads and power cuts.
        </li>
      </ul>

      <H2 n="09">Try it</H2>
      <P>
        The model is open on <A href={HF}>Hugging Face</A>, with a 2.5 GB
        version that runs on an ordinary laptop, no GPU needed. With{' '}
        <A href="https://ollama.com">Ollama</A> installed:
      </P>
      <pre className="bg-pill mt-5 overflow-x-auto rounded-sm px-4 py-3 text-[13px] leading-relaxed">
        <code>
          ollama run hf.co/decentmakeover/bsba-21-bantwal-konkani-4b:Q4_K_M
        </code>
      </pre>
      <P>
        Ask for “Mangalorean Konkani, written in Kannada script” in your request
        for the most reliable results. The full pipeline, from finding channels
        to packaging the model, is on <A href={GH}>GitHub</A>. The transcripts
        are not published: they come from creators’ videos, and only the model
        and the code are open.
      </P>

      <H2 n="10">What comes next</H2>
      <ul className="mt-5 flex flex-col gap-3 font-serif text-lg leading-[1.7]">
        <li>
          <strong className="font-semibold">
            Everyday Konkani over sermon Konkani.
          </strong>{' '}
          More conversation, podcasts and comedy; fewer sermons; short, natural
          answers in the instruction data, with no English glosses.
        </li>
        <li>
          <strong className="font-semibold">A proper blind review</strong> with
          a handful of Mangalorean speakers, and their own sentences as the
          start of a real Mangalorean test set.
        </li>
        <li>
          <strong className="font-semibold">More GSB Konkani,</strong> so the
          model is not only Catholic Mangalorean.
        </li>
        <li>
          <strong className="font-semibold">Bigger and spoken.</strong> A 12B
          model, and one day a voice, once a Konkani voice exists that sounds
          Mangalorean.
        </li>
      </ul>
      <P>
        <strong className="font-semibold">
          If you speak Mangalorean Konkani, I would love your help with v2.
        </strong>{' '}
        Try it, tell me where it sounds wrong, or offer an hour to rate answers.
        The links below reach me.
      </P>

      <H2 n="·">Why the name</H2>
      <P>
        Bantwal is my hometown, near Mangalore, and BSBA-21 is my batch: the
        21st batch of BSBA.
      </P>

      <H2 n="·">Acknowledgements</H2>
      <P>
        AI4Bharat for the open Konkani speech recogniser. The Konkani LLM
        project (Reuben Chagas Fernandes and Gaurang S. Patkar) for the Konkani
        adapter this model is built on, Konkani-Instruct-100k and Konkani-Bench.
        Google for Gemma. And the Mangalorean creators who keep Konkani alive
        online: this model learned to talk from them. I built it with an AI
        coding agent (Claude Code) running the pipeline on the Spark; the
        decisions, the Konkani and any mistakes are mine.
      </P>

      <H2 n="·">Citation</H2>
      <pre className="bg-pill mt-5 overflow-x-auto rounded-sm px-4 py-3 text-[13px] leading-relaxed">
        <code>{`@misc{dsouza2026bsba21bantwal,
  title  = {BSBA-21-Bantwal: a Mangalorean Konkani language model},
  author = {D'Souza, Ryan},
  year   = {2026},
  url    = {${HF}}
}`}</code>
      </pre>
      <p className="text-gray mt-8 text-sm">
        Model weights under the Gemma Terms of Use; code under the MIT licence.
      </p>
    </article>
  )
}
