import React, { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import Card from '../components/Card'

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your portfolio assistant. I can help you with investment advice, portfolio analysis, and market insights. What would you like to know?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: generateResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateResponse = (message) => {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('portfolio') && lowerMessage.includes('diversif')) {
      return 'Portfolio diversification is crucial for risk management. I recommend spreading your investments across different asset classes, sectors, and geographic regions. A typical balanced portfolio might include 60% stocks, 30% bonds, and 10% alternative investments. Would you like me to analyze your current portfolio allocation?'
    }
    
    if (lowerMessage.includes('risk')) {
      return 'Risk management is fundamental to successful investing. Consider your risk tolerance, investment timeline, and financial goals. I can help you calculate your portfolio\'s beta, volatility, and Value at Risk (VaR). Would you like me to perform a risk analysis on any specific stocks or your entire portfolio?'
    }
    
    if (lowerMessage.includes('market') || lowerMessage.includes('trend')) {
      return 'Current market conditions show mixed signals. Tech stocks have been volatile, while defensive sectors like utilities and consumer staples have shown stability. I recommend monitoring key indicators like the VIX, yield curve, and sector rotation patterns. Would you like me to provide a detailed market analysis?'
    }
    
    if (lowerMessage.includes('buy') || lowerMessage.includes('sell')) {
      return 'Investment decisions should be based on thorough analysis. Consider factors like company fundamentals, technical indicators, market conditions, and your portfolio allocation. I can help you analyze specific stocks or suggest rebalancing strategies. What specific investment are you considering?'
    }
    
    return 'That\'s an interesting question! I can help you with portfolio optimization, risk analysis, market insights, and investment strategies. Could you provide more specific details about what you\'d like to explore?'
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">AI Assistant</h1>
      </div>

      <Card className="h-96 flex flex-col">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex space-x-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your portfolio, market trends, or investment strategies..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows="2"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="btn-primary px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setInputMessage('How should I diversify my portfolio?')}>
          <h3 className="font-semibold text-gray-900 mb-2">Portfolio Diversification</h3>
          <p className="text-sm text-gray-600">Get advice on how to properly diversify your investments</p>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setInputMessage('What are the current market trends?')}>
          <h3 className="font-semibold text-gray-900 mb-2">Market Analysis</h3>
          <p className="text-sm text-gray-600">Understand current market conditions and trends</p>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setInputMessage('How do I manage investment risk?')}>
          <h3 className="font-semibold text-gray-900 mb-2">Risk Management</h3>
          <p className="text-sm text-gray-600">Learn about managing and calculating investment risks</p>
        </Card>
      </div>
    </div>
  )
}

export default Assistant
