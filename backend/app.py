from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
from pypfopt import EfficientFrontier, risk_models, expected_returns
from scipy import stats

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # allow all origins

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

def stock_statistics(prices):
    """Calculate statistics for a single stock price series."""
    returns = prices.pct_change().dropna()
    ann_return = returns.mean() * 252
    ann_vol = returns.std() * np.sqrt(252)
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
      ]
    }
    """
    data = request.json
    stocks = data.get("stocks", [])

    if not stocks:
        return jsonify({"error": "No stocks provided"}), 400

    tickers = [s["ticker"].upper() for s in stocks]
    amounts = [float(s["amount"]) for s in stocks]
    total_amount = sum(amounts)

    try:
        # Fetch historical price data
        price_df = fetch_data(tickers, period="1y")
        if price_df.empty:
            return jsonify({"error": "No data available for the given tickers"}), 400

        # Portfolio optimization with fallback strategies
        mu = expected_returns.mean_historical_return(price_df)
        S = risk_models.sample_cov(price_df)
        
        try:
            # Try Max Sharpe optimization with lower risk-free rate
            ef = EfficientFrontier(mu, S)
            ef.max_sharpe(risk_free_rate=0.02)  # Lower risk-free rate (2%)
            weights = ef.clean_weights()
            exp_ret, vol, sharpe = ef.portfolio_performance(risk_free_rate=0.02)
        except:
            try:
                # Fallback to minimum volatility if Max Sharpe fails
                ef = EfficientFrontier(mu, S)
                ef.min_volatility()
                weights = ef.clean_weights()
                exp_ret, vol, sharpe = ef.portfolio_performance(risk_free_rate=0.02)
            except:
                try:
                    # Try efficient return targeting median return
                    median_return = np.median(mu)
                    ef = EfficientFrontier(mu, S)
                    ef.efficient_return(median_return)
                    weights = ef.clean_weights()
                    exp_ret, vol, sharpe = ef.portfolio_performance(risk_free_rate=0.02)
                except:
                    # Final fallback to equal weights
                    n_assets = len(tickers)
                    weights = {ticker: 1/n_assets for ticker in tickers}
                    portfolio_return = sum(mu[ticker] * weights[ticker] for ticker in tickers)
                    portfolio_vol = np.sqrt(np.dot(list(weights.values()), np.dot(S.values, list(weights.values()))))
                    exp_ret = portfolio_return
                    vol = portfolio_vol
                    sharpe = (exp_ret - 0.02) / vol if vol > 0 else 0

        # Allocation based on weights and total amount
        allocation = {t: round(weights[t] * total_amount, 2) for t in tickers}

        # Per-stock statistics
        stock_stats = {t: stock_statistics(price_df[t]) for t in tickers}

        return jsonify({
            "weights": weights,
            "allocation": allocation,
            "expected_return": exp_ret,
            "volatility": vol,
            "sharpe_ratio": sharpe,
            "per_stock_stats": stock_stats
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Health check
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Quant Finance Portfolio API is running"})

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=True)
