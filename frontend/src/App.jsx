import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Forecast from './pages/Forecast.jsx'
import Compare from './pages/Compare.jsx'
import Assistant from './pages/Assistant.jsx'
import Auth from './pages/Auth.jsx'
import Profile from './pages/Profile.jsx'
import Transactions from './pages/Transactions.jsx'
import Settings from './pages/Settings.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="compare" element={<Compare />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="profile" element={<Profile />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
