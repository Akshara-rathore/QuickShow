import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetails from './pages/MovieDetails'
import Seatlayout from './pages/Seatlayout'
import Mybooking from './pages/Mybooking'
import Favorite from './pages/Favorite'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import Layout from './pages/admin/Layout'
import AddShows from './pages/admin/AddShows'
import ListShows from './pages/admin/ListShows'
import ListBookings from './pages/admin/ListBookings'
import Dashboard from './pages/admin/Dashboard'

const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen text-white bg-[radial-gradient(circle_at_18%_30%,rgba(170,20,45,0.35),transparent_28%),radial-gradient(circle_at_75%_78%,rgba(150,20,45,0.18),transparent_22%),linear-gradient(to_bottom,#030303,#060203,#030303)]">
      <Toaster />

      {!isAdminRoute && <Navbar />}

      <div className={!isAdminRoute ? 'pt-20 min-h-screen' : 'min-h-screen'}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/movies' element={<Movies />} />
          <Route path='/movies/:id' element={<MovieDetails />} />
        <Route path='/seat-layout/:movieId' element={<Seatlayout />} />
          <Route path='/my-booking' element={<Mybooking />} />
          <Route path='/favorite' element={<Favorite />} />

          <Route path='/admin' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='add-shows' element={<AddShows />} />
            <Route path='list-shows' element={<ListShows />} />
            <Route path='list-bookings' element={<ListBookings />} />
          </Route>
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
    </div>
  )
}

export default App