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
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Popular stock tickers - Indian and US markets
  const POPULAR_TICKERS = [
    // Indian Stocks (NSE)
    { ticker: "TCS.NS", name: "Tata Consultancy Services" },
    { ticker: "INFY.NS", name: "Infosys" },
    { ticker: "RELIANCE.NS", name: "Reliance Industries" },
    { ticker: "HDFCBANK.NS", name: "HDFC Bank" },
    { ticker: "ICICIBANK.NS", name: "ICICI Bank" },
    { ticker: "SBIN.NS", name: "State Bank of India" },
    { ticker: "WIPRO.NS", name: "Wipro" },
    { ticker: "BHARTIARTL.NS", name: "Bharti Airtel" },
    { ticker: "ITC.NS", name: "ITC Limited" },
    { ticker: "KOTAKBANK.NS", name: "Kotak Mahindra Bank" },
    { ticker: "LT.NS", name: "Larsen & Toubro" },
    { ticker: "AXISBANK.NS", name: "Axis Bank" },
    { ticker: "HINDUNILVR.NS", name: "Hindustan Unilever" },
    { ticker: "MARUTI.NS", name: "Maruti Suzuki" },
    { ticker: "BAJFINANCE.NS", name: "Bajaj Finance" },
    { ticker: "ASIANPAINT.NS", name: "Asian Paints" },
    { ticker: "TITAN.NS", name: "Titan Company" },
    { ticker: "SUNPHARMA.NS", name: "Sun Pharmaceutical" },
    { ticker: "TATAMOTORS.NS", name: "Tata Motors" },
    { ticker: "TATASTEEL.NS", name: "Tata Steel" },
    { ticker: "ADANIPORTS.NS", name: "Adani Ports" },
    { ticker: "POWERGRID.NS", name: "Power Grid Corporation" },
    { ticker: "NTPC.NS", name: "NTPC Limited" },
    { ticker: "ONGC.NS", name: "Oil and Natural Gas Corporation" },
    { ticker: "TECHM.NS", name: "Tech Mahindra" },
    { ticker: "HCLTECH.NS", name: "HCL Technologies" },
    { ticker: "ULTRACEMCO.NS", name: "UltraTech Cement" },
    { ticker: "DRREDDY.NS", name: "Dr. Reddy's Laboratories" },
    { ticker: "CIPLA.NS", name: "Cipla" },
    { ticker: "DIVISLAB.NS", name: "Divi's Laboratories" },
    
    // US Stocks
    { ticker: "AAPL", name: "Apple Inc." },
    { ticker: "MSFT", name: "Microsoft Corporation" },
    { ticker: "GOOGL", name: "Alphabet Inc." },
    { ticker: "AMZN", name: "Amazon.com Inc." },
    { ticker: "TSLA", name: "Tesla Inc." },
    { ticker: "META", name: "Meta Platforms Inc." },
    { ticker: "NVDA", name: "NVIDIA Corporation" },
    { ticker: "JPM", name: "JPMorgan Chase & Co." },
    { ticker: "V", name: "Visa Inc." },
    { ticker: "JNJ", name: "Johnson & Johnson" },
    { ticker: "WMT", name: "Walmart Inc." },
    { ticker: "PG", name: "Procter & Gamble" },
    { ticker: "MA", name: "Mastercard Inc." },
    { ticker: "DIS", name: "The Walt Disney Company" },
    { ticker: "NFLX", name: "Netflix Inc." },
    { ticker: "PYPL", name: "PayPal Holdings Inc." },
    { ticker: "INTC", name: "Intel Corporation" },
    { ticker: "AMD", name: "Advanced Micro Devices" },
    { ticker: "CSCO", name: "Cisco Systems Inc." },
    { ticker: "PFE", name: "Pfizer Inc." },
    { ticker: "KO", name: "The Coca-Cola Company" },
    { ticker: "PEP", name: "PepsiCo Inc." },
    { ticker: "NKE", name: "Nike Inc." },
    { ticker: "ADBE", name: "Adobe Inc." },
    { ticker: "CRM", name: "Salesforce Inc." },
    { ticker: "ORCL", name: "Oracle Corporation" },
    { ticker: "IBM", name: "IBM" },
    { ticker: "BA", name: "Boeing Company" },
    { ticker: "GE", name: "General Electric" },
    { ticker: "F", name: "Ford Motor Company" },
  ];

  // Filter suggestions based on input
  const filteredSuggestions = POPULAR_TICKERS.filter(
    (stock) =>
      stock.ticker.toLowerCase().includes(newTicker.toLowerCase()) ||
      stock.name.toLowerCase().includes(newTicker.toLowerCase())
  ).slice(0, 10);

  // Colors for pie chart
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
    '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
  ];

  // Add a stock to the list
  const addStock = (ticker = null) => {
    const tickerToAdd = ticker || newTicker;
    if (!tickerToAdd) return;

    if (stocks.length >= 10) {
      setError("You can only add up to 10 stocks.");
      return;
    }

    // Check if stock already exists
    if (stocks.some(s => s.ticker.toUpperCase() === tickerToAdd.toUpperCase())) {
      setError("This stock is already in your portfolio.");
      return;
    }

    setStocks([
      ...stocks,
      { ticker: tickerToAdd.toUpperCase() },
    ]);
    setNewTicker("");
    setShowSuggestions(false);
    setError("");
  };

  // Handle input change
  const handleInputChange = (e) => {
    setNewTicker(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  // Handle key press for Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addStock();
    }
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

      {/* Stock Input Form with Autocomplete */}
      <div className="mb-6">
        <div className="flex gap-2 relative">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search stock ticker or company name..."
              value={newTicker}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowSuggestions(newTicker.length > 0)}
              className="w-full border rounded-lg px-3 py-2"
            />
            
            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredSuggestions.map((stock, index) => (
                  <div
                    key={index}
                    onClick={() => addStock(stock.ticker)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="font-semibold text-gray-800">{stock.ticker}</div>
                    <div className="text-sm text-gray-600">{stock.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => addStock()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            ➕ Add Stock
          </button>
        </div>
        
        {/* Popular Stocks Quick Add */}
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">💡 Popular Stocks:</p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TICKERS.slice(0, 8).map((stock) => (
              <button
                key={stock.ticker}
                onClick={() => addStock(stock.ticker)}
                className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-700 px-3 py-1 rounded-full border hover:border-blue-400 transition"
                disabled={stocks.some(s => s.ticker === stock.ticker)}
              >
                {stock.ticker}
              </button>
            ))}
          </div>
        </div>
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

          {/* Model Info Badge */}
          {result.model_used && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-purple-700">
                    🤖 Model: {result.model_used === 'enhanced' ? '✨ Enhanced ML Model (171 features)' : '📊 Basic Random Forest'}
                  </span>
                  {result.return_method && (
                    <span className="text-xs text-purple-600 ml-2">
                      | Returns: {result.return_method}
                    </span>
                  )}
                </div>
                {result.model_used === 'enhanced' && (
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">ADVANCED</span>
                )}
              </div>
            </div>
          )}

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
                    {result.stock_expected_returns && (
                      <div className="flex justify-between border-b pb-1 mb-1">
                        <span className="font-semibold text-blue-700">Expected Return:</span>
                        <span className="font-bold text-blue-800">{(result.stock_expected_returns[ticker] * 100).toFixed(2)}%</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Historical Return:</span>
                      <span className="font-medium">{(stats.annual_return * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Volatility:</span>
                      <span className="font-medium">{(stats.annual_volatility * 100).toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sharpe Ratio:</span>
                      <span className="font-medium">{stats.sharpe_ratio.toFixed(2)}</span>
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
