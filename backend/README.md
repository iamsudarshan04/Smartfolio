# Smartfolio Backend

A comprehensive portfolio management and optimization system built with Flask, featuring machine learning-based portfolio allocation, risk analysis, and stock forecasting capabilities.

---

## 📁 Project Structure

```
backend/
├── app.py                              # Main Flask application entry point
├── requirements.txt                    # Python dependencies
├── package.json                        # Node.js dependencies (if any)
├── enhanced_portfolio_model.py         # ML model class definition
├── enhanced_portfolio_model.pkl        # Trained ML model (generated)
├── train_enhanced_model.py             # Script to train the ML model
├── check_models.py                     # Diagnostic script for model files
│
├── models/                             # Data models and schemas
│   ├── __init__.py
│   └── portfolio_model.py              # Pydantic models for portfolios
│
├── routes/                             # API route handlers
│   ├── __init__.py
│   ├── auth.py                         # Authentication endpoints
│   ├── portfolio.py                    # Portfolio management endpoints
│   ├── forecast.py                     # Stock price prediction endpoints
│   └── data.py                         # Stock data retrieval endpoints
│
├── utils/                              # Utility modules
│   ├── __init__.py
│   ├── portfolio_optimizer.py          # Portfolio optimization algorithms
│   └── risk_calculator.py              # Risk metrics calculations
│
├── data/                               # Data storage directory
│   └── .gitkeep
│
├── venv/                               # Python virtual environment
└── __pycache__/                        # Python cache files
```

---

## 📄 File Descriptions

### Core Application Files

#### **`app.py`**
Main Flask application that serves as the entry point for the backend server.

**Key Features:**
- Initializes Flask app with CORS enabled
- Loads ML models (basic and enhanced portfolio models)
- Defines API endpoints for portfolio operations
- Handles stock data fetching via yfinance
- Implements portfolio optimization using pypfopt
- Provides risk analysis and performance metrics

**Main Endpoints:**
- `/api/optimize` - Portfolio optimization
- `/api/predict` - Stock price predictions
- `/api/stocks/<symbol>` - Stock data retrieval
- `/api/risk-analysis` - Risk metrics calculation

---

#### **`enhanced_portfolio_model.py`**
Advanced machine learning model for portfolio allocation.

**Features:**
- 171 technical and fundamental features
- Multi-scenario market condition handling (bull, bear, normal, volatile)
- RandomForest-based weight prediction
- Real-time portfolio optimization
- Comprehensive risk-return analysis

**Supported Tickers:**
- RELIANCE.NS, INFY.NS, TCS.NS, HDFCBANK.NS, ICICIBANK.NS
- SBIN.NS, LT.NS, KOTAKBANK.NS, BHARTIARTL.NS

**Methods:**
- `train_model()` - Train the ML model
- `predict_portfolio()` - Predict optimal portfolio weights
- `calculate_portfolio_metrics()` - Calculate performance metrics
- `save_model()` / `load_model()` - Model persistence

---

#### **`train_enhanced_model.py`**
Training script for the enhanced portfolio model.

**Purpose:**
- Trains the EnhancedPortfolioModel with 500 samples
- Evaluates model performance (R², MAE, MSE)
- Saves trained model to `enhanced_portfolio_model.pkl`
- Runs test predictions to verify functionality

**Usage:**
```bash
python train_enhanced_model.py
```

---

#### **`check_models.py`**
Diagnostic utility to verify model files.

**Purpose:**
- Checks existence of model files
- Displays file sizes and metadata
- Attempts to load models to verify integrity
- Provides recommendations if models are missing

**Usage:**
```bash
python check_models.py
```

---

### Models Directory (`models/`)

#### **`portfolio_model.py`**
Pydantic data models for type validation and serialization.

**Models Defined:**
- **`Stock`** - Individual stock information
  - symbol, name, sector, current_price, quantity, weight, value

- **`Portfolio`** - Portfolio container
  - id, name, description, total_value, cash_balance, stocks
  - created_at, updated_at, risk_level

- **`PortfolioPerformance`** - Performance metrics
  - total_return, daily_return, volatility, sharpe_ratio
  - max_drawdown, beta, alpha

- **`Transaction`** - Transaction records
  - id, portfolio_id, symbol, transaction_type, quantity
  - price, total_amount, fees, timestamp

---

### Routes Directory (`routes/`)

#### **`auth.py`**
Authentication and authorization endpoints (FastAPI-based).

**Features:**
- User registration and login
- JWT token generation and validation
- Password hashing with bcrypt
- HTTP Bearer authentication

**Endpoints:**
- `POST /register` - Create new user account
- `POST /login` - Authenticate user and return token

**Security:**
- Uses JWT with HS256 algorithm
- 30-minute token expiration
- Bcrypt password hashing

---

#### **`portfolio.py`**
Portfolio management and optimization endpoints.

**Features:**
- Create and manage portfolios
- Optimize portfolio weights based on risk tolerance
- Integration with PortfolioOptimizer and RiskCalculator

**Endpoints:**
- `GET /` - Get all user portfolios
- `POST /create` - Create new portfolio
- `POST /optimize` - Optimize portfolio allocation

**Request Models:**
- `PortfolioRequest` - symbols, weights, investment_amount
- `OptimizationRequest` - symbols, risk_tolerance, investment_amount

---

#### **`forecast.py`**
Stock price prediction and forecasting endpoints.

**Features:**
- Linear regression and Random Forest models
- Multi-day price predictions
- Historical data analysis
- Technical indicator integration

**Endpoints:**
- `POST /predict` - Predict future stock prices

**Models Supported:**
- Linear Regression (default)
- Random Forest Regressor

**Parameters:**
- symbols: List of stock symbols
- days: Prediction horizon (default: 30 days)
- model_type: "linear" or "random_forest"

---

#### **`data.py`**
Stock market data retrieval endpoints.

**Features:**
- Real-time stock data from Yahoo Finance
- Historical price data
- Stock information and metadata
- Batch data retrieval

**Endpoints:**
- `GET /stocks/{symbol}` - Get single stock data
- `POST /stocks/batch` - Get multiple stocks data

**Supported Periods:**
- 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max

---

### Utils Directory (`utils/`)

#### **`portfolio_optimizer.py`**
Portfolio optimization algorithms and calculations.

**Key Features:**
- Mean-variance optimization
- Efficient frontier calculation
- Sharpe ratio maximization
- Risk-adjusted return optimization
- Monte Carlo simulation

**Methods:**
- `get_stock_data()` - Fetch historical data
- `calculate_returns()` - Calculate daily returns
- `calculate_portfolio_stats()` - Portfolio metrics
- `optimize_portfolio()` - Find optimal weights
- `efficient_frontier()` - Generate efficient frontier
- `create_portfolio()` - Create optimized portfolio

**Optimization Strategies:**
- Maximum Sharpe Ratio
- Minimum Volatility
- Risk-parity allocation
- Custom risk tolerance levels

---

#### **`risk_calculator.py`**
Risk metrics and analysis calculations.

**Key Features:**
- Value at Risk (VaR)
- Conditional Value at Risk (CVaR)
- Maximum Drawdown
- Beta and Alpha calculations
- Sharpe Ratio
- Sortino Ratio

**Methods:**
- `calculate_var()` - Value at Risk
- `calculate_cvar()` - Conditional VaR
- `calculate_max_drawdown()` - Maximum drawdown
- `calculate_beta()` - Beta coefficient
- `calculate_alpha()` - Alpha coefficient
- `calculate_sharpe_ratio()` - Sharpe ratio
- `calculate_sortino_ratio()` - Sortino ratio

**Benchmark:**
- Uses S&P 500 (^GSPC) as market benchmark
- Risk-free rate: 2%

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip package manager

### Installation

1. **Create virtual environment:**
```bash
python -m venv venv
```

2. **Activate virtual environment:**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Train the ML model:**
```bash
python train_enhanced_model.py
```

5. **Verify models:**
```bash
python check_models.py
```

6. **Run the application:**
```bash
python app.py
```

The server will start on `http://localhost:5000`

---

## 📦 Key Dependencies

### Core Frameworks
- **Flask** (3.1.2) - Web framework
- **flask-cors** (6.0.1) - CORS support

### Data & Analysis
- **pandas** (2.3.2) - Data manipulation
- **numpy** (2.3.3) - Numerical computing
- **yfinance** (0.2.65) - Stock data retrieval

### Machine Learning
- **scikit-learn** (1.7.2) - ML algorithms
- **tensorflow** (2.20.0) - Deep learning
- **keras** (3.11.3) - Neural networks

### Portfolio Optimization
- **pyportfolioopt** (1.5.6) - Portfolio optimization
- **cvxpy** (1.7.2) - Convex optimization
- **scipy** (1.16.2) - Scientific computing

### Visualization
- **plotly** (5.24.1) - Interactive charts

### Utilities
- **joblib** (1.5.2) - Model serialization
- **requests** (2.32.5) - HTTP requests

---

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=your-database-url
JWT_SECRET_KEY=your-jwt-secret
```

### Model Configuration
- **Risk-free rate:** 6% (Indian market)
- **Market benchmark:** S&P 500 (^GSPC)
- **Default investment:** ₹10,000
- **Token expiration:** 30 minutes

---

## 📊 API Usage Examples

### Optimize Portfolio
```python
POST /api/optimize
{
  "symbols": ["RELIANCE.NS", "INFY.NS", "TCS.NS"],
  "risk_tolerance": "moderate",
  "investment_amount": 100000
}
```

### Get Stock Data
```python
GET /api/stocks/RELIANCE.NS?period=1y
```

### Predict Prices
```python
POST /api/predict
{
  "symbols": ["INFY.NS", "TCS.NS"],
  "days": 30,
  "model_type": "random_forest"
}
```

---

## 🧪 Testing

Run diagnostics:
```bash
python check_models.py
```

Test model training:
```bash
python train_enhanced_model.py
```

---

## 📝 Notes

- The enhanced model supports 9 major Indian NSE stocks
- Model training requires historical data download (may take time)
- Ensure stable internet connection for yfinance data retrieval
- Models are saved as `.pkl` files and loaded at startup
- CORS is enabled for all origins (configure for production)

---

## 🔒 Security Considerations

- Change `SECRET_KEY` in production
- Use environment variables for sensitive data
- Implement rate limiting for API endpoints
- Add input validation and sanitization
- Use HTTPS in production
- Implement proper authentication middleware

---

## 🐛 Troubleshooting

### Model Not Found
```bash
python train_enhanced_model.py
```

### Import Errors
```bash
pip install -r requirements.txt --upgrade
```

### Data Fetch Errors
- Check internet connection
- Verify stock symbols are valid
- Try different time periods

---

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [yfinance Documentation](https://pypi.org/project/yfinance/)
- [PyPortfolioOpt Documentation](https://pyportfolioopt.readthedocs.io/)
- [scikit-learn Documentation](https://scikit-learn.org/)

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## 📄 License

This project is part of the Smartfolio application.

---

**Last Updated:** October 2025
