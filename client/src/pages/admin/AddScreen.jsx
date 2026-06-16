import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Title from '../../components/admin/Title'
import { toast } from 'react-hot-toast'

const AddScreen = () => {
  const { addScreen, theatres } = useAppContext()

  const [name, setName] = useState('')
  const [theatreId, setTheatreId] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !theatreId) {
      toast.error('Please fill all fields')
      return
    }

    try {
      await addScreen({ name, theatre: theatreId })
      toast.success('Screen added successfully!')
      setName('')
    } catch (err) {
      toast.error('Failed to add screen. Check console.')
    }
  }

  return (
    <div className="p-6 text-white">
      <Title text1="Admin" text2="Add Screen" />

      <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
        <select
          value={theatreId}
          onChange={(e) => setTheatreId(e.target.value)}
          className="w-full p-3 rounded bg-black border border-primary/20 outline-none"
          required
        >
          <option value="" disabled>Select Theatre</option>
          {theatres.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} - {t.location}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Screen Name (e.g., Screen 1 or IMAX)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-black border border-primary/20 outline-none"
          required
        />

        <p className="text-xs text-gray-400">
          Note: This uses the default layout (Rows A-G, 9 seats each).
        </p>

        <button
          type="submit"
          className="px-5 py-3 bg-primary hover:bg-primary/90 rounded-md transition"
        >
          Add Screen
        </button>
      </form>
    </div>
  )
}

export default AddScreen
