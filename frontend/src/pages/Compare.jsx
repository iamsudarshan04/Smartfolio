import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import Card from '../components/Card'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const Compare = () => {
  const [symbols, setSymbols] = useState(['AAPL', 'GOOGL'])
  const [period, setPeriod] = useState('1y')
  const [comparisonData, setComparisonData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCompare = async () => {
    setLoading(true)
    try {
      const validSymbols = symbols.filter(s => s.trim() !== '')
      if (validSymbols.length < 2) {
        toast.error('Please add at least 2 symbols to compare')
        return
      }

      const response = await apiService.getBatchStockData(validSymbols, period)
      if (response.data.success) {
        processComparisonData(response.data.data, validSymbols)
        toast.success('Comparison data loaded successfully!')
      }
    } catch (error) {
      console.error('Error fetching comparison data:', error)
      toast.error('Failed to fetch comparison data')
    } finally {
      setLoading(false)
    }
  }

  const processComparisonData = (data, validSymbols) => {
    // Process the data for comparison charts
    const chartData = []
    const metricsData = {}

    validSymbols.forEach(symbol => {
      if (data[symbol] && data[symbol].data) {
        const stockData = data[symbol].data
        const info = data[symbol].info

        // Calculate metrics
        const prices = stockData.map(d => d.Close)
        const firstPrice = prices[0]
        const lastPrice = prices[prices.length - 1]
        const totalReturn = ((lastPrice - firstPrice) / firstPrice) * 100

        // Calculate volatility (simplified)
        const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i])
        const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
        const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100 // Annualized

        metricsData[symbol] = {
          currentPrice: lastPrice,
          totalReturn: totalReturn,
          volatility: volatility,
          marketCap: info.marketCap || 0,
          peRatio: info.trailingPE || 0,
          sector: info.sector || 'Unknown'
        }

        // Normalize prices for comparison (base 100)
        stockData.forEach((dataPoint, index) => {
          const normalizedPrice = (dataPoint.Close / firstPrice) * 100
          
          if (chartData[index]) {
            chartData[index][symbol] = normalizedPrice
          } else {
            chartData[index] = {
              date: dataPoint.Date,
              [symbol]: normalizedPrice
            }
          }
        })
      }
    })

    setComparisonData({
      chartData,
      metricsData,
      symbols: validSymbols
    })
  }

  const addSymbol = () => {
    setSymbols([...symbols, ''])
  }

  const updateSymbol = (index, value) => {
    const newSymbols = [...symbols]
    newSymbols[index] = value.toUpperCase()
    setSymbols(newSymbols)
  }

  const removeSymbol = (index) => {
    if (symbols.length > 2) {
      setSymbols(symbols.filter((_, i) => i !== index))
    }
  }

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Stock Comparison</h1>
      </div>

      {/* Comparison Controls */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Compare Stocks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Symbols
            </label>
            {symbols.map((symbol, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => updateSymbol(index, e.target.value)}
                  placeholder="e.g., AAPL"
                  className="input-field flex-1"
                />
                {symbols.length > 2 && (
                  <button
                    onClick={() => removeSymbol(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addSymbol}
              className="text-primary-600 hover:text-primary-800 text-sm font-medium"
            >
              + Add Symbol
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="input-field"
            >
              <option value="1mo">1 Month</option>
              <option value="3mo">3 Months</option>
              <option value="6mo">6 Months</option>
              <option value="1y">1 Year</option>
              <option value="2y">2 Years</option>
              <option value="5y">5 Years</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleCompare}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Loading...' : 'Compare Stocks'}
        </button>
      </Card>

      {/* Comparison Results */}
      {comparisonData && (
        <div className="space-y-6">
          {/* Price Performance Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Performance (Normalized to 100)</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={comparisonData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                {comparisonData.symbols.map((symbol, index) => (
                  <Line
                    key={symbol}
                    type="monotone"
                    dataKey={symbol}
                    stroke={colors[index % colors.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Metrics Comparison */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics Comparison</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Return
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volatility
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      P/E Ratio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sector
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(comparisonData.metricsData).map(([symbol, metrics]) => (
                    <tr key={symbol}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${metrics.currentPrice.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        metrics.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metrics.totalReturn >= 0 ? '+' : ''}{metrics.totalReturn.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {metrics.volatility.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {metrics.peRatio ? metrics.peRatio.toFixed(2) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {metrics.sector}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Returns Comparison Bar Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Returns Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={Object.entries(comparisonData.metricsData).map(([symbol, metrics]) => ({
                symbol,
                return: metrics.totalReturn
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value.toFixed(2)}%`, 'Total Return']} />
                <Bar dataKey="return" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!comparisonData && !loading && (
        <Card className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No comparison data yet</h3>
          <p className="text-gray-600 mb-4">Add stock symbols and click compare to see detailed analysis</p>
        </Card>
      )}
    </div>
  )
}

export default Compare
