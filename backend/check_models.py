#!/usr/bin/env python3
"""
Quick diagnostic script to check model files
"""

import os
import joblib

print("🔍 Model File Diagnostic")
print("=" * 60)

# Check current directory
print(f"\n📂 Current directory: {os.getcwd()}")

# Check for model files
files_to_check = [
    'portfolio_allocator_rf.pkl',
    'enhanced_portfolio_model.pkl'
]

print("\n📋 Checking model files:")
for filename in files_to_check:
    if os.path.exists(filename):
        size = os.path.getsize(filename)
        print(f"\n✅ {filename}")
        print(f"   Size: {size:,} bytes ({size/1024/1024:.2f} MB)")
        
        # Try to load it
        try:
            if filename == 'enhanced_portfolio_model.pkl':
                data = joblib.load(filename)
                print(f"   Type: Enhanced model")
                print(f"   Tickers: {data.get('tickers', 'N/A')}")
                print(f"   Features: {len(data.get('feature_names', []))}")
            else:
                model = joblib.load(filename)
                print(f"   Type: Basic RandomForest model")
                print(f"   Loaded successfully: ✅")
        except Exception as e:
            print(f"   ❌ Error loading: {e}")
    else:
        print(f"\n❌ {filename}")
        print(f"   Status: NOT FOUND")
        if filename == 'enhanced_portfolio_model.pkl':
            print(f"   💡 Run: python train_enhanced_model.py")

print("\n" + "=" * 60)
print("\n💡 Recommendations:")


    
if not os.path.exists('enhanced_portfolio_model.pkl'):
    print("   ⚠️  Enhanced model missing - run: python train_enhanced_model.py")
    
if os.path.exists('portfolio_allocator_rf.pkl') and os.path.exists('enhanced_portfolio_model.pkl'):
    print("   ✅ All models present - app should work correctly!")

print("\n" + "=" * 60)
