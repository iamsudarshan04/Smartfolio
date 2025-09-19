from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
from utils.portfolio_optimizer import PortfolioOptimizer
from utils.risk_calculator import RiskCalculator

router = APIRouter()

class PortfolioRequest(BaseModel):
    symbols: List[str]
    weights: Optional[List[float]] = None
    investment_amount: float = 10000

class OptimizationRequest(BaseModel):
    symbols: List[str]
    risk_tolerance: str = "moderate"  # conservative, moderate, aggressive
    investment_amount: float = 10000

@router.get("/")
async def get_portfolios():
    """Get all user portfolios"""
    return {"portfolios": []}

@router.post("/create")
async def create_portfolio(request: PortfolioRequest):
    """Create a new portfolio"""
    try:
        optimizer = PortfolioOptimizer()
        portfolio_data = optimizer.create_portfolio(
            request.symbols, 
            request.weights, 
            request.investment_amount
        )
        return {"success": True, "portfolio": portfolio_data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/optimize")
async def optimize_portfolio(request: OptimizationRequest):
    """Optimize portfolio allocation"""
    try:
        optimizer = PortfolioOptimizer()
        optimized_portfolio = optimizer.optimize(
            request.symbols,
            request.risk_tolerance,
            request.investment_amount
        )
        return {"success": True, "optimized_portfolio": optimized_portfolio}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{portfolio_id}/performance")
async def get_portfolio_performance(portfolio_id: str):
    """Get portfolio performance metrics"""
    try:
        risk_calc = RiskCalculator()
        performance = risk_calc.calculate_performance(portfolio_id)
        return {"success": True, "performance": performance}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
