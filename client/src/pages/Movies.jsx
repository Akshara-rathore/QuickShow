import React from 'react'
import { useAppContext } from '../context/AppContext'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { dummyShowsData } from '../assets/assets'

const Movies = () => {
  const { shows } = useAppContext()
  const uniqueMovies = Array.from(new Map(shows.map(show => [show.movie._id, show.movie])).values())
  const uniqueMovieIds = new Set(uniqueMovies.map(m => m._id))
  
  // Coming soon movies are those in dummyShowsData that are NOT in uniqueMovies
  const comingSoonMovies = dummyShowsData.filter(m => !uniqueMovieIds.has(m._id))

  return (
    <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh] text-white'>

      <BlurCircle top="150px" left="0px" />
      <BlurCircle bottom="50px" right="50px" />

      {uniqueMovies.length > 0 && (
        <div className="mb-16">
            <h1 className='text-3xl font-bold my-4'>Now Showing</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {uniqueMovies.map((movie) => (
                <MovieCard movie={movie} key={movie._id} />
              ))}
            </div>
        </div>
      )}

      {comingSoonMovies.length > 0 && (
        <div>
            <h1 className='text-3xl font-bold my-4'>Coming Soon</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
              {comingSoonMovies.map((movie) => (
                <MovieCard movie={movie} key={movie._id} />
              ))}
            </div>
        </div>
      )}

      {uniqueMovies.length === 0 && comingSoonMovies.length === 0 && (
        <div className='flex flex-col items-center justify-center h-[50vh]'>
            <h1 className='text-3xl font-bold text-center text-white'>No movies available</h1>
        </div>
      )}

    </div>
  )
}

export default Movies