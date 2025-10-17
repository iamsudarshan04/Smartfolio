# Smartfolio Backend - Directory Structure

## 📂 Complete File Tree

```
backend/
│
├── 📄 app.py                                    # Flask application entry point
├── 📄 requirements.txt                          # Python dependencies
├── 📄 package.json                              # Node.js dependencies
├── 📄 package-lock.json                         # Node.js lock file
│
├── 🤖 ML Models
│   ├── enhanced_portfolio_model.py              # ML model class (171 features)
│   ├── enhanced_portfolio_model.pkl             # Trained model file (~2MB)
│   ├── train_enhanced_model.py                  # Model training script
│   └── check_models.py                          # Model diagnostic tool
│
├── 📁 models/                                   # Data Models & Schemas
│   ├── __init__.py
│   └── portfolio_model.py                       # Pydantic models
│       ├── Stock                                # Stock data model
│       ├── Portfolio                            # Portfolio container
│       ├── PortfolioPerformance                 # Performance metrics
│       └── Transaction                          # Transaction records
│
├── 📁 routes/                                   # API Endpoints
│   ├── __init__.py
│   ├── auth.py                                  # Authentication (JWT)
│   │   ├── POST /register                       # User registration
│   │   └── POST /login                          # User login
│   │
│   ├── portfolio.py                             # Portfolio Management
│   │   ├── GET /                                # List portfolios
│   │   ├── POST /create                         # Create portfolio
│   │   └── POST /optimize                       # Optimize allocation
│   │
│   ├── forecast.py                              # Price Predictions
│   │   └── POST /predict                        # Predict stock prices
│   │       ├── Linear Regression
│   │       └── Random Forest
│   │
│   └── data.py                                  # Stock Data Retrieval
│       ├── GET /stocks/{symbol}                 # Single stock data
│       └── POST /stocks/batch                   # Multiple stocks data
│
├── 📁 utils/                                    # Utility Modules
│   ├── __init__.py
│   ├── portfolio_optimizer.py                   # Optimization Algorithms
│   │   ├── Mean-Variance Optimization
│   │   ├── Efficient Frontier
│   │   ├── Sharpe Ratio Maximization
│   │   └── Monte Carlo Simulation
│   │
│   └── risk_calculator.py                       # Risk Metrics
│       ├── Value at Risk (VaR)
│       ├── Conditional VaR (CVaR)
│       ├── Maximum Drawdown
│       ├── Beta & Alpha
│       ├── Sharpe Ratio
│       └── Sortino Ratio
│
├── 📁 data/                                     # Data Storage
│   └── .gitkeep
│
├── 📁 venv/                                     # Virtual Environment
├── 📁 node_modules/                             # Node Dependencies
└── 📁 __pycache__/                              # Python Cache
```

---

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT REQUEST                          │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                          app.py (Flask)                         │
│  • CORS Configuration                                           │
│  • Route Registration                                           │
│  • Model Loading                                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│   Route Handlers         │  │   ML Models              │
│  • auth.py               │  │  • enhanced_portfolio    │
│  • portfolio.py          │  │    _model.pkl            │
│  • forecast.py           │  │  • RandomForest          │
│  • data.py               │  │  • 171 Features          │
└──────────────────────────┘  └──────────────────────────┘
           ↓                              ↓
┌──────────────────────────┐  ┌──────────────────────────┐
│   Utility Modules        │  │   External APIs          │
│  • portfolio_optimizer   │  │  • Yahoo Finance         │
│  • risk_calculator       │  │  • Market Data           │
└──────────────────────────┘  └──────────────────────────┘
           ↓                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      Data Models (Pydantic)                     │
│  • Stock • Portfolio • Performance • Transaction                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         JSON RESPONSE                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Module Responsibilities

### **Core Layer**
| File | Responsibility | Dependencies |
|------|---------------|--------------|
| `app.py` | Main application, routing, CORS | Flask, yfinance, pypfopt |
| `requirements.txt` | Dependency management | - |

### **Model Layer**
| File | Responsibility | Dependencies |
|------|---------------|--------------|
| `enhanced_portfolio_model.py` | ML model definition | sklearn, pandas, numpy |
| `enhanced_portfolio_model.pkl` | Trained model weights | - |
| `train_enhanced_model.py` | Model training pipeline | enhanced_portfolio_model |
| `check_models.py` | Model verification | joblib |

### **Data Models Layer**
| File | Responsibility | Dependencies |
|------|---------------|--------------|
| `models/portfolio_model.py` | Type definitions, validation | Pydantic |

### **API Layer**
| File | Responsibility | Dependencies |
|------|---------------|--------------|
| `routes/auth.py` | Authentication, JWT | FastAPI, JWT, bcrypt |
| `routes/portfolio.py` | Portfolio CRUD, optimization | utils/* |
| `routes/forecast.py` | Price predictions | sklearn, yfinance |
| `routes/data.py` | Stock data retrieval | yfinance |

### **Business Logic Layer**
| File | Responsibility | Dependencies |
|------|---------------|--------------|
| `utils/portfolio_optimizer.py` | Optimization algorithms | scipy, pypfopt |
| `utils/risk_calculator.py` | Risk metrics calculation | numpy, pandas |

---

## 🔌 API Endpoint Map

```
/api
├── /auth
│   ├── POST /register          → auth.py
│   └── POST /login             → auth.py
│
├── /portfolio
│   ├── GET /                   → portfolio.py
│   ├── POST /create            → portfolio.py
│   └── POST /optimize          → portfolio.py
│
├── /forecast
│   └── POST /predict           → forecast.py
│
└── /data
    ├── GET /stocks/{symbol}    → data.py
    └── POST /stocks/batch      → data.py
```

---

## 📊 Model Architecture

### Enhanced Portfolio Model
```
Input Layer (171 Features)
    ↓
Technical Indicators (50+)
    • RSI, MACD, Bollinger Bands
    • Moving Averages (SMA, EMA)
    • Volume Indicators
    ↓
Fundamental Features (30+)
    • Price Ratios
    • Return Metrics
    • Volatility Measures
    ↓
Market Conditions (4 Scenarios)
    • Bull Market
    • Bear Market
    • Normal Market
    • Volatile Market
    ↓
Random Forest Regressor
    • n_estimators: 100
    • max_depth: 10
    ↓
Output: Portfolio Weights (9 stocks)
    • RELIANCE.NS
    • INFY.NS
    • TCS.NS
    • HDFCBANK.NS
    • ICICIBANK.NS
    • SBIN.NS
    • LT.NS
    • KOTAKBANK.NS
    • BHARTIARTL.NS
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         Client Request                  │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│         CORS Validation                 │
│  • Origin Check                         │
│  • Method Validation                    │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│         JWT Authentication              │
│  • Token Verification                   │
│  • Expiration Check                     │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│         Input Validation                │
│  • Pydantic Models                      │
│  • Type Checking                        │
└─────────────────────────────────────────┘
                ↓
┌─────────────────────────────────────────┐
│         Business Logic                  │
└─────────────────────────────────────────┘
```

---

## 📦 Dependency Graph

```
app.py
├── Flask
├── flask-cors
├── yfinance
├── pandas
├── numpy
├── pypfopt
├── scipy
├── joblib
└── enhanced_portfolio_model.py
    └── scikit-learn

routes/
├── auth.py
│   ├── FastAPI
│   ├── JWT
│   └── passlib (bcrypt)
│
├── portfolio.py
│   ├── utils/portfolio_optimizer
│   └── utils/risk_calculator
│
├── forecast.py
│   ├── sklearn
│   └── yfinance
│
└── data.py
    └── yfinance

utils/
├── portfolio_optimizer.py
│   ├── numpy
│   ├── pandas
│   ├── scipy
│   └── pypfopt
│
└── risk_calculator.py
    ├── numpy
    └── pandas
```

---

## 🚀 Execution Flow

### 1. Application Startup
```
1. Load environment variables
2. Initialize Flask app
3. Configure CORS
4. Load ML models
   ├── portfolio_allocator_rf.pkl
   └── enhanced_portfolio_model.pkl
5. Register route blueprints
6. Start server on port 5000
```

### 2. Portfolio Optimization Request
```
Client Request
    ↓
routes/portfolio.py
    ↓
utils/portfolio_optimizer.py
    ├── Fetch stock data (yfinance)
    ├── Calculate returns
    ├── Build covariance matrix
    ├── Run optimization (scipy)
    └── Calculate metrics
    ↓
utils/risk_calculator.py
    ├── Calculate VaR
    ├── Calculate Sharpe Ratio
    ├── Calculate Beta/Alpha
    └── Calculate Max Drawdown
    ↓
enhanced_portfolio_model.pkl
    ├── Extract features
    ├── Predict weights
    └── Validate allocation
    ↓
Return optimized portfolio
```

### 3. Price Prediction Request
```
Client Request
    ↓
routes/forecast.py
    ↓
Fetch historical data (yfinance)
    ↓
Feature engineering
    ├── Technical indicators
    ├── Lag features
    └── Time features
    ↓
Model selection
    ├── Linear Regression
    └── Random Forest
    ↓
Generate predictions
    ↓
Return forecast data
```

---

## 🛠️ Development Workflow

```
1. Setup Environment
   └── python -m venv venv
   └── pip install -r requirements.txt

2. Train Models
   └── python train_enhanced_model.py

3. Verify Setup
   └── python check_models.py

4. Run Application
   └── python app.py

5. Test Endpoints
   └── Use Postman/curl/frontend
```

---

## 📈 Performance Considerations

### Caching Strategy
- Model loaded once at startup
- Stock data cached for 5 minutes
- Historical data cached per session

### Optimization
- Vectorized operations (numpy/pandas)
- Batch processing for multiple stocks
- Async data fetching where possible

### Scalability
- Stateless API design
- Horizontal scaling ready
- Database-agnostic architecture

---

## 🔍 Monitoring Points

1. **Model Performance**
   - Prediction accuracy
   - Training metrics (R², MAE, MSE)
   - Feature importance

2. **API Performance**
   - Response times
   - Error rates
   - Request volume

3. **Data Quality**
   - Missing data handling
   - Data freshness
   - API availability (yfinance)

---

## 📝 Quick Reference

### Important Files
- **Entry Point:** `app.py`
- **Main Model:** `enhanced_portfolio_model.py`
- **Config:** `requirements.txt`
- **Diagnostics:** `check_models.py`

### Key Directories
- **API Routes:** `routes/`
- **Business Logic:** `utils/`
- **Data Models:** `models/`
- **ML Models:** `*.pkl` files

### Common Commands
```bash
# Activate environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train model
python train_enhanced_model.py

# Check models
python check_models.py

# Run server
python app.py
```

---

**Document Version:** 1.0  
**Last Updated:** October 2025
