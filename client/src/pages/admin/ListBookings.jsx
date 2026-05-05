import React, { useEffect } from 'react'
import Title from '../../components/admin/Title'
import { useAppContext } from '../../context/AppContext'

const ListBookings = () => {
  const { allBookings, fetchAllBookings } = useAppContext()

  useEffect(() => {
    fetchAllBookings()
  }, [])

  const formatDateTime = (dateTime) => {
    if (!dateTime) return ''
    const date = new Date(dateTime)
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6 text-white">
      <Title text1="Admin" text2="List Bookings" />

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm text-left border border-primary/20 rounded-lg overflow-hidden">
          <thead className="bg-primary/10 text-gray-300">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Movie</th>
              <th className="px-4 py-3">Show Time</th>
              <th className="px-4 py-3">Seats</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Payment</th>
            </tr>
          </thead>

          <tbody>
            {allBookings?.length > 0 ? (
              allBookings.map((booking, index) => (
                <tr
                  key={booking._id || index}
                  className="border-t border-primary/20 hover:bg-primary/5"
                >
                  <td className="px-4 py-3">{booking.user?.name}</td>

                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={
                        booking.show?.movie?.poster_path ||
                        booking.show?.movie?.backdrop_path
                      }
                      alt={booking.show?.movie?.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                    <span>{booking.show?.movie?.title}</span>
                  </td>

                  <td className="px-4 py-3">
                    {formatDateTime(booking.show?.showDateTime)}
                  </td>

                  <td className="px-4 py-3">
                    {booking.bookedSeats?.join(', ') || 'No seats'}
                  </td>

                  <td className="px-4 py-3">
                    Rs {Number(booking.amount || 0).toLocaleString('en-IN')}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {booking.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListBookings