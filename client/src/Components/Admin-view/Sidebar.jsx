import { adminSidebarMenuItems } from '@/config'
import { ChartNoAxesCombined } from 'lucide-react'
import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { SheetContent, SheetHeader, Sheet } from '../ui/sheet'

function AdminSidebar({ open, setOpen }) {

  const navigate = useNavigate()

  function MenuItems({ setOpen }) {
    return (
      <nav className="mt-8 flex-col flex gap-2">
        {adminSidebarMenuItems.map(menuItem => (
          <div
            className='flex items-center rounded-md px-3 py-2 gap-5 text-muted-foreground hover:text-foreground text-xl cursor-pointer'
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path)
              if (setOpen) setOpen(false) // Closing the sidebar on item click
            }}
          >
            {menuItem.icon}
            {menuItem.label}
          </div>
        ))}
      </nav>
    )
  }

  return (
    <Fragment>
      {/* Sheet for mobile or smaller screens */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side='left' className='w-64'>
          <SheetHeader>
            <div className="flex gap-2 mt-5 mb-4">
              <ChartNoAxesCombined size={30} />
              <h1 className="text-2xl font-extrabold">Admin Panel</h1>
            </div>
          </SheetHeader>
          <MenuItems setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* Sidebar for large screens */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/admin/navigate")} // Ensure navigate is called here
        >
          <ChartNoAxesCombined size={30} />
          <h1 className='text-xl font-extrabold'>Admin Panel</h1>
        </div>
        <MenuItems setOpen={setOpen} />
      </aside>
    </Fragment>
  )
}

export default AdminSidebar
