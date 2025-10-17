#!/usr/bin/env python3
"""
Script to train and save the enhanced portfolio model
"""

import sys
import os

# Import the enhanced model class
from enhanced_portfolio_model import EnhancedPortfolioModel

# Train and save the model
if __name__ == "__main__":
    print("🚀 Training Enhanced Portfolio Model")
    print("=" * 60)
    
    # Initialize model
    model = EnhancedPortfolioModel()
    
    # Train with more samples for better performance
    print("\n📚 Training model with 500 samples...")
    training_results = model.train_model(n_samples=500)
    
    print(f"\n✅ Training Complete!")
    print(f"📊 Performance Metrics:")
    print(f"   - R² Score: {training_results['r2']:.4f}")
    print(f"   - MAE: {training_results['mae']:.4f}")
    print(f"   - MSE: {training_results['mse']:.6f}")
    
    # Save the model
    print("\n💾 Saving model...")
    model.save_model('enhanced_portfolio_model.pkl')
    
    # Test prediction
    print("\n🧪 Testing prediction...")
    test_weights = model.predict_portfolio(market_condition='normal')
    test_metrics = model.calculate_portfolio_metrics(test_weights)
    
    print(f"\n📈 Test Portfolio Allocation:")
    for ticker, weight in zip(model.tickers, test_weights):
        print(f"   {ticker:<15} {weight:.2%}")
    
    print(f"\n📊 Expected Performance:")
    print(f"   Return: {test_metrics['expected_return']:.2%}")
    print(f"   Risk:   {test_metrics['volatility']:.2%}")
    print(f"   Sharpe: {test_metrics['sharpe_ratio']:.3f}")
    
    print("\n✅ Enhanced model is ready to use!")
    print("🎯 The model supports these tickers:")
    for ticker in model.tickers:
        print(f"   - {ticker}")
