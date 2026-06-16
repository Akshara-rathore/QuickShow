import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboardIcon,
  PlusSquareIcon,
  ListIcon,
  ListCollapseIcon,
} from 'lucide-react'
import { assets } from '../../assets/assets'

const AdminSidebar = () => {
  const user = {
    firstName: 'Admin',
    lastName: 'User',
    imageUrl: assets.profile,
  }

  const adminNavlinks = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboardIcon },
    { name: 'Add Theatre', path: '/admin/add-theatre', icon: PlusSquareIcon },
    { name: 'Add Screen', path: '/admin/add-screen', icon: PlusSquareIcon },
    { name: 'Add Shows', path: '/admin/add-shows', icon: PlusSquareIcon },
    { name: 'List Shows', path: '/admin/list-shows', icon: ListIcon },
    { name: 'List Bookings', path: '/admin/list-bookings', icon: ListCollapseIcon },
  ]

  return (
    <div className='h-[calc(100vh-64px)] md:flex md:flex-col items-center pt-8 max-w-20 md:max-w-60 w-full border-r border-gray-300/20 text-sm'>
      <img
        className='h-9 w-9 md:h-14 md:w-14 rounded-full mx-auto object-cover'
        src={user.imageUrl}
        alt='sidebar profile'
      />

      <p className='mt-2 text-base hidden md:block'>
        {user.firstName} {user.lastName}
      </p>

      <div className='w-full mt-4'>
        {adminNavlinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            end={link.path === '/admin'}
            className={({ isActive }) =>
              `relative flex items-center max-md:justify-center gap-3 w-full py-3 md:pl-10 text-gray-400 transition ${
                isActive ? 'bg-pink-500/15 text-pink-500 group' : 'hover:bg-white/5'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className='w-5 h-5' />
                <p className='hidden md:block'>{link.name}</p>

                <span
                  className={`absolute right-0 h-10 w-1.5 rounded-l-full ${
                    isActive ? 'bg-pink-500' : ''
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default AdminSidebar