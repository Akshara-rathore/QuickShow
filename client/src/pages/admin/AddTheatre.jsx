import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import Title from '../../components/admin/Title'
import { toast } from 'react-hot-toast'

const AddTheatre = () => {
  const { addTheatre } = useAppContext()

  const [name, setName] = useState('')
  const [location, setLocation] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name || !location) {
      toast.error('Please fill all fields')
      return
    }

    try {
      await addTheatre({ name, location })
      toast.success('Theatre added successfully!')
      setName('')
      setLocation('')
    } catch (err) {
      toast.error('Failed to add theatre. Check console.')
    }
  }

  return (
    <div className="p-6 text-white">
      <Title text1="Admin" text2="Add Theatre" />

      <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
        <input
          type="text"
          placeholder="Theatre Name (e.g., PVR Cinemas)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded bg-black border border-primary/20 outline-none"
          required
        />

        <input
          type="text"
          placeholder="Location (e.g., City Mall, New York)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-3 rounded bg-black border border-primary/20 outline-none"
          required
        />

        <button
          type="submit"
          className="px-5 py-3 bg-primary hover:bg-primary/90 rounded-md transition"
        >
          Add Theatre
        </button>
      </form>
    </div>
  )
}

export default AddTheatre
