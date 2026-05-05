import React from 'react'
import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircle,
  UsersIcon,
} from 'lucide-react'
import Loading from '../../components/Loading'
import Title from '../../components/admin/Title'
import BlurCircle from '../../components/BlurCircle'
import { useAppContext } from '../../context/AppContext'

const Dashboard = () => {
  const { dashboardData } = useAppContext()

  if (!dashboardData) return <Loading />

  const dashboardCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.totalBookings ?? '0',
      icon: ChartLineIcon,
    },
    {
      title: 'Total Revenue',
      value: `Rs ${Number(dashboardData.totalRevenue ?? 0).toLocaleString('en-IN')}`,
      icon: CircleDollarSignIcon,
    },
    {
      title: 'Active Shows',
      value: dashboardData.activeShows?.length ?? '0',
      icon: PlayCircle,
    },
    {
      title: 'Total Users',
      value: dashboardData.totalUser ?? '0',
      icon: UsersIcon,
    },
  ]

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
    <div className="relative pt-6 px-6 md:px-10 text-white">
      <BlurCircle top="-80px" left="-40px" />

      <Title text1="Admin" text2="Dashboard" />

      {/* Cards */}
      <div className="flex flex-wrap gap-5 mt-8">
        {dashboardCards.map((card, index) => {
          const Icon = card.icon

          return (
            <div
              key={index}
              className="flex items-center justify-between px-5 py-4 bg-primary/10 border border-primary/20 rounded-md w-full max-w-[220px] min-h-[100px]"
            >
              <div>
                <h1 className="text-sm text-gray-300">{card.title}</h1>
                <p className="text-2xl font-semibold mt-2 text-white">
                  {card.value}
                </p>
              </div>
              <Icon className="w-6 h-6 text-white/90" />
            </div>
          )
        })}
      </div>

      {/* Active Shows */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6">Active Shows</h2>

        <div className="flex flex-wrap gap-4">
          {dashboardData.shows?.length > 0 ? (
            dashboardData.shows.map((show) => (
              <div
                key={show._id}
                className="w-full max-w-[200px] rounded-lg overflow-hidden bg-primary/10 border border-primary/20"
              >
                <img
                  src={
                    show.movie?.poster_path ||
                    show.movie?.backdrop_path
                  }
                  alt={show.movie?.title}
                  className="w-full h-[240px] object-cover"
                />

                <div className="p-3">
                  <h3 className="text-sm font-medium truncate">
                    {show.movie?.title}
                  </h3>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-semibold">
                      Rs {show.showPrice}
                    </p>

                    <div className="flex items-center gap-1 text-primary">
                      ⭐
                      <span className="text-xs">
                        {show.movie?.vote_average?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    {formatDateTime(show.showDateTime)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No active shows yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard