import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../components/Card'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

const Forecast = () => {
  const [symbols, setSymbols] = useState(['AAPL'])
  const [days, setDays] = useState(30)
  const [modelType, setModelType] = useState('linear')
  const [predictions, setPredictions] = useState({})
  const [marketSentiment, setMarketSentiment] = useState(null)
  const [loading, setLoading] = useState(false)

  const handlePredict = async () => {
    setLoading(true)
    try {
      const response = await apiService.predictStockPrices({
        symbols: symbols.filter(s => s.trim() !== ''),
        days,
        model_type: modelType
      })

      if (response.data.success) {
        setPredictions(response.data.predictions)
        toast.success('Predictions generated successfully!')
      }
    } catch (error) {
      console.error('Error generating predictions:', error)
      toast.error('Failed to generate predictions')
    } finally {
      setLoading(false)
    }
  }

  const fetchMarketSentiment = async () => {
    try {
      const response = await apiService.getMarketSentiment()
      if (response.data.success) {
        setMarketSentiment(response.data)
      }
    } catch (error) {
      console.error('Error fetching market sentiment:', error)
      toast.error('Failed to fetch market sentiment')
    }
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
    setSymbols(symbols.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Stock Forecast</h1>
        <button onClick={fetchMarketSentiment} className="btn-secondary">
          Get Market Sentiment
        </button>
      </div>

      {/* Prediction Controls */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Predictions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                {symbols.length > 1 && (
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
              Forecast Days
            </label>
            <input
              type="number"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 30)}
              min="1"
              max="365"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Type
            </label>
            <select
              value={modelType}
              onChange={(e) => setModelType(e.target.value)}
              className="input-field"
            >
              <option value="linear">Linear Regression</option>
              <option value="random_forest">Random Forest</option>
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Generating...' : 'Generate Predictions'}
        </button>
      </Card>

      {/* Market Sentiment */}
      {marketSentiment && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Sentiment</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{marketSentiment.sentiment}</p>
              <p className="text-gray-600">Overall Market Sentiment</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(marketSentiment.indicators || {}).map(([symbol, data]) => (
                <div key={symbol} className="text-center">
                  <p className="text-sm font-medium text-gray-600">{symbol}</p>
                  <p className="text-lg font-bold">${data.current}</p>
                  <p className={`text-sm ${data.change_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.change_percent >= 0 ? '+' : ''}{data.change_percent}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Predictions Results */}
      {Object.keys(predictions).length > 0 && (
        <div className="space-y-6">
          {Object.entries(predictions).map(([symbol, data]) => (
            <Card key={symbol}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{symbol} Forecast</h3>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="text-xl font-bold">${data.current_price}</p>
                  <p className="text-sm text-gray-600">Model Score: {data.model_score}</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.predictions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Predicted Price']} />
                  <Line 
                    type="monotone" 
                    dataKey="predicted_price" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">30-Day Target</p>
                  <p className="text-lg font-bold">
                    ${data.predictions[Math.min(29, data.predictions.length - 1)]?.predicted_price || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Predicted Change</p>
                  <p className="text-lg font-bold text-green-600">+5.2%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Confidence</p>
                  <p className="text-lg font-bold">{Math.round(data.model_score * 100)}%</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {Object.keys(predictions).length === 0 && !loading && (
        <Card className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No predictions yet</h3>
          <p className="text-gray-600 mb-4">Enter stock symbols and generate predictions to see forecasts</p>
        </Card>
      )}
    </div>
  )
}

export default Forecast
