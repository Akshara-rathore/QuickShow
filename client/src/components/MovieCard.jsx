import React from 'react'
import { useNavigate } from 'react-router-dom'
import { StarIcon } from 'lucide-react'
import timeFormat from '../lib/timeFormat'

const MovieCard = ({ movie }) => {
  const navigate = useNavigate()

  return (
    <div className='group flex flex-col justify-between p-3 bg-gray-800/80 backdrop-blur-md rounded-2xl hover:-translate-y-2 hover:shadow-xl hover:shadow-black/40 transition duration-300 w-64'>

      {/* Image */}
      <div className='relative overflow-hidden rounded-lg'>
        <img
          onClick={() => {
            navigate(`/movies/${movie._id}`)
            window.scrollTo(0, 0)
          }}
          src={movie.backdrop_path}
          alt={movie.title}
          className='h-52 w-full object-cover object-right-bottom cursor-pointer group-hover:scale-110 transition duration-500'
        />

        {/* Overlay on hover */}
        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center'>
          <button
            onClick={() => {
              navigate(`/movies/${movie._id}`)
              window.scrollTo(0, 0)
            }}
            className='px-4 py-2 bg-white text-black text-sm rounded-full font-semibold hover:scale-105 transition'
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Title */}
      <p className='font-semibold mt-3 truncate text-white'>
        {movie.title}
      </p>

      {/* Info */}
      <p className='text-sm text-gray-400 mt-1'>
        {new Date(movie.release_date).getFullYear()} •{" "}
        {movie.genres?.slice(0, 2).map(g => g.name).join(" | ")} •{" "}
        {movie.runtime ? timeFormat(movie.runtime) : "N/A"}
      </p>

      {/* Bottom Section */}
      <div className='flex items-center justify-between mt-3 pb-2'>

        <button
          onClick={() => {
            navigate(`/movies/${movie._id}`)
            window.scrollTo(0, 0)
          }}
          className='px-4 py-2 text-xs bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-white/20 transition rounded-full font-medium cursor-pointer'
        >
          Buy Tickets
        </button>

        <p className='flex items-center gap-1 text-sm text-gray-300'>
          <StarIcon className='w-4 h-4 text-yellow-400 fill-yellow-400' />
          {movie.vote_average?.toFixed(1)}
        </p>

      </div>
    </div>
  )
}

export default MovieCard