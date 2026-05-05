import React from 'react'
import Title from '../../components/admin/Title'
import { useAppContext } from '../../context/AppContext'

const ListShows = () => {
  const { shows, deleteShow } = useAppContext()

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
      <Title text1="Admin" text2="List Shows" />

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-sm text-left border border-primary/20 rounded-lg overflow-hidden">
          <thead className="bg-primary/10 text-gray-300">
            <tr>
              <th className="px-4 py-3">Movie</th>
              <th className="px-4 py-3">Date & Time</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Booked Seats</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {shows.length > 0 ? (
              shows.map((show) => (
                <tr
                  key={show._id}
                  className="border-t border-primary/20 hover:bg-primary/5"
                >
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={
                        show.movie?.poster_path ||
                        show.movie?.backdrop_path
                      }
                      alt={show.movie?.title}
                      className="w-10 h-14 object-cover rounded"
                    />
                    <span>{show.movie?.title}</span>
                  </td>

                  <td className="px-4 py-3">
                    {formatDateTime(show.showDateTime)}
                  </td>

                  <td className="px-4 py-3">
                    Rs {show.showPrice}
                  </td>

                  <td className="px-4 py-3">
                    {Object.keys(show.occupiedSeats || {}).length}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteShow(show._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-400">
                  No shows added yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ListShows