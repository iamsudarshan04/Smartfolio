from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

router = APIRouter()

class StockDataRequest(BaseModel):
    symbols: List[str]
    period: str = "1y"  # 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max

@router.get("/stocks/{symbol}")
async def get_stock_data(symbol: str, period: str = "1y"):
    """Get historical stock data for a single symbol"""
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=period)
        
        if hist.empty:
            raise HTTPException(status_code=404, detail=f"No data found for symbol {symbol}")
        
        # Convert to JSON-serializable format
        data = {
            "symbol": symbol,
            "data": hist.reset_index().to_dict('records'),
            "info": ticker.info
        }
        return data
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/stocks/batch")
async def get_batch_stock_data(request: StockDataRequest):
    """Get historical stock data for multiple symbols"""
    try:
        data = {}
        for symbol in request.symbols:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=request.period)
            
            if not hist.empty:
                data[symbol] = {
                    "data": hist.reset_index().to_dict('records'),
                    "info": ticker.info
                }
        
        return {"success": True, "data": data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/market/indices")
async def get_market_indices():
    """Get major market indices data"""
    try:
        indices = ["^GSPC", "^DJI", "^IXIC", "^RUT"]  # S&P 500, Dow, NASDAQ, Russell 2000
        data = {}
        
        for index in indices:
            ticker = yf.Ticker(index)
            hist = ticker.history(period="1d")
            if not hist.empty:
                latest = hist.iloc[-1]
                data[index] = {
                    "price": latest['Close'],
                    "change": latest['Close'] - hist.iloc[-2]['Close'] if len(hist) > 1 else 0,
                    "change_percent": ((latest['Close'] - hist.iloc[-2]['Close']) / hist.iloc[-2]['Close'] * 100) if len(hist) > 1 else 0
                }
        
        return {"success": True, "indices": data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/search/{query}")
async def search_stocks(query: str):
    """Search for stocks by name or symbol"""
    try:
        # This is a simplified search - in production, you'd use a proper search API
        ticker = yf.Ticker(query.upper())
        info = ticker.info
        
        if 'symbol' in info:
            return {
                "success": True,
                "results": [{
                    "symbol": info.get('symbol', query.upper()),
                    "name": info.get('longName', 'Unknown'),
                    "sector": info.get('sector', 'Unknown'),
                    "industry": info.get('industry', 'Unknown')
                }]
            }
        else:
            return {"success": True, "results": []}
    except Exception as e:
        return {"success": True, "results": []}
