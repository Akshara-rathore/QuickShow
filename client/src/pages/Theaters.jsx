import React from 'react'
import {
  MapPin,
  Star,
  Monitor,
  Ticket,
  ParkingCircle,
  Sofa,
} from 'lucide-react'

const theaters = [
  {
    name: 'PVR Treasure Island',
    location: 'MG Road, Indore',
    screens: 5,
    rating: 4.7,
    distance: '2.1 km away',
    facilities: ['Dolby Atmos', 'Recliner Seats', 'Food Court'],
  },
  {
    name: 'INOX C21 Mall',
    location: 'Vijay Nagar, Indore',
    screens: 4,
    rating: 4.5,
    distance: '4.3 km away',
    facilities: ['Online Booking', 'Parking', 'Snacks'],
  },
  {
    name: 'Carnival Cinemas',
    location: 'Sapna Sangeeta, Indore',
    screens: 3,
    rating: 4.3,
    distance: '5.8 km away',
    facilities: ['AC Hall', 'Family Seats', 'Digital Screen'],
  },
]

const Theaters = () => {
  return (
    <div className='relative overflow-hidden min-h-screen px-6 md:px-16 lg:px-32 pt-28 pb-20 bg-[radial-gradient(circle_at_top_left,rgba(140,0,40,0.35),transparent_28%),linear-gradient(to_bottom,#050505,#12010a,#050505)] text-white'>
      
      <div className='absolute inset-0 opacity-20 pointer-events-none'>
        <div className='absolute top-0 left-0 w-72 h-72 bg-pink-600 rounded-full blur-3xl' />
        <div className='absolute bottom-0 right-0 w-72 h-72 bg-red-700 rounded-full blur-3xl' />
      </div>

      <div className='relative z-10'>
        <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12'>
          <div>
            <h1 className='text-4xl md:text-5xl font-bold tracking-tight'>
              Theaters Near You
            </h1>

            <p className='text-gray-400 mt-3 text-lg'>
              Experience movies in premium cinemas across Indore
            </p>
          </div>

          <div className='flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-3 rounded-2xl backdrop-blur-md'>
            <MapPin className='w-5 h-5 text-pink-400' />
            <span className='text-gray-300'>Indore, Madhya Pradesh</span>
          </div>
        </div>

        <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-8'>
          {theaters.map((theater, index) => (
            <div
              key={index}
              className='group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 hover:-translate-y-2 transition duration-500 hover:shadow-[0_0_40px_rgba(255,50,100,0.18)]'
            >
              <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-pink-500/10 to-red-500/5' />

              <div className='relative z-10'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h2 className='text-2xl font-semibold'>
                      {theater.name}
                    </h2>

                    <div className='flex items-center gap-2 mt-3 text-gray-400'>
                      <MapPin className='w-4 h-4 text-pink-400' />
                      <p>{theater.location}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-1 bg-yellow-500/15 text-yellow-300 px-3 py-1 rounded-full text-sm'>
                    <Star className='w-4 h-4 fill-yellow-300' />
                    {theater.rating}
                  </div>
                </div>

                <div className='mt-6 flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-gray-300'>
                    <Monitor className='w-5 h-5 text-pink-400' />
                    <span>{theater.screens} Screens</span>
                  </div>

                  <div className='text-sm text-gray-400'>
                    {theater.distance}
                  </div>
                </div>

                <div className='mt-6 flex flex-wrap gap-3'>
                  {theater.facilities.map((item, i) => (
                    <span
                      key={i}
                      className='rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-2 text-xs text-pink-100'
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className='mt-8 flex items-center justify-between'>
                  <div className='flex items-center gap-4 text-gray-400'>
                    <Ticket className='w-5 h-5 hover:text-pink-400 transition cursor-pointer' />
                    <ParkingCircle className='w-5 h-5 hover:text-pink-400 transition cursor-pointer' />
                    <Sofa className='w-5 h-5 hover:text-pink-400 transition cursor-pointer' />
                  </div>

                  <button className='rounded-xl bg-pink-500 px-5 py-2 text-sm font-medium text-white hover:bg-pink-600 transition shadow-lg shadow-pink-500/20'>
                    View Shows
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Theaters