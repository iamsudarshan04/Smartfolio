import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Sidebar from './Sidebar.jsx'

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4">
          <Outlet /> {/* Nested routes render here */}
        </main>
      </div>
    </div>
  )
}

export default Layout
