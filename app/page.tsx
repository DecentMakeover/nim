'use client'
import { motion } from 'motion/react'
import { XIcon } from 'lucide-react'
import { Spotlight } from '@/components/ui/spotlight'
import { Magnetic } from '@/components/ui/magnetic'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import Link from 'next/link'
import { AnimatedBackground } from '@/components/ui/animated-background'
import {
  PROJECTS,
  WORK_EXPERIENCE,
  BLOG_POSTS,
  EMAIL,
  SOCIAL_LINKS,
} from './data'
import Image from 'next/image'
import { ActivationVisualizer } from '@/components/ui/activation-visualizer'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

type ProjectVideoProps = {
  src: string
}

function ProjectVideo({ src }: ProjectVideoProps) {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger>
        <video
          src={src}
          autoPlay
          loop
          muted
          className="aspect-video w-full cursor-zoom-in rounded-xl"
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative aspect-video rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50">
          <video
            src={src}
            autoPlay
            loop
            muted
            className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
          />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

function MagneticSocialLink({
  children,
  link,
}: {
  children: React.ReactNode
  link: string
}) {
  return (
    <Magnetic springOptions={{ bounce: 0 }} intensity={0.3}>
      <a
        href={link}
        className="group relative inline-flex shrink-0 items-center gap-[1px] rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-black transition-colors duration-200 hover:bg-zinc-950 hover:text-zinc-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
      >
        {children}
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-3"
        >
          <path
            d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </Magnetic>
  )
}

export default function Personal() {
  const videos = [
    { title: "Sasank Chilamkurthy | co-founder @ qure.ai & JOHNAIC", videoId: "xQZDOeg0ZMY", url: "https://youtu.be/xQZDOeg0ZMY" },
    { title: "Vinay Dubey | Co founder & CMO @WintWealthYT", videoId: "0F8qGvrL1D8", url: "https://youtu.be/0F8qGvrL1D8" },
    { title: "Saurabh Jain | Co-founder @Stable_Money | Scaling @SwiggyIndia to 500 cities", videoId: "yioS01DdpQY", url: "https://youtu.be/yioS01DdpQY" },
  ];

  // Extract the Spotify link from the redirect URL
  const spotifyLink = "https://open.spotify.com/show/0IpAcQR0YB3rPxqTga8VCa?si=d525e35beda843ba"; // Assuming this is the correct final link

  return (
    <motion.main
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex-1">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Hi , My name Is Ryan Dsouza . I was born in Bantwal B.C Road , and did my early schooling in Bantwal , after which I moved to Mangalore for a few years . I did my 10th in Padua High school and did my 11th and 12th in St. Aloyusuis College (BSBA 21st Batch , Hi Juan!).
          </p>
        </div>
      </motion.section>

      {/* Podcast Section - NEW */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Podcast</h3>
        <p className="text-zinc-600 dark:text-zinc-400">
          I've been hosting a podcast since 2021 and have recorded over 250+ episodes , the complete archive can be viewed here {' '}
          <a
            href={spotifyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            Spotify
          </a>
          , I've recently started uploading on YouTube as well , you can check out the YouTube channel here {' '}
          <a
            href="https://youtube.com/@decentmakeover"
            target="_blank"
            rel="noopener noreferrer"
            className="underline dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            YouTube
          </a>
          , below are a few select episodes
        </p>
      </motion.section>

      {/* Featured Videos Section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="grid grid-cols-1 gap-y-8 mt-5">
          {videos.map((video) => (
            <div key={video.videoId} className="group space-y-2">
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="block aspect-video w-full overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                <Image
                  src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt={`Thumbnail for ${video.title}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={1280}
                  height={720}
                  unoptimized
                />
              </a>
              <div className="px-1">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-base inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                >
                  <span className="relative">
                    {video.title}
                    <span className="absolute bottom-0 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50"></span>
                   </span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Moved Reels Section Here (After Videos) */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-lg font-medium">Short form videos</h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          When I get time I also engage in street interviews , few links attached below
        </p>
        <div className="instagram-embed-container" style={{ maxWidth: '540px', margin: '0 auto' }}>
          {/* Reel 1 (DFffahrMY2u) */}
          <blockquote
            className="instagram-media"
            data-instgrm-permalink="https://www.instagram.com/decentmakeovr/reel/DFffahrMY2u/"
            data-instgrm-version="14"
            style={{ background:'#FFF', border:0, borderRadius:'3px', margin: '1px', padding:0, width:'100%' }}
          >
             <div style={{ padding: '16px' }}>
              <a href="https://www.instagram.com/decentmakeovr/reel/DFffahrMY2u/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#00376b' }}>
                View this Reel on Instagram
              </a>
            </div>
          </blockquote>
          {/* Reel 2 (DGyeRhfTu0T) */}
          <blockquote
            className="instagram-media mt-4"
            data-instgrm-permalink="https://www.instagram.com/decentmakeovr/reel/DGyeRhfTu0T/"
            data-instgrm-version="14"
            style={{ background:'#FFF', border:0, borderRadius:'3px', margin: '1px', padding:0, width:'100%' }}
          >
            <div style={{ padding: '16px' }}>
              <a href="https://www.instagram.com/decentmakeovr/reel/DGyeRhfTu0T/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#00376b' }}>
                View this Reel on Instagram
              </a>
            </div>
          </blockquote>
          {/* Reel 3 (DGa8SOZvSJp) */}
          <blockquote
            className="instagram-media mt-4"
            data-instgrm-permalink="https://www.instagram.com/decentmakeovr/reel/DGa8SOZvSJp/"
            data-instgrm-version="14"
            style={{ background:'#FFF', border:0, borderRadius:'3px', margin: '1px', padding:0, width:'100%' }}
          >
             <div style={{ padding: '16px' }}>
              <a href="https://www.instagram.com/decentmakeovr/reel/DGa8SOZvSJp/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#00376b' }}>
                View this Reel on Instagram
              </a>
            </div>
          </blockquote>
        </div>
      </motion.section>

      {/* Music Section - NEW */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-lg font-medium">Music</h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          I have been interested in singing as far back as I can remember and have sang for my college and university choir.
        </p>
        
        {/* YouTube Video */}
        <div className="mb-5">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
            <iframe
              src="https://www.youtube.com/embed/DK6a4WjBSus"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            ></iframe>
          </div>
        </div>

        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          For those who prefer to watch on IG:
        </p>

        {/* Instagram Reel */}
        <div className="instagram-embed-container" style={{ maxWidth: '540px', margin: '0 auto' }}>
          <blockquote
            className="instagram-media"
            data-instgrm-permalink="https://www.instagram.com/reel/DK7Kb2Dpc1v/"
            data-instgrm-version="14"
            style={{ background:'#FFF', border:0, borderRadius:'3px', margin: '1px', padding:0, width:'100%' }}
          >
            <div style={{ padding: '16px' }}>
              <a href="https://www.instagram.com/reel/DK7Kb2Dpc1v/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#00376b' }}>
                View this Reel on Instagram
              </a>
            </div>
          </blockquote>
        </div>
      </motion.section>

      {/* Sports Section - NEW */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-lg font-medium">Sports</h3> 
        <p className="text-zinc-600 dark:text-zinc-400">
          What kind of a podcaster will I be If I don't do Jiu-Jitsu , I first started Jiu-Jitsu in 2017 and then took a break from it and got into again in 2022 , I have taken part in two amateur matches wining one and tying the second one ( with great difficulty ) .
        </p>
        {/* Add Jiu-Jitsu match thumbnails */}
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          {[ 
            { title: "First Match", videoId: "sAy6uXT0rfo", url: "https://youtu.be/sAy6uXT0rfo" },
            { title: "Second Match", videoId: "Y5NFQnAbm5U", url: "https://youtu.be/Y5NFQnAbm5U" }
          ].map((match) => (
            <div key={match.videoId} className="group space-y-2">
              <a href={match.url} target="_blank" rel="noopener noreferrer" className="block aspect-video w-full overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                <Image
                  src={`https://img.youtube.com/vi/${match.videoId}/hqdefault.jpg`}
                  alt={`Thumbnail for ${match.title}`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  width={1280}
                  height={720}
                  unoptimized
                />
              </a>
              <div className="px-1">
                <a
                  href={match.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-base inline-block font-[450] text-zinc-900 dark:text-zinc-50"
                >
                  <span className="relative">
                    {match.title}
                    <span className="absolute bottom-0 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 transition-all duration-200 group-hover:max-w-full dark:bg-zinc-50"></span>
                   </span>
                </a>
              </div>
            </div>
          ))}
        </div>
        {/* Moved sentence here (between videos and images) */}
        <p className="mt-5 text-zinc-600 dark:text-zinc-400">
           Whenever possible I also like to take part in fitness events .
        </p>
        {/* Add Fitness Event Images */}
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
          {[ 
            { title: "Yoddha Race", src: "/yoddha-race.JPG" },
            { title: "Cult Unbound Championship", src: "/cult-unbound.JPG" }
          ].map((event) => (
            <div key={event.title} className="group space-y-2">
              <div className="block aspect-auto w-full overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80">
                <Image
                  src={event.src}
                  alt={`Photo from ${event.title}`}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  width={600} // Provide a reasonable width estimate
                  height={800} // Provide a reasonable height estimate (adjust if needed)
                  unoptimized // May be needed if image domain isn't configured
                />
              </div>
              {/* Optional: Add title below image if desired */}
              {/* <div className="px-1">
                <p className="font-base text-center font-[450] text-zinc-900 dark:text-zinc-50">
                  {event.title}
                </p>
              </div> */}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Projects Section - NEW */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-lg font-medium">Projects</h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-5">
          Interactive visualizations and tools for exploring various concepts in machine learning and mathematics.
        </p>
        <div className="space-y-4">
          <a
            href="/visualizations/activation"
            className="group block p-4 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <h4 className="font-medium mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Neural Network Activation Functions
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Interactive visualization of common neural network activation functions and their derivatives.
              Explore how different activation functions transform their inputs and how their derivatives behave.
            </p>
          </a>
          {/* --- New Tattoo Generator Project Card --- */}
          <a
            href="/projects/tattoo-generator" // Link to the page we created
            className="group block p-4 rounded-lg border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
          >
            <h4 className="font-medium mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              AI Tattoo Design Generator
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Generate unique tattoo designs using AI. Describe your ideal tattoo and see it come to life.
            </p>
          </a>
          {/* --- End of New Tattoo Generator Project Card --- */}
        </div>
      </motion.section>

      {/* Movies Section - NEW */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-lg font-medium">Movies</h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-5">
          I am a bit of a snob when it comes to movies, my top 5 movies of all time are
        </p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Incendies", year: "2010", genre: "Drama/Mystery", poster: "/movie-posters/incendies.jpg" },
            { title: "The Wailing", year: "2016", genre: "Horror/Mystery", poster: "/movie-posters/the-wailing.jpg" },
            { title: "Oldboy", year: "2003", genre: "Thriller/Drama", poster: "/movie-posters/oldboy.jpg" },
            { title: "Nine Queens", year: "2000", genre: "Crime/Thriller", poster: "/movie-posters/nine-queens.jpg" },
            { title: "Sicario", year: "2015", genre: "Crime/Thriller", poster: "/movie-posters/sicario.jpg" }
          ].map((movie) => (
            <div key={movie.title} className="group space-y-2">
              <div className="block overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                <div className="aspect-[2/3] w-full overflow-hidden">
                  <Image
                    src={movie.poster}
                    alt={`${movie.title} movie poster`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    width={400}
                    height={600}
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h4 className="font-medium mb-1 text-zinc-900 dark:text-zinc-50">
                    {movie.title}
                  </h4>
                  <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-1">
                    {movie.year}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-600">
                    {movie.genre}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Special Mentions Link */}
        <div className="mt-22 text-center">
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors font-medium"
          >
            View Special Mentions
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4H6C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3H11.5C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5V9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </motion.section>

      {/* Travel Section - NEW */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-lg font-medium">Travel</h3> 
        <p className="text-zinc-600 dark:text-zinc-400">
          I hate Travelling
        </p>
      </motion.section>

      {/* The 'Connect' section should immediately follow the 'Travel' section */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Connect</h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400">
          Feel free to contact me at{' '}
          <a className="underline dark:text-zinc-300" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </p>
        <div className="flex items-center justify-start space-x-3">
          {SOCIAL_LINKS.map((link) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>
    </motion.main>
  )
}
