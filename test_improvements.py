import pandas as pd
import pickle
import numpy as np
import os

# Load the cleaned dataset
df = pd.read_csv('ml-model/cleaned_dataset.csv')

print("=== Dataset Analysis After Improvements ===")
print(f"Total rows: {len(df)}")

# Check how many priceSqFt values were filled
missing_priceSqFt = df['priceSqFt'].isnull().sum()
zero_priceSqFt = (df['priceSqFt'] == 0).sum()

print(f"Missing priceSqFt values: {missing_priceSqFt}")
print(f"Zero priceSqFt values: {zero_priceSqFt}")
print(f"Total invalid priceSqFt values: {missing_priceSqFt + zero_priceSqFt}")

# Show some statistics
print(f"\nPriceSqFt statistics:")
print(f"  Mean: {df['priceSqFt'].mean():.2f}")
print(f"  Median: {df['priceSqFt'].median():.2f}")
print(f"  Min: {df['priceSqFt'].min():.2f}")
print(f"  Max: {df['priceSqFt'].max():.2f}")

# Test the prediction with sample data
print("\n=== Testing Prediction ===")

# Load the trained model
model_path = os.path.join('ml-model', 'model.pkl')
try:
    model = pickle.load(open(model_path, "rb"))
    print("Model loaded successfully")
    
    # Test prediction with sample data
    # house_size, numBathrooms, numBalconies, priceSqFt
    sample_input = np.array([[1000, 2, 1, 50]])  # 1000 sqft, 2 bathrooms, 1 balcony, Rs 50/sqft
    predicted_price = model.predict(sample_input)
    print(f"Sample prediction - House (1000 sqft, 2 bath, 1 balcony, Rs 50/sqft): Rs {predicted_price[0]:.2f}")
    
    # Test with a zero priceSqFt (should use our default)
    sample_input_zero = np.array([[1000, 2, 1, 0]])  # 1000 sqft, 2 bathrooms, 1 balcony, 0 priceSqFt
    predicted_price_zero = model.predict(sample_input_zero)
    print(f"Sample prediction - House (1000 sqft, 2 bath, 1 balcony, 0 priceSqFt): Rs {predicted_price_zero[0]:.2f}")
    
except Exception as e:
    print(f"Error loading model or making prediction: {e}")

print("\n=== Summary of Improvements ===")
print("1. Preprocessing now calculates priceSqFt from price and house_size where missing")
print("2. Prediction script handles zero/negative priceSqFt values with reasonable defaults")
print("3. Model should now have more complete data for training")
print("4. Predictions should be more accurate with better data quality")