import numpy as np
import pandas as pd
import yfinance as yf
from typing import Dict, List
from datetime import datetime, timedelta

class RiskCalculator:
    def __init__(self):
        self.risk_free_rate = 0.02
        self.market_symbol = "^GSPC"  # S&P 500 as market benchmark
    
    def calculate_var(self, returns: pd.Series, confidence_level: float = 0.05) -> float:
        """Calculate Value at Risk (VaR)"""
        return np.percentile(returns, confidence_level * 100)
    
    def calculate_cvar(self, returns: pd.Series, confidence_level: float = 0.05) -> float:
        """Calculate Conditional Value at Risk (CVaR)"""
        var = self.calculate_var(returns, confidence_level)
        return returns[returns <= var].mean()
    
    def calculate_max_drawdown(self, prices: pd.Series) -> float:
        """Calculate maximum drawdown"""
        cumulative = (1 + prices.pct_change()).cumprod()
        running_max = cumulative.expanding().max()
        drawdown = (cumulative - running_max) / running_max
        return drawdown.min()
    
    def calculate_beta(self, stock_returns: pd.Series, market_returns: pd.Series) -> float:
        """Calculate beta coefficient"""
        covariance = np.cov(stock_returns, market_returns)[0][1]
        market_variance = np.var(market_returns)
        return covariance / market_variance if market_variance != 0 else 0
    
    def calculate_alpha(self, stock_returns: pd.Series, market_returns: pd.Series, beta: float) -> float:
        """Calculate alpha"""
        stock_return = stock_returns.mean() * 252  # Annualized
        market_return = market_returns.mean() * 252  # Annualized
        return stock_return - (self.risk_free_rate + beta * (market_return - self.risk_free_rate))
    
    def calculate_sharpe_ratio(self, returns: pd.Series) -> float:
        """Calculate Sharpe ratio"""
        excess_return = returns.mean() * 252 - self.risk_free_rate
        volatility = returns.std() * np.sqrt(252)
        return excess_return / volatility if volatility != 0 else 0
    
    def calculate_sortino_ratio(self, returns: pd.Series) -> float:
        """Calculate Sortino ratio"""
        excess_return = returns.mean() * 252 - self.risk_free_rate
        downside_returns = returns[returns < 0]
        downside_deviation = downside_returns.std() * np.sqrt(252)
        return excess_return / downside_deviation if downside_deviation != 0 else 0
    
    def calculate_portfolio_risk_metrics(self, symbols: List[str], weights: List[float], 
                                       period: str = "2y") -> Dict:
        """Calculate comprehensive risk metrics for a portfolio"""
        try:
            # Get portfolio data
            prices = yf.download(symbols, period=period)['Adj Close']
            if len(symbols) == 1:
                prices = prices.to_frame()
                prices.columns = symbols
            
            returns = prices.pct_change().dropna()
            
            # Calculate portfolio returns
            portfolio_returns = (returns * weights).sum(axis=1)
            
            # Get market data for beta/alpha calculation
            market_data = yf.download(self.market_symbol, period=period)['Adj Close']
            market_returns = market_data.pct_change().dropna()
            
            # Align dates
            common_dates = portfolio_returns.index.intersection(market_returns.index)
            portfolio_returns = portfolio_returns.loc[common_dates]
            market_returns = market_returns.loc[common_dates]
            
            # Calculate metrics
            metrics = {
                'annualized_return': portfolio_returns.mean() * 252,
                'annualized_volatility': portfolio_returns.std() * np.sqrt(252),
                'sharpe_ratio': self.calculate_sharpe_ratio(portfolio_returns),
                'sortino_ratio': self.calculate_sortino_ratio(portfolio_returns),
                'max_drawdown': self.calculate_max_drawdown(portfolio_returns),
                'var_95': self.calculate_var(portfolio_returns, 0.05),
                'cvar_95': self.calculate_cvar(portfolio_returns, 0.05),
                'beta': self.calculate_beta(portfolio_returns, market_returns),
                'skewness': portfolio_returns.skew(),
                'kurtosis': portfolio_returns.kurtosis()
            }
            
            # Calculate alpha
            metrics['alpha'] = self.calculate_alpha(portfolio_returns, market_returns, metrics['beta'])
            
            # Risk assessment
            if metrics['annualized_volatility'] < 0.15:
                risk_level = "Low"
            elif metrics['annualized_volatility'] < 0.25:
                risk_level = "Moderate"
            else:
                risk_level = "High"
            
            metrics['risk_level'] = risk_level
            
            return metrics
            
        except Exception as e:
            raise Exception(f"Risk calculation error: {str(e)}")
    
    def calculate_performance(self, portfolio_id: str) -> Dict:
        """Calculate portfolio performance (placeholder for database integration)"""
        # This would typically fetch portfolio data from database
        # For now, return sample performance data
        return {
            'total_return': 0.12,
            'total_return_percent': 12.0,
            'daily_return': 0.0008,
            'daily_return_percent': 0.08,
            'ytd_return': 0.15,
            'volatility': 0.18,
            'sharpe_ratio': 0.67,
            'max_drawdown': -0.08,
            'beta': 1.05,
            'alpha': 0.02
        }
