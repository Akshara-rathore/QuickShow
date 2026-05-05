import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import isoTimeFormat from '../lib/isoTimeFormat'
import timeFormat from '../lib/timeFormat'
import { useAppContext } from '../context/AppContext'

const Mybooking = () => {
  const { bookings, fetchBookings, API_URL } = useAppContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [isVerifying, setIsVerifying] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id')
      if (sessionId) {
        setIsVerifying(true)
        try {
          const { data } = await axios.post(`${API_URL}/bookings/verify`, {
            sessionId
          })
          if (data.success) {
            toast.success('Payment verified!')
            await fetchBookings()
          }
        } catch (error) {
          console.error('Error verifying session:', error)
          toast.error('Could not verify payment at this time.')
        } finally {
          setIsVerifying(false)
          // Clean up the URL by removing the session_id
          searchParams.delete('session_id')
          setSearchParams(searchParams)
        }
      }
    }

    verifyPayment()
  }, []) // run once on mount

  if (isVerifying || !bookings) {
    return (
      <div className='min-h-[80vh] flex flex-col items-center justify-center text-white text-xl gap-4'>
        {isVerifying ? 'Verifying payment...' : 'Loading...'}
      </div>
    )
  }

  return (
    <div className='relative px-6 md:px-16 lg:px-24 pt-30 md:pt-40 min-h-[80vh] text-white'>
      <h1 className='text-2xl md:text-3xl font-semibold mb-8'>My Bookings</h1>

      {bookings.length === 0 ? (
        <div className='rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-400'>
          No bookings found
        </div>
      ) : (
        <div className='space-y-6 max-w-4xl'>
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className='rounded-2xl border border-pink-500/15 bg-[linear-gradient(90deg,rgba(35,8,14,0.95),rgba(70,18,26,0.9),rgba(35,8,14,0.95))] p-4 md:p-5 shadow-[0_0_40px_rgba(255,60,100,0.08)]'
            >
              <div className='flex flex-col md:flex-row gap-4 md:gap-5'>
                <img
                  src={
                    booking.show?.movie?.poster_path ||
                    booking.show?.movie?.backdrop_path
                  }
                  alt={booking.show?.movie?.title}
                  className='h-28 w-full md:w-44 object-cover rounded-xl border border-white/10'
                />

                <div className='flex-1 flex flex-col md:flex-row md:justify-between gap-4'>
                  <div>
                    <h2 className='text-lg md:text-xl font-semibold'>
                      {booking.show?.movie?.title}
                    </h2>

                    <p className='text-sm text-gray-300 mt-1'>
                      {timeFormat(booking.show?.movie?.runtime)}
                    </p>

                    <p className='text-sm text-gray-300 mt-4'>
                      {booking.show?.showDateTime
                        ? isoTimeFormat(booking.show.showDateTime)
                        : 'N/A'}
                    </p>
                  </div>

                  <div className='text-left md:text-right'>
                    <p className='text-2xl font-bold'>₹{booking.amount}</p>

                    <p className='text-sm text-gray-300 mt-4'>
                      Total Tickets: {booking.bookedSeats?.length}
                    </p>

                    <p className='text-sm text-gray-300 mt-1'>
                      Seat Number: {booking.bookedSeats?.join(', ')}
                    </p>

                    <span
                      className={`inline-block mt-3 px-3 py-1 rounded-full text-xs ${
                        booking.status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : booking.status === 'cancelled'
                          ? 'bg-gray-500/20 text-gray-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {booking.status === 'paid' ? 'Paid' : booking.status === 'cancelled' ? 'Cancelled' : 'Pending'}
                    </span>

                    {booking.status === 'paid' && (
                      <div className='mt-5 flex flex-col md:flex-row items-end md:items-center gap-4 justify-end'>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.stringify({bookingId: booking._id}))}`} 
                          alt="QR Code" 
                          className="w-16 h-16 bg-white p-1 rounded-lg" 
                        />
                        <button
                          onClick={() => window.open(`${API_URL}/bookings/${booking._id}/ticket`, '_blank')}
                          className='px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition shadow-lg'
                        >
                          Download Ticket
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Mybooking