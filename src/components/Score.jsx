import React from 'react'

export default function Score({score , turn}) {
  return (
    <div>
        <div className='flex justify-between text-xl md:text-3xl'>
        <p>x score {score.x}</p>
        <p>draw {score.draw}</p>
        <p>o score {score.o}</p>
    </div>
    <p className='text-2xl mx-auto w-fit mt-4'>Its {turn} Trun</p>
    </div>
  )
}
