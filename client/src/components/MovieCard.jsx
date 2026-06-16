import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()
  const actualMovie = movie?.movie ? movie.movie : movie

  const fallbackImage =
    'https://via.placeholder.com/300x450/111827/ffffff?text=No+Image'

  const [imageSrc, setImageSrc] = useState(
    actualMovie?.poster_path || actualMovie?.backdrop_path || fallbackImage
  )

  const openMovieDetails = (e) => {
    e.stopPropagation()

    if (!actualMovie?._id) {
      console.log('Movie ID missing:', actualMovie)
      return
    }

    navigate(`/movies/${actualMovie._id}`)
    window.scrollTo(0, 0)
  }

  return (
    <div className='group flex flex-col justify-between p-3 bg-[#160f12]/80 border border-white/5 backdrop-blur-xl rounded-2xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/20 transition-all duration-500 w-64'>
      <div className='relative overflow-hidden rounded-xl bg-black/50'>
        <img
          onClick={openMovieDetails}
          src={imageSrc}
         onError={(e) => {
  e.target.src = "/no-image.jpg";
}}
          alt={actualMovie?.title || 'Movie'}
          className='h-72 w-full object-cover object-center rounded-xl cursor-pointer group-hover:scale-110 transition-transform duration-700'
        />

        <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pointer-events-none pb-4'>
          <button
            onClick={openMovieDetails}
            className='pointer-events-auto px-5 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-sm rounded-full font-semibold shadow-lg hover:scale-105 transition-transform duration-300'
          >
            {actualMovie?.status === 'coming_soon' ? 'View Details' : 'Book Now'}
          </button>
        </div>
      </div>

      <p className='font-bold mt-4 truncate text-white tracking-wide'>
        {actualMovie?.title || 'Untitled'}
      </p>

      <p className='text-xs text-gray-400 mt-1.5 font-medium'>
        {actualMovie?.release_date
          ? new Date(actualMovie.release_date).getFullYear()
          : 'N/A'}{' '}
        •{' '}
        {actualMovie?.genres?.slice(0, 2).map((g) => g.name).join(' | ') ||
          'N/A'}{' '}
        • {actualMovie?.runtime ? timeFormat(actualMovie.runtime) : 'N/A'}
      </p>

      <div className='flex items-center justify-between mt-4 pb-1'>
        {actualMovie?.status === 'coming_soon' ? (
          <span className='px-3 py-1 text-[10px] uppercase tracking-wider bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full font-bold'>
            Coming Soon
          </span>
        ) : (
          <button
            onClick={openMovieDetails}
            className='px-4 py-1.5 text-xs bg-white/5 border border-white/10 backdrop-blur-md text-gray-200 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all rounded-full font-semibold cursor-pointer'
          >
            Buy Tickets
          </button>
        )}

        <p className='flex items-center gap-1.5 text-sm font-bold text-gray-200'>
          <StarIcon className='w-3.5 h-3.5 text-yellow-500 fill-yellow-500' />
          {actualMovie?.vote_average
            ? Number(actualMovie.vote_average).toFixed(1)
            : 'N/A'}
        </p>
      </div>
    </div>
  )
}

export default MovieCard