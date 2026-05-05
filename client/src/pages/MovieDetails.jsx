import React, { useMemo, useRef, useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import {
  CalendarIcon,
  ClockIcon,
  StarIcon,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Heart,
} from 'lucide-react'
import timeFormat from '../lib/timeFormat'
import MovieCard from '../components/MovieCard'
import { useAppContext } from '../context/AppContext'
import isoTimeFormat from '../lib/isoTimeFormat'

import { dummyShowsData } from '../assets/assets'

const FALLBACK_CAST_IMAGE =
  'https://ui-avatars.com/api/?background=111827&color=ffffff&size=256&name='

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const bookingSectionRef = useRef(null)
  const { shows } = useAppContext()
  const uniqueMovies = Array.from(new Map(shows.map(show => [show.movie._id, show.movie])).values())

  const movieFromShows = uniqueMovies.find((item) => item._id === id)
  const movieFromDummy = dummyShowsData.find((item) => item._id === id)
  const movie = movieFromShows || movieFromDummy
  
  const movieShows = shows.filter((item) => item.movie?._id === id)

  const [visibleCount, setVisibleCount] = useState(2)
  const [dateOffset, setDateOffset] = useState(0)
  const [favorites, setFavorites] = useState([])
  const [selectedShowId, setSelectedShowId] = useState(null)

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    setFavorites(storedFavs)
  }, [])

  const bookingDates = useMemo(() => {
    const uniqueDates = [
      ...new Set(
        movieShows.map((show) =>
          new Date(show.showDateTime).toISOString().split('T')[0]
        )
      ),
    ]

    return uniqueDates.map((dateStr) => {
      const d = new Date(dateStr)
      return {
        fullDate: d,
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        date: d.getDate(),
        key: dateStr,
      }
    })
  }, [movieShows])

  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    if (bookingDates.length > 0 && !selectedDate) {
      setSelectedDate(bookingDates[0])
    }
  }, [bookingDates, selectedDate])

  useEffect(() => {
    if (!selectedDate) return

    const selectedDateShows = movieShows.filter(
      (show) =>
        new Date(show.showDateTime).toISOString().split('T')[0] === selectedDate.key
    )

    setSelectedShowId(selectedDateShows[0]?._id || null)
  }, [selectedDate, movieShows])

  if (!movie) {
    return (
      <div className='min-h-screen bg-black text-white flex items-center justify-center'>
        <h1 className='text-3xl font-bold'>Movie not found</h1>
      </div>
    )
  }

  const isFavorite = favorites.includes(movie._id)

  const toggleFavorite = () => {
    const storedFavs = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    let updatedFavs = []

    if (storedFavs.includes(movie._id)) {
      updatedFavs = storedFavs.filter((favId) => favId !== movie._id)
    } else {
      updatedFavs = [...storedFavs, movie._id]
    }

    localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavs))
    setFavorites(updatedFavs)
  }

  const baseMoviesForRelated = uniqueMovies.length > 0 ? uniqueMovies : dummyShowsData
  const relatedMovies = baseMoviesForRelated.filter((item) => item._id !== movie._id)
  const visibleMovies = relatedMovies.slice(0, visibleCount)
  const visibleDates = bookingDates.slice(dateOffset, dateOffset + 5)

  const selectedDateKey = selectedDate?.key

  const filteredShows = selectedDateKey
    ? movieShows.filter(
        (show) =>
          new Date(show.showDateTime).toISOString().split('T')[0] === selectedDateKey
      )
    : movieShows

  const scrollToBooking = () => {
    bookingSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const showMoreMovies = () => {
    setVisibleCount((prev) => Math.min(prev + 2, relatedMovies.length))
  }

  const showPrevDates = () => {
    setDateOffset((prev) => Math.max(prev - 1, 0))
  }

  const showNextDates = () => {
    setDateOffset((prev) =>
      Math.min(prev + 1, Math.max(bookingDates.length - 5, 0))
    )
  }
const handleBookNow = () => {
  if (!selectedDate) return

  navigate(`/seat-layout/${movie._id}?date=${selectedDate.key}`)
}
  return (
    <div className='bg-black text-white min-h-screen'>
      <div
        className='relative h-[70vh] bg-cover bg-center'
        style={{ backgroundImage: `url(${movie.backdrop_path})` }}
      >
        <div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/40' />

        <button
          onClick={() => navigate(-1)}
          className='absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/20 transition'
        >
          <ArrowLeft className='w-4 h-4' />
          Back
        </button>

        <div className='relative z-10 h-full flex flex-col md:flex-row items-center md:items-end gap-8 px-6 md:px-16 lg:px-24 pb-10'>
          <img
            src={movie.poster_path}
            alt={movie.title}
            className='w-64 rounded-2xl shadow-2xl border border-white/10'
          />

          <div className='max-w-2xl'>
            <div className='flex items-start justify-between gap-4'>
              <h1 className='text-4xl md:text-6xl font-bold'>{movie.title}</h1>

              <button
                onClick={toggleFavorite}
                className='mt-2 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 transition'
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite ? 'fill-pink-500 text-pink-500' : 'text-white'
                  }`}
                />
              </button>
            </div>

            <p className='mt-3 text-lg text-green-400 italic'>{movie.tagline}</p>

            <div className='mt-5 flex flex-wrap items-center gap-4 text-gray-300'>
              <span className='rounded-full border border-white/10 bg-white/10 px-3 py-1'>
                {movie.genres?.map((g) => g.name).join(' | ')}
              </span>

              <div className='flex items-center gap-2'>
                <CalendarIcon className='w-4 h-4' />
                {new Date(movie.release_date).getFullYear()}
              </div>

              <div className='flex items-center gap-2'>
                <ClockIcon className='w-4 h-4' />
                {timeFormat(movie.runtime)}
              </div>

              <div className='flex items-center gap-2 text-yellow-400'>
                <StarIcon className='w-4 h-4 fill-yellow-400' />
                {movie.vote_average?.toFixed(1)}
              </div>
            </div>

            <div className='flex flex-wrap gap-4 mt-6'>
              <button
                onClick={scrollToBooking}
                className='px-6 py-3 rounded-full bg-green-600 hover:bg-green-700 transition font-semibold'
              >
                Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='px-6 md:px-16 lg:px-24 py-12'>
        <h2 className='text-2xl font-bold mb-4'>Overview</h2>
        <p className='text-gray-300 leading-7 max-w-4xl'>{movie.overview}</p>

        <h2 className='text-2xl font-bold mt-10 mb-4'>Cast</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6'>
          {movie.casts?.slice(0, 6).map((cast, index) => (
            <div
              key={index}
              className='bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition'
            >
              <div className='w-24 h-24 mx-auto mb-3'>
                <img
                  src={cast.profile_path?.replace('/w200/', '/w500/')}
                  alt={cast.name}
                  onError={(e) => {
                    e.currentTarget.src = `${FALLBACK_CAST_IMAGE}${encodeURIComponent(
                      cast.name
                    )}`
                  }}
                  className='w-full h-full rounded-full object-cover border border-white/10'
                />
              </div>

              <p className='text-sm font-medium text-white truncate'>{cast.name}</p>
            </div>
          ))}
        </div>

        <div
          ref={bookingSectionRef}
          className='mt-12 rounded-3xl border border-red-400/10 bg-[#1a0b10] px-6 py-6 md:px-10 shadow-[0_0_80px_rgba(255,60,90,0.08)]'
        >
          <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
            <div className='flex-1'>
              <h3 className='text-xl font-semibold mb-4'>Choose Date</h3>

              {bookingDates.length > 0 ? (
                <div className='flex items-center gap-3 flex-wrap'>
                  <button
                    onClick={showPrevDates}
                    disabled={dateOffset === 0}
                    className='flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-pink-400 hover:bg-white/10 transition disabled:opacity-40'
                  >
                    <ChevronLeft className='w-5 h-5' />
                  </button>

                  {visibleDates.map((item) => {
                    const isSelected = selectedDate?.key === item.key

                    return (
                      <button
                        key={item.key}
                        onClick={() => setSelectedDate(item)}
                        className={`min-w-[72px] rounded-xl border px-4 py-3 text-center transition ${
                          isSelected
                            ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_20px_rgba(255,80,120,0.35)]'
                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <p className='text-sm font-medium'>{item.day}</p>
                        <p className='text-lg font-bold'>{item.date}</p>
                      </button>
                    )
                  })}

                  <button
                    onClick={showNextDates}
                    disabled={dateOffset >= bookingDates.length - 5}
                    className='flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-pink-400 hover:bg-white/10 transition disabled:opacity-40'
                  >
                    <ChevronRight className='w-5 h-5' />
                  </button>
                </div>
              ) : (
                <p className='text-gray-400'>No dates available for this movie</p>
              )}
            </div>

            <div className='flex-1'>
              <h3 className='text-xl font-semibold mb-4'>Choose Time</h3>

              {filteredShows.length > 0 ? (
                <div className='flex flex-wrap gap-3'>
                  {filteredShows.map((show) => {
                    const isSelected = selectedShowId === show._id

                    return (
                      <button
                        key={show._id}
                        onClick={() => setSelectedShowId(show._id)}
                        className={`rounded-xl px-5 py-3 border transition ${
                          isSelected
                            ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_20px_rgba(255,80,120,0.35)]'
                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {isoTimeFormat(show.showDateTime)}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className='text-gray-400'>No shows available for this date</p>
              )}
            </div>

            <div className='lg:w-auto'>
              <button
                onClick={handleBookNow}
                disabled={!selectedShowId}
                className='w-full lg:w-[280px] rounded-full bg-pink-500 px-8 py-4 text-lg font-semibold text-white transition hover:bg-pink-600 shadow-[0_0_30px_rgba(255,80,120,0.25)] disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Book Now
              </button>
            </div>
          </div>
        </div>

        <div className='mt-16'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold'>You May Also Like</h2>

            <button
              onClick={() => {
                navigate('/movies')
                window.scrollTo(0, 0)
              }}
              className='group flex items-center gap-2 text-sm text-gray-300 hover:text-white transition'
            >
              View All
              <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition' />
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {visibleMovies.map((item) => (
              <MovieCard key={item._id} movie={item} />
            ))}
          </div>

          {visibleCount < relatedMovies.length && (
            <div className='flex justify-center mt-10'>
              <button
                onClick={showMoreMovies}
                className='rounded-xl bg-pink-500 px-8 py-3 text-sm font-medium text-white transition hover:bg-pink-600'
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MovieDetails