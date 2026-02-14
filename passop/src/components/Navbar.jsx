import React from 'react'

const navbar = () => {
  return (
     <nav className='bg-slate-800  p-4 flex justify-between items-center text-white'>
        <div className="logo font-bold">
            <span className='text-green-700'> &lt;</span>
              
           <span>pass</span><span className='text-green-700'>OP/&gt;</span>
             </div>
        <ul>
            <li className='flex gap-4'>
                <a className='hover:font-bold'  href="/">Home</a>
                <a className='hover:font-bold' href="/">about</a>
                <a className='hover:font-bold' href="/">contact</a>
                <a className='hover:font-bold' href="/">more</a>
            </li>
        </ul>
     </nav>
  )
}

export default navbar