import { ArrowRight, Calendar } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { dummyShowsData } from '../assets/assets'

const NewReleasesSection = () => {
  const navigate = useNavigate()
  
  // Get the last 4 movies as "New Releases"
  const newReleases = dummyShowsData.slice(-4).reverse()

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden bg-gradient-to-b from-black to-[#0a0205] py-20'>
      <div className='relative flex items-center justify-between pb-10'>
        <h2 className='text-3xl font-bold text-white flex items-center gap-3'>
          <Calendar className='w-8 h-8 text-pink-500' />
          Coming Soon
        </h2>

        <button
          onClick={() => {
            navigate('/movies')
            window.scrollTo(0, 0)
          }}
          className='group flex items-center gap-2 text-sm text-pink-400 cursor-pointer font-medium hover:text-pink-300'
        >
          View All Releases
          <ArrowRight className='group-hover:translate-x-1 transition w-4 h-4' />
        </button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
        {newReleases.map((movie) => (
          <div 
            key={movie._id}
            onClick={() => {
                navigate(`/movies/${movie._id}`)
                window.scrollTo(0, 0)
            }}
            className='group cursor-pointer rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:-translate-y-2'
          >
            <div className='relative aspect-[2/3] overflow-hidden'>
              <img 
                src={movie.poster_path} 
                alt={movie.title}
                className='w-full h-full object-cover group-hover:scale-110 transition duration-500'
              />
              <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition' />
              
              <div className='absolute bottom-0 left-0 p-4 w-full'>
                <p className='text-xs font-bold tracking-widest text-pink-500 mb-1'>NEW RELEASE</p>
                <h3 className='text-lg font-bold text-white line-clamp-1'>{movie.title}</h3>
                <p className='text-sm text-gray-300 mt-1'>{new Date(movie.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NewReleasesSection
