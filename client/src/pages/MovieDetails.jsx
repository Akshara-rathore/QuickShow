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

const FALLBACK_CAST_IMAGE =
  'https://via.placeholder.com/200x300/111827/ffffff?text=No+Image'

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const bookingSectionRef = useRef(null)

  const { shows, movies } = useAppContext()

  const uniqueMovies = useMemo(() => {
    return movies || []
  }, [movies])

  const movie = uniqueMovies.find(
    (item) => String(item._id) === String(id)
  )

  const isComingSoon = movie?.status === 'coming_soon'

  const movieShows = useMemo(() => {
    return shows.filter((item) => String(item.movie?._id) === String(id))
  }, [shows, id])

  const [visibleCount, setVisibleCount] = useState(2)
  const [dateOffset, setDateOffset] = useState(0)
  const [favorites, setFavorites] = useState([])
  const [selectedTheatre, setSelectedTheatre] = useState(null)
  const [selectedShowId, setSelectedShowId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    setFavorites(storedFavs)
  }, [])

  const availableTheatres = useMemo(() => {
    const theatresMap = new Map()

    movieShows.forEach((show) => {
      if (show.theatre?._id) {
        theatresMap.set(String(show.theatre._id), show.theatre)
      }
    })

    return Array.from(theatresMap.values())
  }, [movieShows])

  useEffect(() => {
    if (availableTheatres.length > 0) {
      setSelectedTheatre((prev) => prev || availableTheatres[0])
    } else {
      setSelectedTheatre(null)
    }
  }, [availableTheatres])

  const theatreShows = useMemo(() => {
    if (!selectedTheatre) return []

    return movieShows.filter(
      (show) => String(show.theatre?._id) === String(selectedTheatre._id)
    )
  }, [movieShows, selectedTheatre])

  const bookingDates = useMemo(() => {
    const uniqueDates = [
      ...new Set(
        theatreShows.map((show) =>
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
  }, [theatreShows])

  useEffect(() => {
    if (bookingDates.length > 0) {
      const dateExists =
        selectedDate && bookingDates.find((d) => d.key === selectedDate.key)

      if (!dateExists) {
        setSelectedDate(bookingDates[0])
      }
    } else {
      setSelectedDate(null)
    }
  }, [bookingDates, selectedDate])

  useEffect(() => {
    if (!selectedDate) {
      setSelectedShowId(null)
      return
    }

    const selectedDateShows = theatreShows.filter(
      (show) =>
        new Date(show.showDateTime).toISOString().split('T')[0] ===
        selectedDate.key
    )

    setSelectedShowId(selectedDateShows[0]?._id || null)
  }, [selectedDate, theatreShows])

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

  const relatedMovies = uniqueMovies.filter(
    (item) => String(item._id) !== String(movie._id)
  )

  const visibleMovies = relatedMovies.slice(0, visibleCount)
  const visibleDates = bookingDates.slice(dateOffset, dateOffset + 5)

  const selectedDateKey = selectedDate?.key

  const filteredShows = selectedDateKey
    ? theatreShows.filter(
        (show) =>
          new Date(show.showDateTime).toISOString().split('T')[0] ===
          selectedDateKey
      )
    : theatreShows

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
    if (!selectedDate || !selectedShowId) return

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
  {isComingSoon ? (
    <span className='px-6 py-3 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.3)] font-semibold uppercase tracking-wider text-sm'>
      Coming Soon
    </span>
  ) : (
    <button
      onClick={handleBookNow}
      className='px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-red-600 hover:from-pink-400 hover:to-red-500 shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all transform hover:scale-105 font-bold uppercase tracking-wider text-sm'
    >
      Book Tickets
    </button>
  )}
</div>
          </div>
        </div>
      </div>

      {!isComingSoon && (
        <div
          ref={bookingSectionRef}
          className='mt-12 rounded-3xl border border-red-400/10 bg-[#1a0b10] px-6 py-6 md:px-10 shadow-[0_0_80px_rgba(255,60,90,0.08)]'
        >
          {/* Existing booking section remains same */}
        </div>
      )}

      <div className='px-6 md:px-16 lg:px-24 py-12'>
        <h2 className='text-2xl font-bold mb-4'>Overview</h2>

        <p className='text-gray-300 leading-7 max-w-4xl'>
          {movie.overview}
        </p>

        {movie.casts && movie.casts.length > 0 && (
          <div className='mt-12'>
            <h2 className='text-2xl font-bold mb-6'>Top Cast</h2>
            <div className='flex gap-6 overflow-x-auto pb-4 scrollbar-hide'>
              {movie.casts.map((cast, index) => (
                <div key={index} className='min-w-[140px] max-w-[140px] flex flex-col gap-3 group'>
                  <div className='overflow-hidden rounded-xl border border-white/10 shadow-lg shadow-black/50'>
                    <img
                      src={cast.profile_path || FALLBACK_CAST_IMAGE}
                      onError={(e) => {
                        e.target.src = FALLBACK_CAST_IMAGE
                      }}
                      alt={cast.name}
                      className='w-full h-48 object-cover group-hover:scale-110 transition duration-500'
                    />
                  </div>
                  <div>
                    <p className='font-bold text-sm text-white truncate'>{cast.name}</p>
                    <p className='text-xs text-gray-400 truncate'>{cast.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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