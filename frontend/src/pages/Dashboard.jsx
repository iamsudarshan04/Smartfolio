import React, { useState, useEffect } from 'react'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Card from '../components/Card'
import { apiService } from '../services/api'    

const Dashboard = () => {
  const [portfolioData, setPortfolioData] = useState(null)
  const [marketIndices, setMarketIndices] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [indices] = await Promise.all([
        apiService.getMarketIndices()
      ])
      setMarketIndices(indices.data.indices || {})
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Sample data for charts
  const performanceData = [
    { date: '2024-01', value: 10000 },
    { date: '2024-02', value: 10500 },
    { date: '2024-03', value: 10200 },
    { date: '2024-04', value: 11000 },
    { date: '2024-05', value: 11500 },
    { date: '2024-06', value: 12000 },
  ]

  const allocationData = [
    { name: 'Stocks', value: 60, color: '#3b82f6' },
    { name: 'Bonds', value: 25, color: '#10b981' },
    { name: 'Cash', value: 10, color: '#f59e0b' },
    { name: 'Other', value: 5, color: '#ef4444' },
  ]

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: '$124,500',
      change: '+12.5%',
      changeType: 'positive',
      icon: ArrowUpIcon
    },
    {
      title: 'Today\'s Change',
      value: '+$1,250',
      change: '+1.02%',
      changeType: 'positive',
      icon: ArrowUpIcon
    },
    {
      title: 'Total Return',
      value: '+$24,500',
      change: '+24.5%',
      changeType: 'positive',
      icon: ArrowUpIcon
    },
    {
      title: 'Cash Balance',
      value: '$5,200',
      change: '-2.1%',
      changeType: 'negative',
      icon: ArrowDownIcon
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button className="btn-primary">
          Add Investment
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className={`flex items-center mt-1 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <stat.icon className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{stat.change}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Performance Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Asset Allocation Chart */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Market Indices */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(marketIndices).map(([symbol, data]) => (
            <div key={symbol} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600">{symbol}</p>
              <p className="text-xl font-bold text-gray-900">${data.price?.toFixed(2)}</p>
              <div className={`flex items-center justify-center mt-1 ${
                data.change_percent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {data.change_percent >= 0 ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{data.change_percent?.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
