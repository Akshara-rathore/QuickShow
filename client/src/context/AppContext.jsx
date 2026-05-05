import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/react'
import { toast } from 'react-hot-toast'
const AppContext = createContext()
const API_URL = 'http://localhost:5000/api'

export const AppProvider = ({ children }) => {
  const { user } = useUser()
  const [shows, setShows] = useState([])
  const [bookings, setBookings] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [users, setUsers] = useState([]) // Typically fetched from backend for admin

  const fetchShows = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/shows`)
      if (data.success) {
        setShows(data.shows)
      }
    } catch (error) {
      console.error('Error fetching shows:', error)
    }
  }

  const fetchBookings = async () => {
    if (!user) return;
    try {
      const { data } = await axios.get(`${API_URL}/bookings/my-bookings?clerkId=${user.id}`)
      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const fetchAllBookings = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/bookings/all`)
      if (data.success) {
        setAllBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching all bookings:', error)
    }
  }

  useEffect(() => {
    fetchShows()
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [user])

  const addShow = async (newShow) => {
    try {
      const { data } = await axios.post(`${API_URL}/shows/add`, newShow)
      if (data.success) {
        setShows((prev) => [...prev, data.show])
      }
    } catch (error) {
      console.error('Error adding show:', error)
      throw error
    }
  }

  const deleteShow = async (id) => {
    try {
      const { data } = await axios.delete(`${API_URL}/shows/${id}`)
      if (data.success) {
        setShows((prev) => prev.filter((show) => show._id !== id))
        toast.success(data.message)
      }
    } catch (error) {
      console.error('Error deleting show:', error)
      toast.error('Failed to delete show')
    }
  }

  const dashboardData = {
    totalBookings: bookings.length,
    totalRevenue: bookings
      .filter((booking) => booking.status === 'paid')
      .reduce((sum, booking) => sum + booking.amount, 0),
    activeShows: shows,
    totalUser: users.length,
    shows,
  }

  return (
    <AppContext.Provider
      value={{
        shows,
        bookings,
        users,
        addShow,
        deleteShow,
        fetchShows,
        fetchBookings,
        fetchAllBookings,
        dashboardData,
        allBookings,
        API_URL
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)