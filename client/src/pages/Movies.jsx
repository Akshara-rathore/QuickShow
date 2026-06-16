import React from 'react'
import { useAppContext } from '../context/AppContext'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'

const Movies = () => {
  const { nowShowingMovies } = useAppContext()

  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] text-white'>
      <BlurCircle top='150px' left='0px' />
      <BlurCircle bottom='50px' right='50px' />

      {nowShowingMovies && nowShowingMovies.length > 0 ? (
        <div className='mb-16'>
          <h1 className='text-3xl font-bold my-4'>Now Showing</h1>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {nowShowingMovies.map((movie) => (
              <MovieCard movie={movie} key={movie._id} />
            ))}
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center h-[50vh]'>
          <h1 className='text-3xl font-bold text-center text-white'>
            No movies available
          </h1>
        </div>
      )}
    </div>
  )
}

export default Movies