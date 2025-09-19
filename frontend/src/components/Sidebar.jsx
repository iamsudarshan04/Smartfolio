import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <ul className="space-y-2">
        <li><Link to="/" className="block p-2 hover:bg-gray-200 rounded">Dashboard</Link></li>
        <li><Link to="/portfolio" className="block p-2 hover:bg-gray-200 rounded">Portfolio</Link></li>
        <li><Link to="/forecast" className="block p-2 hover:bg-gray-200 rounded">Forecast</Link></li>
        <li><Link to="/compare" className="block p-2 hover:bg-gray-200 rounded">Compare</Link></li>
        <li><Link to="/assistant" className="block p-2 hover:bg-gray-200 rounded">Assistant</Link></li>
        <li><Link to="/profile" className="block p-2 hover:bg-gray-200 rounded">Profile</Link></li>
        <li><Link to="/transactions" className="block p-2 hover:bg-gray-200 rounded">Transactions</Link></li>
        <li><Link to="/settings" className="block p-2 hover:bg-gray-200 rounded">Settings</Link></li>
      </ul>
    </aside>
  )
}

export default Sidebar
