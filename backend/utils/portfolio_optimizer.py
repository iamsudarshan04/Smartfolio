import numpy as np
import pandas as pd
import yfinance as yf
from scipy.optimize import minimize
from typing import List, Dict, Optional
from datetime import datetime, timedelta

class PortfolioOptimizer:
    def __init__(self):
        self.risk_free_rate = 0.02  # 2% risk-free rate
    
    def get_stock_data(self, symbols: List[str], period: str = "2y") -> pd.DataFrame:
        """Fetch historical stock data"""
        try:
            data = yf.download(symbols, period=period)['Adj Close']
            return data.dropna()
        except Exception as e:
            raise Exception(f"Error fetching data: {str(e)}")
    
    def calculate_returns(self, prices: pd.DataFrame) -> pd.DataFrame:
        """Calculate daily returns"""
        return prices.pct_change().dropna()
    
    def calculate_portfolio_stats(self, weights: np.array, returns: pd.DataFrame) -> Dict:
        """Calculate portfolio statistics"""
        portfolio_return = np.sum(returns.mean() * weights) * 252  # Annualized
        portfolio_volatility = np.sqrt(np.dot(weights.T, np.dot(returns.cov() * 252, weights)))
        sharpe_ratio = (portfolio_return - self.risk_free_rate) / portfolio_volatility
        
        return {
            'return': portfolio_return,
            'volatility': portfolio_volatility,
            'sharpe_ratio': sharpe_ratio
        }
    
    def optimize_portfolio(self, symbols: List[str], risk_tolerance: str = "moderate") -> Dict:
        """Optimize portfolio allocation based on risk tolerance"""
        try:
            # Get data
            prices = self.get_stock_data(symbols)
            returns = self.calculate_returns(prices)
            
            n_assets = len(symbols)
            
            # Set constraints based on risk tolerance
            if risk_tolerance == "conservative":
                target_return = 0.08  # 8% target return
                max_weight = 0.3  # Max 30% in any single asset
            elif risk_tolerance == "aggressive":
                target_return = 0.15  # 15% target return
                max_weight = 0.5  # Max 50% in any single asset
            else:  # moderate
                target_return = 0.12  # 12% target return
                max_weight = 0.4  # Max 40% in any single asset
            
            # Objective function: minimize negative Sharpe ratio
            def objective(weights):
                stats = self.calculate_portfolio_stats(weights, returns)
                return -stats['sharpe_ratio']  # Negative because we minimize
            
            # Constraints
            constraints = [
                {'type': 'eq', 'fun': lambda x: np.sum(x) - 1},  # Weights sum to 1
            ]
            
            # Bounds for each weight
            bounds = tuple((0.05, max_weight) for _ in range(n_assets))  # Min 5% each
            
            # Initial guess (equal weights)
            initial_guess = np.array([1/n_assets] * n_assets)
            
            # Optimize
            result = minimize(objective, initial_guess, method='SLSQP', 
                            bounds=bounds, constraints=constraints)
            
            if result.success:
                optimal_weights = result.x
                stats = self.calculate_portfolio_stats(optimal_weights, returns)
                
                return {
                    'symbols': symbols,
                    'weights': optimal_weights.tolist(),
                    'expected_return': stats['return'],
                    'volatility': stats['volatility'],
                    'sharpe_ratio': stats['sharpe_ratio'],
                    'optimization_success': True
                }
            else:
                raise Exception("Optimization failed")
                
        except Exception as e:
            raise Exception(f"Portfolio optimization error: {str(e)}")
    
    def create_portfolio(self, symbols: List[str], weights: Optional[List[float]] = None, 
                        investment_amount: float = 10000) -> Dict:
        """Create a portfolio with given or equal weights"""
        try:
            if weights is None:
                weights = [1/len(symbols)] * len(symbols)
            
            # Get current prices
            current_prices = {}
            portfolio_data = []
            
            for i, symbol in enumerate(symbols):
                ticker = yf.Ticker(symbol)
                info = ticker.info
                current_price = info.get('currentPrice', info.get('regularMarketPrice', 0))
                
                if current_price == 0:
                    # Fallback to recent history
                    hist = ticker.history(period="1d")
                    if not hist.empty:
                        current_price = hist['Close'].iloc[-1]
                
                allocation = investment_amount * weights[i]
                quantity = int(allocation / current_price) if current_price > 0 else 0
                actual_value = quantity * current_price
                
                portfolio_data.append({
                    'symbol': symbol,
                    'name': info.get('longName', symbol),
                    'sector': info.get('sector', 'Unknown'),
                    'current_price': current_price,
                    'target_weight': weights[i],
                    'target_allocation': allocation,
                    'quantity': quantity,
                    'actual_value': actual_value,
                    'actual_weight': actual_value / investment_amount if investment_amount > 0 else 0
                })
            
            total_invested = sum([stock['actual_value'] for stock in portfolio_data])
            cash_remaining = investment_amount - total_invested
            
            return {
                'portfolio': portfolio_data,
                'total_investment': investment_amount,
                'total_invested': total_invested,
                'cash_remaining': cash_remaining,
                'created_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Portfolio creation error: {str(e)}")
