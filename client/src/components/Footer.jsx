import React from 'react'

const Footer = () => {
  return (
    <footer className='bg-black text-gray-400 px-6 md:px-16 lg:px-24 xl:px-44 pt-16 pb-8 mt-20 border-t border-white/10'>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>

        {/* Logo + Description */}
        <div>
          <h1 className='text-2xl font-bold text-white'>QuickShow</h1>
          <p className='mt-4 text-sm'>
            Your one-stop platform to discover movies, watch trailers, and book tickets effortlessly.
          </p>
        </div>

        {/* Links */}
        <div>
          <h2 className='text-white font-semibold mb-4'>Quick Links</h2>
          <ul className='space-y-2 text-sm'>
            <li className='hover:text-white cursor-pointer'>Home</li>
            <li className='hover:text-white cursor-pointer'>Movies</li>
            <li className='hover:text-white cursor-pointer'>Theaters</li>
            <li className='hover:text-white cursor-pointer'>Favorites</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className='text-white font-semibold mb-4'>Contact</h2>
          <p className='text-sm'>Email: support@quickshow.com</p>
          <p className='text-sm mt-2'>Phone: +91 98765 43210</p>
        </div>

      </div>

      {/* Bottom line */}
      <div className='text-center text-sm mt-12 border-t border-white/10 pt-6'>
        © {new Date().getFullYear()} QuickShow. All rights reserved.
      </div>

    </footer>
  )
}

export default Footer