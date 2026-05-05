import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DateSelect = ({
  bookingDates,
  selectedDate,
  setSelectedDate,
  dateOffset,
  setDateOffset,
}) => {
  const visibleDates = bookingDates.slice(dateOffset, dateOffset + 5)

  const showPrevDates = () => {
    setDateOffset((prev) => Math.max(prev - 1, 0))
  }

  const showNextDates = () => {
    setDateOffset((prev) => Math.min(prev + 1, bookingDates.length - 5))
  }

  return (
    <div className='mt-12 rounded-3xl border border-red-400/10 bg-[#1a0b10] px-6 py-6 md:px-10 shadow-[0_0_80px_rgba(255,60,90,0.08)]'>
      <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
        <div className='flex-1'>
          <h3 className='text-xl font-semibold mb-4 text-white'>Choose Date</h3>

          <div className='flex items-center gap-3 flex-wrap'>
            <button
              onClick={showPrevDates}
              disabled={dateOffset === 0}
              className='flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-pink-400 hover:bg-white/10 transition disabled:opacity-40'
            >
              <ChevronLeft className='w-5 h-5' />
            </button>

            {visibleDates.map((item) => {
              const isSelected =
                selectedDate?.fullDate?.toDateString() ===
                item.fullDate.toDateString()

              return (
                <button
                  key={item.key}
                  onClick={() => setSelectedDate(item)}
                  className={`min-w-[72px] rounded-xl border px-4 py-3 text-center transition ${
                    isSelected
                      ? 'bg-pink-500 text-white border-pink-400 shadow-[0_0_20px_rgba(255,80,120,0.35)]'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <p className='text-sm font-medium'>{item.day}</p>
                  <p className='text-lg font-bold'>{item.date}</p>
                </button>
              )
            })}

            <button
              onClick={showNextDates}
              disabled={dateOffset >= bookingDates.length - 5}
              className='flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-pink-400 hover:bg-white/10 transition disabled:opacity-40'
            >
              <ChevronRight className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DateSelect