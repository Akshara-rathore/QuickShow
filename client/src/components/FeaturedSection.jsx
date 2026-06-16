import { ArrowRight } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BlurCircle from './BlurCircle'
import MovieCard from './MovieCard'
import { useAppContext } from '../context/AppContext'

const FeaturedSection = () => {
  const navigate = useNavigate()
  const { shows } = useAppContext()

  const [visibleCount, setVisibleCount] = useState(3)

  const uniqueMovies = Array.from(
    new Map(
      shows
        .filter((show) => show.movie?._id)
        .map((show) => [String(show.movie._id), show.movie])
    ).values()
  )

  const visibleMovies = uniqueMovies.slice(0, visibleCount)

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + 3, uniqueMovies.length))
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
      <div className='relative flex items-center justify-between pt-20 pb-10'>
        <BlurCircle top='0' right='-80px' />

        <p className='text-gray-300 font-medium text-lg'>Now Showing</p>

        <button
          onClick={() => {
            navigate('/movies')
            window.scrollTo(0, 0)
          }}
          className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'
        >
          View All
          <ArrowRight className='group-hover:translate-x-1 transition w-4 h-4' />
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {visibleMovies.map((movie) => (
          <MovieCard key={movie._id} movie={movie} />
        ))}
      </div>

      {visibleCount < uniqueMovies.length && (
        <div className='flex justify-center mt-10'>
          <button
            onClick={handleShowMore}
            className='px-8 py-3 text-sm text-white bg-white/10 border border-white/20 backdrop-blur-md rounded-full hover:bg-white/20 transition font-medium cursor-pointer'
          >
            Show more
          </button>
        </div>
      )}
    </div>
  )
}

export default FeaturedSection