import React, { useState } from 'react'
import { dummyShowsData } from '../../assets/assets'
import { useAppContext } from '../../context/AppContext'
import Title from '../../components/admin/Title'
import { toast } from 'react-hot-toast'

const AddShows = () => {
  const { addShow } = useAppContext()

  const [movieId, setMovieId] = useState(dummyShowsData[0]?._id || '')
  const [showPrice, setShowPrice] = useState('')
  const [showDateTime, setShowDateTime] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const selectedMovie = dummyShowsData.find((movie) => movie._id === movieId)

    if (!selectedMovie || !showPrice || !showDateTime) {
      toast.error('Please fill all fields')
      return
    }

    try {
      await addShow({
        movie: selectedMovie,
        showPrice: Number(showPrice),
        showDateTime,
        occupiedSeats: {},
      })
      toast.success('Show added successfully!')

      setShowPrice('')
      setShowDateTime('')
      setMovieId(dummyShowsData[0]?._id || '')
    } catch (err) {
      toast.error('Failed to add show. Check console.')
    }
  }

  return (
    <div className="p-6 text-white">
      <Title text1="Admin" text2="Add Shows" />

      <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
        <select
          value={movieId}
          onChange={(e) => setMovieId(e.target.value)}
          className="w-full p-3 rounded bg-black border border-primary/20 outline-none"
        >
          {dummyShowsData.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Show Price"
          value={showPrice}
          onChange={(e) => setShowPrice(e.target.value)}
          className="w-full p-3 rounded bg-black border border-primary/20 outline-none"
          required
        />

        <input
          type="datetime-local"
          value={showDateTime}
          onChange={(e) => setShowDateTime(e.target.value)}
          className="w-full p-3 rounded bg-black border border-primary/20 outline-none"
          required
        />

        <button
          type="submit"
          className="px-5 py-3 bg-primary hover:bg-primary/90 rounded-md transition"
        >
          Add Show
        </button>
      </form>
    </div>
  )
}

export default AddShows