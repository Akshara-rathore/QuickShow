import React, { useState } from 'react'
import { dummyTrailers } from '../assets/assets'

const TrailerSection = () => {
  const [currentTrailer, setCurrentTrailer] = useState(dummyTrailers[0])

  const getEmbedUrl = (url) => {
    return url.replace('watch?v=', 'embed/')
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 bg-black text-white'>
      <p className='text-lg font-medium text-center mb-6'>Trailers</p>

      <div className='mx-auto max-w-5xl aspect-video rounded-2xl overflow-hidden'>
        <iframe
          width='100%'
          height='100%'
          src={getEmbedUrl(currentTrailer.videoUrl)}
          title='Movie Trailer'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className='w-full h-full'
        ></iframe>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-8'>
        {dummyTrailers.map((trailer, index) => (
          <img
            key={index}
            src={trailer.image}
            alt='trailer thumbnail'
            onClick={() => setCurrentTrailer(trailer)}
            className={`w-full h-32 object-cover rounded-xl cursor-pointer border-2 transition ${
              currentTrailer.videoUrl === trailer.videoUrl
                ? 'border-green-500 scale-105'
                : 'border-transparent hover:scale-105'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default TrailerSection