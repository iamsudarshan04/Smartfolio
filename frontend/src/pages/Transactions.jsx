import React, { useState } from 'react'
import { PlusIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import Card from '../components/Card'
import toast from 'react-hot-toast'

const Transactions = () => {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      symbol: 'AAPL',
      type: 'buy',
      quantity: 10,
      price: 150.25,
      total: 1502.50,
      fees: 2.50,
      date: '2024-01-15',
      portfolio: 'Growth Portfolio'
    },
    {
      id: 2,
      symbol: 'GOOGL',
      type: 'buy',
      quantity: 5,
      price: 2800.00,
      total: 14000.00,
      fees: 5.00,
      date: '2024-01-14',
      portfolio: 'Tech Portfolio'
    },
    {
      id: 3,
      symbol: 'MSFT',
      type: 'sell',
      quantity: 8,
      price: 380.75,
      total: 3046.00,
      fees: 3.00,
      date: '2024-01-13',
      portfolio: 'Growth Portfolio'
    }
  ])
  
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTransaction, setNewTransaction] = useState({
    symbol: '',
    type: 'buy',
    quantity: '',
    price: '',
    fees: '0',
    portfolio: 'Default Portfolio'
  })

  const handleAddTransaction = () => {
    if (!newTransaction.symbol || !newTransaction.quantity || !newTransaction.price) {
      toast.error('Please fill in all required fields')
      return
    }

    const quantity = parseFloat(newTransaction.quantity)
    const price = parseFloat(newTransaction.price)
    const fees = parseFloat(newTransaction.fees) || 0
    const total = quantity * price

    const transaction = {
      id: transactions.length + 1,
      symbol: newTransaction.symbol.toUpperCase(),
      type: newTransaction.type,
      quantity,
      price,
      total,
      fees,
      date: new Date().toISOString().split('T')[0],
      portfolio: newTransaction.portfolio
    }

    setTransactions([transaction, ...transactions])
    setNewTransaction({
      symbol: '',
      type: 'buy',
      quantity: '',
      price: '',
      fees: '0',
      portfolio: 'Default Portfolio'
    })
    setShowAddModal(false)
    toast.success('Transaction added successfully!')
  }

  const totalInvested = transactions
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum + t.total + t.fees, 0)

  const totalSold = transactions
    .filter(t => t.type === 'sell')
    .reduce((sum, t) => sum + t.total - t.fees, 0)

  const netInvestment = totalInvested - totalSold

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">${totalInvested.toLocaleString()}</p>
            </div>
            <ArrowUpIcon className="w-8 h-8 text-red-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sold</p>
              <p className="text-2xl font-bold text-gray-900">${totalSold.toLocaleString()}</p>
            </div>
            <ArrowDownIcon className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Investment</p>
              <p className="text-2xl font-bold text-gray-900">${netInvestment.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Portfolio
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.type === 'buy' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {transaction.type.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${transaction.fees.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.portfolio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add Transaction</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Symbol *
                </label>
                <input
                  type="text"
                  value={newTransaction.symbol}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    symbol: e.target.value.toUpperCase()
                  }))}
                  placeholder="e.g., AAPL"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  value={newTransaction.type}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    type: e.target.value
                  }))}
                  className="input-field"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={newTransaction.quantity}
                    onChange={(e) => setNewTransaction(prev => ({
                      ...prev,
                      quantity: e.target.value
                    }))}
                    placeholder="10"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTransaction.price}
                    onChange={(e) => setNewTransaction(prev => ({
                      ...prev,
                      price: e.target.value
                    }))}
                    placeholder="150.25"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fees ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTransaction.fees}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    fees: e.target.value
                  }))}
                  placeholder="0.00"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Portfolio
                </label>
                <select
                  value={newTransaction.portfolio}
                  onChange={(e) => setNewTransaction(prev => ({
                    ...prev,
                    portfolio: e.target.value
                  }))}
                  className="input-field"
                >
                  <option value="Default Portfolio">Default Portfolio</option>
                  <option value="Growth Portfolio">Growth Portfolio</option>
                  <option value="Tech Portfolio">Tech Portfolio</option>
                  <option value="Income Portfolio">Income Portfolio</option>
                </select>
              </div>

              {newTransaction.quantity && newTransaction.price && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Total: ${(parseFloat(newTransaction.quantity || 0) * parseFloat(newTransaction.price || 0)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="btn-primary flex-1"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Transactions
