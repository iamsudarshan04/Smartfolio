import React, { useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

function Portfolio() {
  const [stocks, setStocks] = useState([]);
  const [newTicker, setNewTicker] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Colors for pie chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
  ];

  // Add a stock to the list
  const addStock = () => {
    if (!newTicker) return;

    if (stocks.length >= 10) {
      setError("You can only add up to 10 stocks.");
      return;
    }

    setStocks([
      ...stocks,
      { ticker: newTicker.toUpperCase() },
    ]);
    setNewTicker("");
    setError("");
  };

  // Remove stock from list
  const removeStock = (index) => {
    setStocks(stocks.filter((_, i) => i !== index));
  };

  // Optimize portfolio
  const optimizePortfolio = async () => {
    if (stocks.length === 0) {
      setError("Add at least one stock.");
      return;
    }
    if (!totalAmount || parseFloat(totalAmount) <= 0) {
      setError("Please enter a valid total amount to invest.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    // Create stocks array with equal amounts for optimization
    const stocksWithAmounts = stocks.map(stock => ({
      ticker: stock.ticker,
      amount: parseFloat(totalAmount) / stocks.length
    }));

    try {
      const response = await axios.post("http://127.0.0.1:8000/optimize", {
        stocks: stocksWithAmounts,
      });
      setResult(response.data);
    } catch (err) {
      console.error("Error optimizing portfolio:", err);
      setError(
        err.response?.data?.error || "Failed to optimize portfolio."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        📊 Smart Portfolio Optimizer
      </h2>

      {/* Error Message */}
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

      {/* Total Amount Input */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          💰 Total Amount to Invest
        </label>
        <input
          type="number"
          placeholder="Enter total amount (e.g. 100000)"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-lg"
        />
        <p className="text-sm text-gray-600 mt-1">
          This amount will be optimally allocated across your selected stocks
        </p>
      </div>

      {/* Stock Input Form */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Stock Ticker (e.g. TCS.NS, INFY.NS)"
          value={newTicker}
          onChange={(e) => setNewTicker(e.target.value)}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          onClick={addStock}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          ➕ Add Stock
        </button>
      </div>

      {/* Stocks List */}
      <div className="space-y-3 mb-6">
        {stocks.map((s, i) => (
          <div
            key={i}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
          >
            <div>
              <span className="font-semibold">{s.ticker}</span>
            </div>
            <button
              onClick={() => removeStock(i)}
              className="text-red-500 hover:text-red-700"
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      {/* Portfolio Summary */}
      {stocks.length > 0 && totalAmount && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg border">
          <h3 className="font-medium text-gray-700 mb-2">📋 Portfolio Summary</h3>
          <p><strong>Total Investment:</strong> ₹{parseFloat(totalAmount).toLocaleString()}</p>
          <p><strong>Selected Stocks:</strong> {stocks.length}/10</p>
          <p><strong>Stocks:</strong> {stocks.map(s => s.ticker).join(", ")}</p>
        </div>
      )}

      {/* Optimize Button */}
      <button
        onClick={optimizePortfolio}
        disabled={loading || stocks.length === 0 || !totalAmount}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50"
      >
        {loading ? "🔄 Optimizing..." : "🚀 Optimize Portfolio & Get Allocation"}
      </button>

      {/* Results */}
      {result && result.weights && (
        <div className="mt-8 space-y-8">
          <h3 className="text-2xl font-semibold text-gray-800">📈 Portfolio Results</h3>

          {/* Portfolio Allocation Pie Chart */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h4 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              🥧 Portfolio Allocation
            </h4>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Pie Chart */}
              <div className="w-full lg:w-1/2 h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(result.weights).map(([ticker, weight], index) => ({
                        name: ticker,
                        value: (weight * 100),
                        amount: result.allocation[ticker],
                        fill: COLORS[index % COLORS.length]
                      }))}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(result.weights).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value.toFixed(2)}% (₹${props.payload.amount.toLocaleString()})`,
                        name
                      ]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Allocation Details */}
              <div className="w-full lg:w-1/2">
                <h5 className="font-semibold text-gray-700 mb-3">💰 Investment Breakdown</h5>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {Object.entries(result.weights).map(([ticker, weight], index) => (
                    <div key={ticker} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium">{ticker}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{(weight * 100).toFixed(2)}%</div>
                        <div className="text-sm text-gray-600">₹{result.allocation[ticker].toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border">
              <h5 className="font-semibold text-blue-700">📊 Expected Return</h5>
              <p className="text-2xl font-bold text-blue-800">{(result.expected_return * 100).toFixed(2)}%</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg border">
              <h5 className="font-semibold text-orange-700">⚡ Volatility</h5>
              <p className="text-2xl font-bold text-orange-800">{(result.volatility * 100).toFixed(2)}%</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border">
              <h5 className="font-semibold text-green-700">🎯 Sharpe Ratio</h5>
              <p className="text-2xl font-bold text-green-800">{result.sharpe_ratio.toFixed(2)}</p>
            </div>
          </div>

          {/* Individual Stock Analysis */}
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h4 className="text-xl font-semibold text-gray-700 mb-4">📋 Individual Stock Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(result.per_stock_stats).map(([ticker, stats]) => (
                <div key={ticker} className="bg-white p-4 rounded-lg border">
                  <h5 className="font-bold text-lg mb-2">{ticker}</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Annual Return:</span>
                      <span className="font-medium">{(stats.annual_return * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volatility:</span>
                      <span className="font-medium">{(stats.annual_volatility * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Drawdown:</span>
                      <span className="font-medium text-red-600">{(stats.max_drawdown * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VaR (95%):</span>
                      <span className="font-medium">{(stats.var_95 * 100).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
