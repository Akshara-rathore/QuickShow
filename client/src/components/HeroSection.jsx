import React from 'react'
import { CalendarIcon, ClockIcon, PlayCircle, Info } from 'lucide-react'

const HeroSection = () => {
  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/1200x/9e/c7/27/9ec727b37f28ca812c2d49f92467267d.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/35" />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex h-full items-center px-6 md:px-16 lg:px-24">
        <div className="max-w-2xl">
          <p className="mb-4 inline-block rounded-full border border-green-400/30 bg-green-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-green-300 backdrop-blur-sm">
            Featured Adventure
          </p>

          <h1 className="text-5xl font-extrabold leading-none tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.65)] md:text-[82px] md:leading-[0.95]">
            The
            <br />
            Jungle Book
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-gray-200 md:text-base">
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 backdrop-blur-sm">
              Adventure | Drama | Family
            </span>

            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>2016</span>
            </div>

            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4" />
              <span>1h 46m</span>
            </div>

            <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-yellow-200">
              7.4 IMDb
            </span>
          </div>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-200 md:text-lg">
            Raised by wolves in the heart of the jungle, Mowgli begins a dangerous journey of self-discovery after the fearsome tiger Shere Khan forces him to leave the only home he has ever known.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 font-semibold text-white shadow-lg shadow-green-900/30 transition hover:scale-[1.02] hover:bg-green-700">
              <PlayCircle className="h-5 w-5" />
              Book Tickets
            </button>

            <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
              <Info className="h-5 w-5" />
              Explore More
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/70 to-transparent" />
    </div>
  )
}

export default HeroSection