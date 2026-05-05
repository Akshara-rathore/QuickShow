import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'

const Favorites = () => {
  const [favoriteMovies, setFavoriteMovies] = useState([])
  const { shows } = useAppContext()
  const uniqueMovies = Array.from(new Map(shows.map(show => [show.movie._id, show.movie])).values())

  useEffect(() => {
    const storedFavs = JSON.parse(localStorage.getItem('favoriteMovies')) || []

    const filteredMovies = uniqueMovies.filter((movie) =>
      storedFavs.includes(movie._id)
    )

    setFavoriteMovies(filteredMovies)
  }, [shows])

  return (
    <div className='relative my-32 mb-20 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden min-h-[80vh] text-white'>
      <BlurCircle top='120px' left='-80px' />
      <BlurCircle bottom='80px' right='-60px' />

      <h1 className='text-3xl md:text-4xl font-bold mb-3'>My Favorites</h1>
      <p className='text-gray-400 mb-10'>
        Movies you have added to your favorites.
      </p>

      {favoriteMovies.length > 0 ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {favoriteMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center text-center py-24 border border-white/10 rounded-3xl bg-white/5'>
          <h2 className='text-2xl font-semibold mb-3'>No favorite movies yet</h2>
          <p className='text-gray-400 max-w-md'>
            Start exploring movies and tap the heart icon on the movie details page to add them here.
          </p>
        </div>
      )}
    </div>
  )
}

export default Favorites