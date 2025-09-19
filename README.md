# Smartfolio - Portfolio Management System

A comprehensive portfolio management application built with FastAPI backend and React frontend, featuring portfolio optimization, risk analysis, stock forecasting, and AI-powered investment assistance.

## Features

### Backend (FastAPI)
- **Portfolio Management**: Create, optimize, and track investment portfolios
- **Risk Analysis**: Calculate VaR, CVaR, Sharpe ratio, beta, alpha, and other risk metrics
- **Stock Data Integration**: Real-time stock data via Yahoo Finance API
- **Forecasting**: Machine learning-based stock price predictions
- **Authentication**: JWT-based user authentication and authorization
- **RESTful API**: Comprehensive API endpoints for all functionality

### Frontend (React)
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Interactive Charts**: Portfolio performance and comparison visualizations
- **Real-time Data**: Live market data and portfolio updates
- **AI Assistant**: Investment advice and portfolio analysis chatbot
- **Multi-page Application**: Dashboard, Portfolio, Forecast, Compare, and more
- **User Management**: Profile management and settings

## Project Structure

```
project-root/
├── backend/                  # Python backend (FastAPI)
│   ├── app.py                # Main server
│   ├── requirements.txt      # Dependencies
│   ├── models/               # Data models and schemas
│   │   ├── __init__.py
│   │   └── portfolio_model.py
│   ├── data/                 # Stock data storage
│   │   └── .gitkeep
│   ├── routes/               # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py           # Authentication routes
│   │   ├── data.py           # Stock data routes
│   │   ├── forecast.py       # Prediction routes
│   │   └── portfolio.py      # Portfolio management routes
│   └── utils/                # Helper functions
│       ├── __init__.py
│       ├── portfolio_optimizer.py  # Portfolio optimization algorithms
│       └── risk_calculator.py      # Risk analysis functions
│
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── main.jsx          # Application entry point
│   │   ├── App.jsx           # Main app component
│   │   ├── index.css         # Global styles
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Card.jsx
│   │   ├── pages/            # Route pages
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── Portfolio.jsx     # Portfolio management
│   │   │   ├── Forecast.jsx      # Stock predictions
│   │   │   ├── Compare.jsx       # Stock comparison
│   │   │   ├── Assistant.jsx     # AI assistant
│   │   │   ├── Auth.jsx          # Login/Register
│   │   │   ├── Profile.jsx       # User profile
│   │   │   ├── Transactions.jsx  # Transaction history
│   │   │   └── Settings.jsx      # App settings
│   │   └── services/         # API integration
│   │       └── api.js
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Python**: Core programming language
- **Pandas & NumPy**: Data manipulation and analysis
- **Scikit-learn**: Machine learning for predictions
- **yfinance**: Yahoo Finance API for stock data
- **Pydantic**: Data validation and serialization
- **JWT**: Authentication and authorization
- **Uvicorn**: ASGI server

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Chart library for data visualization
- **Axios**: HTTP client for API calls
- **React Hot Toast**: Toast notifications
- **Heroicons**: Beautiful SVG icons

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
python app.py
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Portfolio Management
- `GET /api/portfolio` - Get user portfolios
- `POST /api/portfolio/create` - Create new portfolio
- `POST /api/portfolio/optimize` - Optimize portfolio allocation
- `GET /api/portfolio/{id}/performance` - Get portfolio performance

### Stock Data
- `GET /api/data/stocks/{symbol}` - Get stock data for symbol
- `POST /api/data/stocks/batch` - Get batch stock data
- `GET /api/data/market/indices` - Get market indices
- `GET /api/data/search/{query}` - Search stocks

### Forecasting
- `POST /api/forecast/predict` - Predict stock prices
- `GET /api/forecast/market-sentiment` - Get market sentiment

## Key Features Explained

### Portfolio Optimization
Uses Modern Portfolio Theory (MPT) to optimize asset allocation based on:
- Risk tolerance (Conservative, Moderate, Aggressive)
- Expected returns and volatility
- Correlation between assets
- Sharpe ratio maximization

### Risk Analysis
Comprehensive risk metrics including:
- **Value at Risk (VaR)**: Potential loss at given confidence level
- **Conditional VaR (CVaR)**: Expected loss beyond VaR
- **Beta**: Sensitivity to market movements
- **Alpha**: Excess return over market
- **Sharpe Ratio**: Risk-adjusted return
- **Maximum Drawdown**: Largest peak-to-trough decline

### Stock Forecasting
Machine learning models for price prediction:
- Linear Regression for trend analysis
- Random Forest for complex pattern recognition
- Technical indicators (Moving averages, volatility)
- Model confidence scoring

### AI Assistant
Intelligent chatbot providing:
- Investment advice and strategies
- Portfolio analysis and recommendations
- Market insights and trends
- Risk management guidance

## Development

### Adding New Features

1. **Backend**: Add new routes in the `routes/` directory
2. **Frontend**: Create new pages in `pages/` or components in `components/`
3. **API Integration**: Update `services/api.js` with new endpoints

### Code Style
- Backend: Follow PEP 8 Python style guide
- Frontend: Use ESLint and Prettier for consistent formatting
- Use meaningful variable names and add comments for complex logic

## Deployment

### Backend Deployment
- Use Docker for containerization
- Deploy to cloud platforms (AWS, GCP, Azure)
- Set up environment variables for production
- Use PostgreSQL or MySQL for production database

### Frontend Deployment
- Build for production: `npm run build`
- Deploy to Netlify, Vercel, or similar platforms
- Configure environment variables for API endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue on the GitHub repository.
