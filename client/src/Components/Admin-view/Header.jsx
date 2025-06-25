import React from 'react'
import { Button } from '../ui/button'
import { AlignJustify, LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { loginUser, logoutUser } from '@/Store/AuthSlice'
function AdminHeader({setOpen}) {
  const dispatch =useDispatch()

  const handleLogout = async function()
  {
     dispatch(logoutUser()).then(data , ()=>{
      
     })
  }
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">



      <Button className="lg:hidden sm:block" onClick={function()
        {
          setOpen(true)
        }
      }>
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>

      
      
      <div className="flex flex-1 justify-end">
        <Button
          
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"

          onClick={handleLogout}
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  )
}

export default AdminHeader
