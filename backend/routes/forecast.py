from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import yfinance as yf
from datetime import datetime, timedelta

router = APIRouter()

class ForecastRequest(BaseModel):
    symbols: List[str]
    days: int = 30
    model_type: str = "linear"  # linear, random_forest

@router.post("/predict")
async def predict_stock_prices(request: ForecastRequest):
    """Predict future stock prices"""
    try:
        predictions = {}
        
        for symbol in request.symbols:
            # Get historical data
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period="2y")
            
            if hist.empty:
                continue
            
            # Prepare features
            hist['Days'] = range(len(hist))
            hist['MA_10'] = hist['Close'].rolling(window=10).mean()
            hist['MA_30'] = hist['Close'].rolling(window=30).mean()
            hist['Volatility'] = hist['Close'].rolling(window=10).std()
            
            # Remove NaN values
            hist = hist.dropna()
            
            if len(hist) < 50:  # Need enough data
                continue
            
            # Features and target
            features = ['Days', 'MA_10', 'MA_30', 'Volatility']
            X = hist[features].values
            y = hist['Close'].values
            
            # Train model
            if request.model_type == "random_forest":
                model = RandomForestRegressor(n_estimators=100, random_state=42)
            else:
                model = LinearRegression()
            
            model.fit(X, y)
            
            # Make predictions
            last_day = hist['Days'].iloc[-1]
            future_days = range(last_day + 1, last_day + request.days + 1)
            
            # Simple prediction (in practice, you'd use more sophisticated features)
            last_ma_10 = hist['MA_10'].iloc[-1]
            last_ma_30 = hist['MA_30'].iloc[-1]
            last_volatility = hist['Volatility'].iloc[-1]
            
            future_predictions = []
            for day in future_days:
                pred_features = np.array([[day, last_ma_10, last_ma_30, last_volatility]])
                prediction = model.predict(pred_features)[0]
                future_predictions.append({
                    "date": (datetime.now() + timedelta(days=day-last_day)).strftime("%Y-%m-%d"),
                    "predicted_price": round(prediction, 2)
                })
            
            predictions[symbol] = {
                "current_price": round(hist['Close'].iloc[-1], 2),
                "predictions": future_predictions,
                "model_score": round(model.score(X, y), 3)
            }
        
        return {"success": True, "predictions": predictions}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/market-sentiment")
async def get_market_sentiment():
    """Get overall market sentiment indicators"""
    try:
        # Simple sentiment based on major indices performance
        indices = ["^GSPC", "^VIX"]  # S&P 500 and VIX
        sentiment_data = {}
        
        for index in indices:
            ticker = yf.Ticker(index)
            hist = ticker.history(period="5d")
            
            if not hist.empty and len(hist) >= 2:
                current = hist['Close'].iloc[-1]
                previous = hist['Close'].iloc[-2]
                change_percent = ((current - previous) / previous) * 100
                
                sentiment_data[index] = {
                    "current": round(current, 2),
                    "change_percent": round(change_percent, 2)
                }
        
        # Simple sentiment calculation
        sp500_change = sentiment_data.get("^GSPC", {}).get("change_percent", 0)
        vix_current = sentiment_data.get("^VIX", {}).get("current", 20)
        
        if sp500_change > 1 and vix_current < 20:
            sentiment = "Bullish"
        elif sp500_change < -1 and vix_current > 25:
            sentiment = "Bearish"
        else:
            sentiment = "Neutral"
        
        return {
            "success": True,
            "sentiment": sentiment,
            "indicators": sentiment_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
