import React from 'react'

const AdminNavbar = () => {
  return (
    <div className='h-16 flex items-center justify-between px-6 border-b border-white/10 bg-black/40'>
      <h1 className='text-xl font-semibold text-white'>Admin Panel</h1>
      <button className='px-4 py-2 rounded-full bg-pink-500 text-white'>
        Admin
      </button>
    </div>
  )
}

export default AdminNavbar