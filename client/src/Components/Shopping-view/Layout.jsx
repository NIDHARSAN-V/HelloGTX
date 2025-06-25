import React from 'react'
import ShoppingViewHeader from './Header'
import { Outlet } from 'react-router-dom'
// import [Outlet]

function ShoppingViewLayout() {
  return (
    <div className='flex flex-col bg-white overflow-hidden'>
      <ShoppingViewHeader/>
      <main className="flex flex-col w-full">
        <Outlet/>
      </main>
       
    </div>
  )
}

export default ShoppingViewLayout
