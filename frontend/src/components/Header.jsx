import React from 'react'
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back, User
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <BellIcon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <UserCircleIcon className="w-8 h-8 text-gray-400" />
            <div className="text-sm">
              <p className="font-medium text-gray-900">John Doe</p>
              <p className="text-gray-500">john@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
