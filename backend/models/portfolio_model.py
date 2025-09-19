from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class Stock(BaseModel):
    symbol: str
    name: str
    sector: Optional[str] = None
    current_price: float
    quantity: int
    weight: float
    value: float

class Portfolio(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    total_value: float
    cash_balance: float
    stocks: List[Stock]
    created_at: datetime
    updated_at: datetime
    risk_level: str  # conservative, moderate, aggressive
    
class PortfolioPerformance(BaseModel):
    portfolio_id: str
    total_return: float
    total_return_percent: float
    daily_return: float
    daily_return_percent: float
    volatility: float
    sharpe_ratio: float
    max_drawdown: float
    beta: float
    alpha: float
    
class Transaction(BaseModel):
    id: str
    portfolio_id: str
    symbol: str
    transaction_type: str  # buy, sell
    quantity: int
    price: float
    total_amount: float
    fees: float
    timestamp: datetime
