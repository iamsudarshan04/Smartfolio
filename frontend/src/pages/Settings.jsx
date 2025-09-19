import React, { useState } from 'react'
import { BellIcon, ShieldCheckIcon, CogIcon } from '@heroicons/react/24/outline'
import Card from '../components/Card'
import toast from 'react-hot-toast'

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email_alerts: true,
      price_alerts: true,
      portfolio_updates: false,
      market_news: true,
      weekly_reports: true
    },
    privacy: {
      data_sharing: false,
      analytics: true,
      marketing_emails: false
    },
    trading: {
      auto_rebalancing: false,
      risk_alerts: true,
      confirmation_required: true,
      default_order_type: 'market'
    },
    display: {
      theme: 'light',
      currency: 'USD',
      date_format: 'MM/DD/YYYY',
      number_format: 'US'
    }
  })

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }))
  }

  const handleSaveSettings = () => {
    // In a real app, this would make an API call
    toast.success('Settings saved successfully!')
  }

  const handleExportData = () => {
    toast.success('Data export initiated. You will receive an email when ready.')
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.error('Account deletion initiated. Please check your email for confirmation.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <button onClick={handleSaveSettings} className="btn-primary">
          Save Changes
        </button>
      </div>

      {/* Notifications Settings */}
      <Card>
        <div className="flex items-center mb-4">
          <BellIcon className="w-6 h-6 text-gray-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Email Alerts</p>
              <p className="text-sm text-gray-600">Receive important account notifications via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.email_alerts}
                onChange={(e) => handleSettingChange('notifications', 'email_alerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Price Alerts</p>
              <p className="text-sm text-gray-600">Get notified when stocks reach target prices</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.price_alerts}
                onChange={(e) => handleSettingChange('notifications', 'price_alerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Portfolio Updates</p>
              <p className="text-sm text-gray-600">Daily portfolio performance summaries</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.portfolio_updates}
                onChange={(e) => handleSettingChange('notifications', 'portfolio_updates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Weekly Reports</p>
              <p className="text-sm text-gray-600">Comprehensive weekly portfolio reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications.weekly_reports}
                onChange={(e) => handleSettingChange('notifications', 'weekly_reports', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <div className="flex items-center mb-4">
          <ShieldCheckIcon className="w-6 h-6 text-gray-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Privacy & Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Data Sharing</p>
              <p className="text-sm text-gray-600">Allow anonymous data sharing for product improvement</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.data_sharing}
                onChange={(e) => handleSettingChange('privacy', 'data_sharing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Analytics</p>
              <p className="text-sm text-gray-600">Help us improve by sharing usage analytics</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.privacy.analytics}
                onChange={(e) => handleSettingChange('privacy', 'analytics', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Trading Settings */}
      <Card>
        <div className="flex items-center mb-4">
          <CogIcon className="w-6 h-6 text-gray-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Trading Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto Rebalancing</p>
              <p className="text-sm text-gray-600">Automatically rebalance portfolio based on target allocation</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.trading.auto_rebalancing}
                onChange={(e) => handleSettingChange('trading', 'auto_rebalancing', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Risk Alerts</p>
              <p className="text-sm text-gray-600">Get notified when portfolio risk exceeds thresholds</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.trading.risk_alerts}
                onChange={(e) => handleSettingChange('trading', 'risk_alerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Order Type
            </label>
            <select
              value={settings.trading.default_order_type}
              onChange={(e) => handleSettingChange('trading', 'default_order_type', e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="market">Market Order</option>
              <option value="limit">Limit Order</option>
              <option value="stop">Stop Order</option>
              <option value="stop_limit">Stop Limit Order</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Display Settings */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Display Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.display.theme}
              onChange={(e) => handleSettingChange('display', 'theme', e.target.value)}
              className="input-field"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={settings.display.currency}
              onChange={(e) => handleSettingChange('display', 'currency', e.target.value)}
              className="input-field"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Format
            </label>
            <select
              value={settings.display.date_format}
              onChange={(e) => handleSettingChange('display', 'date_format', e.target.value)}
              className="input-field"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number Format
            </label>
            <select
              value={settings.display.number_format}
              onChange={(e) => handleSettingChange('display', 'number_format', e.target.value)}
              className="input-field"
            >
              <option value="US">US (1,234.56)</option>
              <option value="EU">EU (1.234,56)</option>
              <option value="IN">IN (1,23,456.78)</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-600">Download all your portfolio and transaction data</p>
            </div>
            <button onClick={handleExportData} className="btn-secondary">
              Export
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 text-red-600">Delete Account</p>
              <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Settings
