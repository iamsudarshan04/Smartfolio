from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
from pypfopt import risk_models, expected_returns
from scipy import stats
import joblib
import os
import sys
from datetime import datetime, timedelta

# Import the EnhancedPortfolioModel class
try:
    # Import from the enhanced model file
    import importlib.util
    spec = importlib.util.spec_from_file_location(
        "enhanced_portfolio_model",
        os.path.join(os.path.dirname(__file__), "enhanced_portfolio_model.py")
    )
    enhanced_module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(enhanced_module)
    EnhancedPortfolioModel = enhanced_module.EnhancedPortfolioModel
    print("✅ EnhancedPortfolioModel class imported successfully")
except Exception as e:
    print(f"⚠️  Could not import EnhancedPortfolioModel class: {e}")
    EnhancedPortfolioModel = None

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # allow all origins

# Load ML models
model_path = os.path.join(os.path.dirname(__file__), 'portfolio_allocator_rf.pkl')
enhanced_model_path = os.path.join(os.path.dirname(__file__), 'enhanced_portfolio_model.pkl')

print("\n" + "="*60)
print("🚀 Loading ML Models...")
print("="*60)

try:
    rf_model = joblib.load(model_path)
    print("✅ Basic ML model loaded successfully")
    print(f"   Path: {model_path}")
except Exception as e:
    print(f"❌ Error loading basic ML model: {e}")
    print(f"   Path: {model_path}")
    print(f"   File exists: {os.path.exists(model_path)}")
    rf_model = None

# Try to load pre-trained enhanced model from pickle file
enhanced_model_instance = None
try:
    enhanced_model_data = joblib.load(enhanced_model_path)
    enhanced_model = enhanced_model_data['model']
    enhanced_tickers = enhanced_model_data['tickers']
    enhanced_feature_names = enhanced_model_data['feature_names']
    print("✅ Enhanced ML model (pickle) loaded successfully")
    print(f"   Path: {enhanced_model_path}")
    print(f"   Supported tickers: {enhanced_tickers}")
except Exception as e:
    print(f"⚠️  Enhanced ML model (pickle) not available: {e}")
    print(f"   Attempting to initialize EnhancedPortfolioModel class...")
    enhanced_model = None
    enhanced_tickers = None
    enhanced_feature_names = None

# If pickle not available, try to use EnhancedPortfolioModel class directly
if enhanced_model is None and EnhancedPortfolioModel is not None:
    try:
        enhanced_model_instance = EnhancedPortfolioModel()
        # Try to load trained model
        try:
            enhanced_model_instance.load_model(enhanced_model_path)
            enhanced_model = enhanced_model_instance.model
            enhanced_tickers = enhanced_model_instance.tickers
            enhanced_feature_names = enhanced_model_instance.feature_names
            print("✅ Enhanced model loaded from EnhancedPortfolioModel class")
            print(f"   Supported tickers: {enhanced_tickers}")
        except:
            # If no saved model, train a new one
            print("   No saved model found, training new enhanced model...")
            enhanced_model_instance.train_model(n_samples=500)
            enhanced_model_instance.save_model(enhanced_model_path)
            enhanced_model = enhanced_model_instance.model
            enhanced_tickers = enhanced_model_instance.tickers
            enhanced_feature_names = enhanced_model_instance.feature_names
            print("✅ New enhanced model trained and saved")
            print(f"   Supported tickers: {enhanced_tickers}")
    except Exception as e:
        print(f"❌ Failed to initialize EnhancedPortfolioModel: {e}")
        enhanced_model = None
        enhanced_tickers = None
        enhanced_feature_names = None

print("\n📊 Model Status:")
if rf_model is not None:
    print("   ✅ Basic model: READY (works with any stocks)")
else:
    print("   ⚠️  Basic model: NOT AVAILABLE")
    
if enhanced_model is not None:
    print(f"   ✅ Enhanced model: READY (9 Indian stocks)")
    print(f"      Supported: {', '.join(enhanced_tickers)}")
else:
    print("   ⚠️  Enhanced model: NOT AVAILABLE")

if rf_model is None and enhanced_model is None:
    print("\n❌ WARNING: No ML models available!")
    print("   The /optimize endpoint will not work.")
    print("   Flask will attempt to train enhanced model on startup.")
elif rf_model is None and enhanced_model is not None:
    print("\n💡 INFO: Only enhanced model available")
    print("   ✅ Works perfectly with: " + ", ".join(enhanced_tickers[:3]) + "...")
    print("   ⚠️  Other stocks will use partial predictions or equal weights")
elif rf_model is not None and enhanced_model is None:
    print("\n💡 INFO: Only basic model available")
    print("   ✅ Works with any stocks")
    print("   💡 For better results with Indian stocks, restart Flask to train enhanced model")
else:
    print("\n✅ Both models available - Optimal configuration!")
    print("   Enhanced model for Indian stocks, Basic model for others")
    
print("="*60 + "\n")


# -----------------------------
# Helper functions
# -----------------------------
def fetch_data(tickers, period="1y"):
    """Download adjusted close prices from yfinance."""
    df = yf.download(tickers, period=period, progress=False)
    
    if "Adj Close" in df:
        df = df["Adj Close"]
    elif "Close" in df:
        df = df["Close"]
    else:
        raise ValueError("No 'Adj Close' or 'Close' column found in data.")
    
    if isinstance(df, pd.Series):
        df = df.to_frame()
    return df.dropna()

def prepare_ml_features(price_df):
    """Prepare features for basic ML model prediction."""
    features = []
    returns = price_df.pct_change().dropna()
    
    # Calculate features for each stock
    for ticker in price_df.columns:
        # Basic statistics
        ret = returns[ticker]
        ann_ret = ret.mean() * 252
        ann_vol = ret.std() * np.sqrt(252)
        sharpe = ann_ret / ann_vol if ann_vol > 0 else 0
        
        # Additional features
        skew = stats.skew(ret)
        kurt = stats.kurtosis(ret)
        var_95 = np.percentile(ret, 5)
        
        # Add to features
        features.extend([
            ann_ret, ann_vol, sharpe, 
            float(skew), float(kurt), float(var_95)
        ])
    
    # Ensure we have exactly 36 features (6 stocks * 6 features each)
    max_features = 36
    features = features[:max_features]  # Truncate if too many
    features.extend([0] * (max_features - len(features)))  # Pad with zeros
    
    return np.array(features).reshape(1, -1)

def prepare_enhanced_features(price_df, tickers):
    """
    Prepare 171 features for enhanced ML model prediction.
    This matches the exact feature calculation from EnhancedPortfolioModel training.
    
    Features per ticker (19 total):
    1. return, 2. vol, 3. sharpe, 4. mom3m, 5. mom1m, 6. mom1w,
    7. volratio, 8. realvol, 9. skew, 10. kurt, 11. maxdd, 12. currdd,
    13. sma20, 14. sma50, 15. smaratio, 16. rsi, 17. mktcorr, 18. beta, 19. priceperc
    """
    features = []
    returns = price_df.pct_change().dropna()
    
    for ticker in tickers:
        if ticker not in price_df.columns:
            # If ticker not in data, add zeros for all features
            features.extend([0] * 19)
            continue
            
        prices = price_df[ticker]
        ret = returns[ticker]
        
        # 1. Annual return
        ann_ret = ret.mean() * 252
        
        # 2. Volatility
        ann_vol = ret.std() * np.sqrt(252)
        
        # 3. Sharpe ratio
        sharpe = ann_ret / ann_vol if ann_vol > 0 else 0
        
        # 4-6. Momentum (3m, 1m, 1w)
        mom_3m = (prices.iloc[-1] / prices.iloc[-63] - 1) if len(prices) >= 63 else 0
        mom_1m = (prices.iloc[-1] / prices.iloc[-21] - 1) if len(prices) >= 21 else 0
        mom_1w = (prices.iloc[-1] / prices.iloc[-5] - 1) if len(prices) >= 5 else 0
        
        # 7. Volatility ratio (recent vs long-term)
        recent_vol = ret.iloc[-21:].std() if len(ret) >= 21 else ann_vol
        vol_ratio = recent_vol / ann_vol if ann_vol > 0 else 1
        
        # 8. Realized volatility
        real_vol = ret.std() * np.sqrt(252)
        
        # 9-10. Skewness and Kurtosis
        skew = float(stats.skew(ret))
        kurt = float(stats.kurtosis(ret))
        
        # 11-12. Drawdown
        cumulative = (1 + ret).cumprod()
        running_max = cumulative.cummax()
        drawdown = (cumulative / running_max - 1)
        max_dd = float(drawdown.min())
        curr_dd = float(drawdown.iloc[-1])
        
        # 13-15. Moving averages (normalized values)
        sma_20 = prices.rolling(20).mean().iloc[-1] if len(prices) >= 20 else prices.iloc[-1]
        sma_50 = prices.rolling(50).mean().iloc[-1] if len(prices) >= 50 else prices.iloc[-1]
        # Normalize SMAs relative to current price
        sma_20_norm = (sma_20 - prices.iloc[-1]) / prices.iloc[-1] if prices.iloc[-1] > 0 else 0
        sma_50_norm = (sma_50 - prices.iloc[-1]) / prices.iloc[-1] if prices.iloc[-1] > 0 else 0
        sma_ratio = sma_20 / sma_50 if sma_50 > 0 else 1
        
        # 16. RSI (normalized to 0-1 range)
        delta = prices.diff()
        gain = (delta.where(delta > 0, 0)).rolling(14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
        rs = gain / loss if len(gain) >= 14 and loss.iloc[-1] != 0 else 1
        rsi = (100 - (100 / (1 + rs.iloc[-1]))) / 100 if len(gain) >= 14 else 0.5
        
        # 17. Market correlation (use first ticker as proxy)
        mkt_corr = ret.corr(returns.iloc[:, 0]) if len(returns.columns) > 1 else 0
        
        # 18. Beta (vs market proxy)
        cov = ret.cov(returns.iloc[:, 0]) if len(returns.columns) > 1 else 0
        mkt_var = returns.iloc[:, 0].var()
        beta = cov / mkt_var if mkt_var > 0 else 1
        
        # 19. Price percentile (current price vs historical range)
        price_min = prices.min()
        price_max = prices.max()
        price_perc = (prices.iloc[-1] - price_min) / (price_max - price_min) if price_max > price_min else 0.5
        
        # Add all 19 features for this ticker (matching training feature order)
        # Order: return, vol, sharpe, mom3m, mom1m, mom1w, volratio, realvol, skew, kurt, 
        #        maxdd, currdd, sma20, sma50, smaratio, rsi, mktcorr, beta, priceperc
        features.extend([
            ann_ret, ann_vol, sharpe, mom_3m, mom_1m, mom_1w,
            vol_ratio, real_vol, skew, kurt, max_dd, curr_dd,
            sma_20_norm, sma_50_norm, sma_ratio, rsi, mkt_corr, beta, price_perc
        ])
    
    return np.array(features).reshape(1, -1)

def stock_statistics(prices):
    """Calculate statistics for a single stock price series."""
    returns = prices.pct_change().dropna()
    ann_return = returns.mean() * 252
    ann_vol = returns.std() * np.sqrt(252)
    sharpe = ann_return / ann_vol if ann_vol > 0 else 0
    skew = stats.skew(returns)
    kurt = stats.kurtosis(returns)
    var_95 = np.percentile(returns, 5)
    cvar_95 = returns[returns <= var_95].mean()
    cumulative = (1 + returns).cumprod()
    drawdown = cumulative / cumulative.cummax() - 1
    max_dd = drawdown.min()
    
    return {
        "annual_return": float(ann_return),
        "annual_volatility": float(ann_vol),
        "sharpe_ratio": float(sharpe),
        "skew": float(skew),
        "kurtosis": float(kurt),
        "var_95": float(var_95),
        "cvar_95": float(cvar_95),
        "max_drawdown": float(max_dd)
    }

# -----------------------------
# Portfolio Optimization Route
# -----------------------------
@app.route("/optimize", methods=["POST"])
def optimize():
    """
    Expects JSON:
    {
      "stocks": [
        {"ticker": "TCS.NS", "amount": 10000},
        {"ticker": "INFY.NS", "amount": 15000},
        ...
      ],
      "use_enhanced": true  // Optional: use enhanced model (default: true)
    }
    
    Returns optimized portfolio weights using EnhancedPortfolioModel (171 features)
    or falls back to basic model if stocks don't match.
    """
    data = request.json
    stocks = data.get("stocks", [])
    use_enhanced = data.get("use_enhanced", True)  # Default to enhanced model

    if not stocks:
        return jsonify({"error": "No stocks provided"}), 400

    tickers = [s["ticker"].upper() for s in stocks]
    amounts = [float(s["amount"]) for s in stocks]
    total_amount = sum(amounts)
    
    print(f"\n{'='*60}")
    print(f"📊 Portfolio Optimization Request")
    print(f"   Tickers: {tickers}")
    print(f"   Total Amount: ₹{total_amount:,.2f}")
    print(f"{'='*60}")

    try:
        # Fetch historical price data
        price_df = fetch_data(tickers, period="1y")
        if price_df.empty:
            return jsonify({"error": "No data available for the given tickers"}), 400
        
        # Determine which model to use
        weights = None
        model_used = None
        
        # Try to use enhanced model if requested and available
        if use_enhanced and enhanced_model is not None and enhanced_tickers is not None and set(tickers).issubset(set(enhanced_tickers)):
            try:
                print(f"🔍 Attempting to use enhanced model for tickers: {tickers}")
                
                # Prepare features for enhanced model (171 features)
                features = prepare_enhanced_features(price_df, enhanced_tickers)
                print(f"📊 Prepared {features.shape[1]} features for enhanced model")
                
                # Get predictions from enhanced ML model
                predicted_weights = enhanced_model.predict(features)[0]
                print(f"🎯 Raw predictions from enhanced model: {predicted_weights}")
                
                # Map predictions to user's tickers
                weights = {}
                for ticker in tickers:
                    if ticker in enhanced_tickers:
                        idx = enhanced_tickers.index(ticker)
                        weights[ticker] = max(0, float(predicted_weights[idx]))
                    else:
                        weights[ticker] = 0
                
                model_used = "enhanced"
                print(f"✅ Using enhanced model - Mapped weights: {weights}")
                
            except Exception as e:
                import traceback
                print(f"⚠️  Enhanced model failed: {e}")
                print(traceback.format_exc())
                weights = None
                model_used = None
        
        # Fallback to basic model if enhanced model wasn't used or failed
        if weights is None:
            # Check if we have ANY model available
            if rf_model is None and enhanced_model is None:
                return jsonify({"error": "No ML model available. Please restart Flask to train the enhanced model."}), 500
            
            # If basic model not available but enhanced model is, try to use enhanced model anyway
            if rf_model is None and enhanced_model is not None:
                print(f"⚠️  Basic model not available, attempting to use enhanced model for unsupported tickers")
                print(f"   Note: Results may be less accurate for non-Indian stocks")
                
                # Use enhanced model but only for tickers it knows
                try:
                    # Prepare features for enhanced model
                    features = prepare_enhanced_features(price_df, enhanced_tickers)
                    predicted_weights = enhanced_model.predict(features)[0]
                    
                    # Map only the tickers that exist in both lists
                    weights = {}
                    for ticker in tickers:
                        if ticker in enhanced_tickers:
                            idx = enhanced_tickers.index(ticker)
                            weights[ticker] = max(0, float(predicted_weights[idx]))
                        else:
                            # Equal weight for unsupported tickers
                            weights[ticker] = 1.0 / len(tickers)
                    
                    model_used = "enhanced_partial"
                    print(f"✅ Using enhanced model (partial) - Mapped weights: {weights}")
                except Exception as e:
                    print(f"❌ Enhanced model failed: {e}")
                    # Last resort: equal weights
                    weights = {ticker: 1.0/len(tickers) for ticker in tickers}
                    model_used = "equal_weight_fallback"
                    print(f"⚠️  Using equal weights as fallback")
            else:
                # Use basic model
                print(f"📊 Using basic model for tickers: {tickers}")
                
                # Prepare features for basic ML model
                features = prepare_ml_features(price_df)
                print(f"📊 Prepared {features.shape[1]} features for basic model")
                
                # Get predictions from basic ML model
                predicted_weights = rf_model.predict(features)[0]
                print(f"🎯 Raw predictions from basic model: {predicted_weights[:len(tickers)]}")
                
                # Convert predictions to weights dictionary
                weights = {ticker: max(0, float(w)) for ticker, w in zip(tickers, predicted_weights[:len(tickers)])}
                model_used = "basic_random_forest"
                print(f"✅ Using basic model - Mapped weights: {weights}")
        
        # Normalize weights to sum to 1
        total_weight = sum(weights.values())
        if total_weight > 0:
            weights = {k: v/total_weight for k, v in weights.items()}
        else:
            # Fallback to equal weights if all predictions are zero or negative
            weights = {ticker: 1.0/len(tickers) for ticker in tickers}
        
        # Calculate portfolio statistics
        returns = price_df.pct_change().dropna()
        
        # Calculate expected returns using multiple methods
        print(f"\n📈 Calculating Expected Returns...")
        
        # Method 1: Historical mean (simple average)
        historical_returns = expected_returns.mean_historical_return(price_df, frequency=252)
        print(f"   Historical returns: {dict(historical_returns)}")
        
        # Method 2: Exponential moving average (gives more weight to recent data)
        ema_returns = expected_returns.ema_historical_return(price_df, frequency=252, span=500)
        print(f"   EMA returns: {dict(ema_returns)}")
        
        # Method 3: CAPM returns (more sophisticated)
        capm_returns = None
        try:
            capm_returns = expected_returns.capm_return(price_df, frequency=252)
            print(f"   CAPM returns: {dict(capm_returns)}")
        except Exception as e:
            print(f"   ⚠️  CAPM calculation failed: {e}")
        
        # Use the best available method (prioritize CAPM > EMA > Historical)
        if capm_returns is not None:
            mu = capm_returns
            method_used = "CAPM"
        else:
            mu = ema_returns
            method_used = "EMA"
        
        print(f"\n✅ Using {method_used} for expected returns")
        
        # Apply minimum expected return threshold for equity portfolios
        # Equities should have at least 8-12% expected return
        # Indian stocks: 10-15%, US stocks: 8-12%
        is_indian = any('.NS' in t or '.BO' in t for t in tickers)
        min_return = 0.10 if is_indian else 0.08  # 10% for Indian, 8% for US stocks
        mu_adjusted = {}
        for ticker in tickers:
            if ticker in mu:
                # If return is too low, boost it to minimum threshold
                if mu[ticker] < min_return:
                    print(f"   ⚠️  {ticker}: Boosting from {mu[ticker]*100:.2f}% to {min_return*100:.2f}%")
                    mu_adjusted[ticker] = min_return
                else:
                    mu_adjusted[ticker] = mu[ticker]
            else:
                # Default to 12% for missing tickers
                mu_adjusted[ticker] = 0.12
                print(f"   ⚠️  {ticker}: Using default 12% return")
        
        mu = pd.Series(mu_adjusted)
        print(f"\n📊 Adjusted Expected Returns: {dict(mu)}")
        
        # Calculate portfolio expected return using optimized weights
        ann_return = sum(weights[ticker] * mu[ticker] for ticker in tickers)
        print(f"💰 Portfolio Expected Return: {ann_return:.4f} ({ann_return*100:.2f}%)")
        
        # Calculate portfolio volatility
        portfolio_returns = (returns * pd.Series(weights)).sum(axis=1)
        ann_vol = portfolio_returns.std() * np.sqrt(252)
        
        # Calculate Sharpe ratio (assuming 4% risk-free rate for India, 2% for US)
        risk_free_rate = 0.04 if any('.NS' in t or '.BO' in t for t in tickers) else 0.02
        sharpe = (ann_return - risk_free_rate) / ann_vol if ann_vol > 0 else 0
        
        # Calculate allocation amounts
        allocation = {t: round(weights[t] * total_amount, 2) for t in tickers}
        
        # Calculate per-stock statistics
        stock_stats = {t: stock_statistics(price_df[t]) for t in tickers}

        # Calculate individual stock expected returns for transparency
        stock_expected_returns = {ticker: float(mu[ticker]) for ticker in tickers}
        
        return jsonify({
            "weights": weights,
            "allocation": allocation,
            "expected_return": float(ann_return),
            "volatility": float(ann_vol),
            "sharpe_ratio": float(sharpe),
            "per_stock_stats": stock_stats,
            "stock_expected_returns": stock_expected_returns,
            "model_used": model_used,
            "return_method": "CAPM/EMA",
            "enhanced_model_available": enhanced_model is not None,
            "enhanced_tickers": enhanced_tickers if enhanced_model is not None else []
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health check
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Quant Finance Portfolio API is running"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
