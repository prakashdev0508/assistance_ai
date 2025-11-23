import React from 'react'

const loading = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
        <div className='flex items-center justify-center h-screen'>
            <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500'></div>
            <br />
            <p className='text-sm text-gray-500'>Loading Gmail...</p>
        </div>
    </div>
  )
}

export default loading