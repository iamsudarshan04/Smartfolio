import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/auth'
    }
    return Promise.reject(error)
  }
)

export const apiService = {
  // Auth endpoints
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),

  // Portfolio endpoints
  getPortfolios: () => api.get('/portfolio'),
  createPortfolio: (portfolioData) => api.post('/portfolio/create', portfolioData),
  optimizePortfolio: (optimizationData) => api.post('/portfolio/optimize', optimizationData),
  getPortfolioPerformance: (portfolioId) => api.get(`/portfolio/${portfolioId}/performance`),

  // Data endpoints
  getStockData: (symbol, period = '1y') => api.get(`/data/stocks/${symbol}?period=${period}`),
  getBatchStockData: (symbols, period = '1y') => api.post('/data/stocks/batch', { symbols, period }),
  getMarketIndices: () => api.get('/data/market/indices'),
  searchStocks: (query) => api.get(`/data/search/${query}`),

  // Forecast endpoints
  predictStockPrices: (forecastData) => api.post('/forecast/predict', forecastData),
  getMarketSentiment: () => api.get('/forecast/market-sentiment'),
}

export default api
