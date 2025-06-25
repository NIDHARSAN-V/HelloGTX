import React, { useState } from 'react'
import AdminSidebar from './Sidebar'
import AdminHeader from './Header'
import { Outlet } from 'react-router-dom'

function AdminLayout() {


  const [openSidebar , setOpenSidebar] = useState(false)
  return (
    <div className='flex min-h-screen w-full'>
        <AdminSidebar open={openSidebar} setOpen={setOpenSidebar}/>
        <div className="flex flex-1 flex-col" >
             <AdminHeader setOpen={setOpenSidebar}/>
            <main className="flex flex-1 bg-blue-100 flex-col p-4 md:p-5">
            <Outlet/>
            </main>

        </div>
      
    </div>
  )
}

export default AdminLayout
