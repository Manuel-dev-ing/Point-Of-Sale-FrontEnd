import React from 'react'

export default function ErrorMessage({children} : {children: React.ReactNode}) {
  return (
    <div className='my-0 text-red-600'>
        {children}
    </div>
  )
}



