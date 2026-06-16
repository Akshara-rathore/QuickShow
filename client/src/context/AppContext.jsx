import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '@clerk/react'
import { toast } from 'react-hot-toast'

const AppContext = createContext()

const API_URL = 'http://localhost:5000/api'

export const AppProvider = ({ children }) => {
  const { user } = useUser()

  const [shows, setShows] = useState([])
  const [movies, setMovies] = useState([])
  const [nowShowingMovies, setNowShowingMovies] = useState([])
  const [comingSoonMovies, setComingSoonMovies] = useState([])
  const [bookings, setBookings] = useState([])
  const [allBookings, setAllBookings] = useState([])
  const [users, setUsers] = useState([])
  const [theatres, setTheatres] = useState([])
  const [screens, setScreens] = useState([])

  // FETCH ALL MOVIES
  const fetchMovies = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/movies`)

      if (data.success) {
        setMovies(data.movies)
      }
    } catch (error) {
      console.error('Error fetching movies:', error)
    }
  }

  // FETCH NOW SHOWING MOVIES
  const fetchNowShowingMovies = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/movies/now-showing`)

      if (data.success) {
        setNowShowingMovies(data.movies)
      }
    } catch (error) {
      console.error('Error fetching now showing movies:', error)
    }
  }

  // FETCH COMING SOON MOVIES
  const fetchComingSoonMovies = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/movies/coming-soon`)

      if (data.success) {
        setComingSoonMovies(data.movies)
      }
    } catch (error) {
      console.error('Error fetching coming soon movies:', error)
    }
  }

  // FETCH SHOWS
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

  // FETCH USER BOOKINGS
  const fetchBookings = async () => {
    if (!user) return

    try {
      const { data } = await axios.get(
        `${API_URL}/bookings/my-bookings?clerkId=${user.id}`
      )

      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  // FETCH ALL BOOKINGS
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

  // FETCH THEATRES
  const fetchTheatres = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/theatres`)

      if (data.success) {
        setTheatres(data.theatres)
      }
    } catch (error) {
      console.error('Error fetching theatres:', error)
    }
  }

  // FETCH SCREENS
  const fetchScreens = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/screens`)

      if (data.success) {
        setScreens(data.screens)
      }
    } catch (error) {
      console.error('Error fetching screens:', error)
    }
  }

  useEffect(() => {
    fetchMovies()
    fetchNowShowingMovies()
    fetchComingSoonMovies()
    fetchShows()
    fetchTheatres()
    fetchScreens()
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [user])

  // ADD SHOW
  const addShow = async (newShow) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/shows/add`,
        newShow
      )

      if (data.success) {
        setShows((prev) => [...prev, data.show])
      }
    } catch (error) {
      console.error('Error adding show:', error)
      throw error
    }
  }

  // ADD THEATRE
  const addTheatre = async (newTheatre) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/theatres/add`,
        newTheatre
      )

      if (data.success) {
        setTheatres((prev) => [...prev, data.theatre])
        return true
      }
    } catch (error) {
      console.error('Error adding theatre:', error)
      throw error
    }
  }

  // ADD SCREEN
  const addScreen = async (newScreen) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/screens/add`,
        newScreen
      )

      if (data.success) {
        setScreens((prev) => [...prev, data.screen])
        return true
      }
    } catch (error) {
      console.error('Error adding screen:', error)
      throw error
    }
  }

  // DELETE SHOW
  const deleteShow = async (id) => {
    try {
      const { data } = await axios.delete(`${API_URL}/shows/${id}`)

      if (data.success) {
        setShows((prev) =>
          prev.filter((show) => show._id !== id)
        )

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
        movies,
        nowShowingMovies,
        comingSoonMovies,
        shows,
        bookings,
        users,
        theatres,
        screens,
        addShow,
        deleteShow,
        addTheatre,
        addScreen,
        fetchMovies,
        fetchNowShowingMovies,
        fetchComingSoonMovies,
        fetchShows,
        fetchBookings,
        fetchAllBookings,
        fetchTheatres,
        fetchScreens,
        dashboardData,
        allBookings,
        API_URL,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)