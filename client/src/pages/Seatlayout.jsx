import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Clock3 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Loading from '../components/Loading'
import isoTimeFormat from '../lib/isoTimeFormat'
import { useAppContext } from '../context/AppContext'
import { useUser } from '@clerk/react'
import axios from 'axios'

const defaultSeatRows = [
  { row: 'A', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
  { row: 'B', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
  { row: 'C', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
  { row: 'D', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
  { row: 'E', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
  { row: 'F', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
  { row: 'G', seats: ['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
]

const defaultSeatTiers = [
  { name: 'Platinum', price: 400, rows: ['F', 'G'] },
  { name: 'Gold', price: 250, rows: ['C', 'D', 'E'] },
  { name: 'Silver', price: 150, rows: ['A', 'B'] }
]

const Seatlayout = () => {
  const { movieId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { shows, API_URL } = useAppContext()
  const { user } = useUser()

  const queryParams = new URLSearchParams(location.search)
  const selectedDate = queryParams.get('date')

  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedShow, setSelectedShow] = useState(null)
  const [loading, setLoading] = useState(false)

  const movieShows = useMemo(() => {
    return shows.filter((item) => {
      const showDate = new Date(item.showDateTime).toISOString().split('T')[0]

      return (
        item.movie?._id === movieId &&
        (!selectedDate || showDate === selectedDate)
      )
    })
  }, [shows, movieId, selectedDate])

  const movie = movieShows[0]?.movie || null

  useEffect(() => {
    setSelectedSeats([])
    setSelectedTime(null)
    setSelectedShow(null)
    setLoading(false)
  }, [movieId, selectedDate])

  const handleTimeSelect = (show) => {
    setSelectedShow(show)
    setSelectedTime(show.showDateTime)
    setSelectedSeats([])
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast('Please select time first')
    }

    if (selectedShow?.occupiedSeats?.[seatId]) {
      return toast('This seat is already booked')
    }

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {
      return toast('You can only select 5 seats')
    }

    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((seat) => seat !== seatId)
        : [...prev, seatId]
    )
  }

  const handleProceed = async () => {
    if (loading) return

    if (!user) {
      return toast('Please sign in to book tickets')
    }

    if (!selectedTime || !selectedShow) {
      return toast('Please select a timing')
    }

    if (selectedSeats.length === 0) {
      return toast('Please select at least one seat')
    }

    try {
      setLoading(true)

      const { data } = await axios.post(`${API_URL}/bookings/create`, {
        clerkId: user.id,
        showId: selectedShow._id,
        seats: selectedSeats,
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        image: user?.imageUrl,
      })

      if (data.success) {
        toast.success('Redirecting to checkout...')
        window.location.href = data.url
        return
      }

      toast.error(data.message || 'Booking failed')
      setLoading(false)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating booking')
      setLoading(false)
    }
  }

  if (!movie) return <Loading />

  return (
    <div className='min-h-screen overflow-hidden text-white'>
      <div className='relative min-h-screen px-6 md:px-12 lg:px-20 py-10 bg-[radial-gradient(circle_at_18%_30%,rgba(170,20,45,0.35),transparent_28%),radial-gradient(circle_at_75%_78%,rgba(150,20,45,0.18),transparent_22%),linear-gradient(to_bottom,#030303,#060203,#030303)]'>
        <div className='flex flex-col lg:flex-row gap-10'>
          <div className='w-full lg:w-[250px]'>
            <div className='rounded-2xl border border-pink-500/20 bg-[#22060d]/90 p-6 shadow-[0_0_40px_rgba(255,60,100,0.08)]'>
              <h2 className='text-2xl font-semibold mb-6'>Available Timings</h2>

              <div className='space-y-3'>
                {movieShows.length > 0 ? (
                  Array.from(
                    new Map(
                      movieShows.map((show) => [
                        isoTimeFormat(show.showDateTime),
                        show,
                      ])
                    ).values()
                  ).map((show) => (
                    <button
                      key={show._id}
                      onClick={() => handleTimeSelect(show)}
                      disabled={loading}
                      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${
                        selectedShow?._id === show._id
                          ? 'bg-pink-500 text-white'
                          : 'text-gray-200 hover:bg-pink-500/15'
                      }`}
                    >
                      <Clock3 className='h-5 w-5' />
                      <span className='text-lg'>
                        {isoTimeFormat(show.showDateTime)}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className='text-sm text-gray-400'>No timings available</p>
                )}
              </div>

              <div className='mt-6 space-y-3 text-gray-200'>
                <div>
                  <p className='text-sm text-gray-400'>Movie</p>
                  <p className='text-lg font-medium'>{movie.title}</p>
                </div>

                <div>
                  <p className='text-sm text-gray-400'>Price Total</p>
                  <p className='text-lg font-medium'>
                    Rs{' '}
                    {selectedSeats.length > 0
                      ? (() => {
                          const seatTiers =
                            selectedShow?.screen?.seatTiers?.length > 0
                              ? selectedShow.screen.seatTiers
                              : selectedShow?.seatTiers || defaultSeatTiers

                          return selectedSeats.reduce((acc, seat) => {
                            const row = seat.charAt(0)
                            const tier = seatTiers.find((tier) =>
                              tier.rows.includes(row)
                            )

                            const price = tier
                              ? tier.priceOffset || tier.price
                              : selectedShow?.showPrice || 150

                            return acc + price
                          }, 0)
                        })()
                      : selectedShow?.showPrice ?? movieShows[0]?.showPrice ?? 150}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='flex-1'>
            <h1 className='text-3xl md:text-5xl font-bold text-center mb-10'>
              Select Your Seat
            </h1>

            <div className='max-w-3xl mx-auto mb-14'>
              <div className='relative h-16 flex items-start justify-center'>
                <div className='w-full max-w-2xl h-10 border-t-[10px] border-pink-500/45 rounded-[100%] opacity-90' />
                <p className='absolute top-7 text-sm md:text-base font-medium text-gray-200 tracking-wide'>
                  SCREEN SIDE
                </p>
              </div>
            </div>

            <div className='max-w-5xl mx-auto'>
              <div className='space-y-5'>
                {(() => {
                  const seatRows =
                    selectedShow?.screen?.seatRows?.length > 0
                      ? selectedShow.screen.seatRows
                      : defaultSeatRows

                  const seatTiers =
                    selectedShow?.screen?.seatTiers?.length > 0
                      ? selectedShow.screen.seatTiers
                      : selectedShow?.seatTiers || defaultSeatTiers

                  const tierStartingRows = new Map()

                  seatTiers.forEach((tier) => {
                    if (tier.rows && tier.rows.length > 0) {
                      tierStartingRows.set(tier.rows[0], tier)
                    }
                  })

                  return seatRows.map((rowData, rowIndex) => {
                    const leftBlock = rowData.seats.slice(
                      0,
                      rowIndex < 2 ? 9 : 4
                    )
                    const rightBlock =
                      rowIndex < 2 ? [] : rowData.seats.slice(4)

                    const tierForThisRowStart = tierStartingRows.get(
                      rowData.row
                    )

                    return (
                      <React.Fragment key={rowData.row}>
                        {tierForThisRowStart && (
                          <div className='w-full text-center text-xs tracking-widest font-bold text-pink-500/80 mt-6 mb-2 border-t border-pink-500/20 pt-4 uppercase'>
                            {tierForThisRowStart.name} TIER - Rs{' '}
                            {tierForThisRowStart.priceOffset ||
                              tierForThisRowStart.price ||
                              150}
                          </div>
                        )}

                        <div className='flex items-center justify-center gap-4 md:gap-6'>
                          <div className='w-6 text-gray-400 font-medium'>
                            {rowData.row}
                          </div>

                          <div className='flex items-center gap-2 md:gap-3'>
                            {leftBlock.map((seatNo) => {
                              const seatId = `${rowData.row}${seatNo}`
                              const isSelected = selectedSeats.includes(seatId)
                              const isOccupied = Boolean(
                                selectedShow?.occupiedSeats?.[seatId]
                              )

                              return (
                                <button
                                  key={seatId}
                                  onClick={() => handleSeatClick(seatId)}
                                  disabled={isOccupied || loading}
                                  className={`h-9 w-9 md:h-11 md:w-11 rounded-md border transition ${
                                    isOccupied
                                      ? 'bg-gray-500 border-gray-600 cursor-not-allowed opacity-50'
                                      : isSelected
                                      ? 'bg-pink-500 border-pink-400 shadow-[0_0_18px_rgba(255,90,130,0.35)] text-white'
                                      : 'border-pink-500/45 bg-transparent hover:bg-pink-500/10'
                                  }`}
                                  title={seatId}
                                />
                              )
                            })}
                          </div>

                          {rowIndex >= 2 && <div className='w-6 md:w-10' />}

                          {rowIndex >= 2 && (
                            <div className='flex items-center gap-2 md:gap-3'>
                              {rightBlock.map((seatNo) => {
                                const seatId = `${rowData.row}${seatNo}`
                                const isSelected =
                                  selectedSeats.includes(seatId)
                                const isOccupied = Boolean(
                                  selectedShow?.occupiedSeats?.[seatId]
                                )

                                return (
                                  <button
                                    key={seatId}
                                    onClick={() => handleSeatClick(seatId)}
                                    disabled={isOccupied || loading}
                                    className={`h-9 w-9 md:h-11 md:w-11 rounded-md border transition ${
                                      isOccupied
                                        ? 'bg-gray-500 border-gray-600 cursor-not-allowed opacity-50'
                                        : isSelected
                                        ? 'bg-pink-500 border-pink-400 shadow-[0_0_18px_rgba(255,90,130,0.35)] text-white'
                                        : 'border-pink-500/45 bg-transparent hover:bg-pink-500/10'
                                    }`}
                                    title={seatId}
                                  />
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </React.Fragment>
                    )
                  })
                })()}
              </div>

              <div className='mt-12 text-center space-y-2 text-gray-300'>
                <p>
                  Movie: <span className='text-white'>{movie.title}</span>
                </p>

                <p>
                  Selected time:{' '}
                  <span className='text-white'>
                    {selectedTime ? isoTimeFormat(selectedTime) : 'None'}
                  </span>
                </p>

                <p>
                  Selected seats:{' '}
                  <span className='text-white'>
                    {selectedSeats.length > 0
                      ? selectedSeats.join(', ')
                      : 'None'}
                  </span>
                </p>
              </div>

              <div className='mt-8 flex justify-center gap-6 text-sm text-gray-300'>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded border border-pink-500/45' />
                  <span>Available</span>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded bg-pink-500' />
                  <span>Selected</span>
                </div>

                <div className='flex items-center gap-2'>
                  <div className='h-4 w-4 rounded bg-gray-500 border-gray-600 opacity-50' />
                  <span>Occupied</span>
                </div>
              </div>

              <div className='mt-10 flex justify-center'>
                <button
                  onClick={handleProceed}
                  disabled={loading}
                  className='rounded-full bg-pink-500 px-8 py-3 text-base font-semibold transition hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Redirecting...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Seatlayout