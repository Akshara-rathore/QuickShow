import React from 'react'
import { useAppContext } from '../context/AppContext'
import MovieCard from '../components/MovieCard'

const Releases = () => {
  const { comingSoonMovies } = useAppContext()

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-28 min-h-screen text-white bg-black">
      <h1 className="text-3xl font-semibold mb-2">Coming Soon</h1>
      <p className="text-gray-400 mb-8">
        Explore upcoming movies that will be available for booking soon.
      </p>

      {comingSoonMovies && comingSoonMovies.length > 0 ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {comingSoonMovies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No upcoming releases available right now.</p>
      )}
    </div>
  )
}

export default Releases