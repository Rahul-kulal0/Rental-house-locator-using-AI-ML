import pickle
import numpy as np
import pandas as pd

# Load model
print("=== Loading Trained Model ===")
try:
    model = pickle.load(open("model.pkl", "rb"))
    print("✅ Model loaded successfully")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    exit(1)

# Load dataset for comparison
print("\n=== Loading Dataset for Comparison ===")
df = pd.read_csv('cleaned_dataset.csv')
print(f"Dataset contains {len(df)} properties")

# Show dataset statistics
print("\n=== Dataset Statistics ===")
print(f"House Size Range: {df['house_size'].min():.0f} - {df['house_size'].max():.0f} sqft")
print(f"Bathrooms Range: {df['numBathrooms'].min():.0f} - {df['numBathrooms'].max():.0f}")
print(f"Balconies Range: {df['numBalconies'].min():.0f} - {df['numBalconies'].max():.0f}")
print(f"Price/SqFt Range: ₹{df['priceSqFt'].min():.0f} - ₹{df['priceSqFt'].max():.0f}")
print(f"Monthly Rent Range: ₹{df['price'].min():,.0f} - ₹{df['price'].max():,.0f}")

# Test predictions with realistic scenarios from Delhi rental market
print("\n=== Testing Price Predictions ===\n")

test_cases = [
    {
        "name": "Small Studio Apartment (1 RK)",
        "features": {"house_size": 400, "numBathrooms": 1, "numBalconies": 0, "priceSqFt": 45},
        "expected_range": "₹15,000 - ₹25,000"
    },
    {
        "name": "1 BHK Apartment",
        "features": {"house_size": 550, "numBathrooms": 1, "numBalconies": 1, "priceSqFt": 40},
        "expected_range": "₹18,000 - ₹28,000"
    },
    {
        "name": "2 BHK Mid-Size Flat",
        "features": {"house_size": 750, "numBathrooms": 2, "numBalconies": 1, "priceSqFt": 35},
        "expected_range": "₹22,000 - ₹35,000"
    },
    {
        "name": "3 BHK Family Home",
        "features": {"house_size": 1200, "numBathrooms": 2, "numBalconies": 2, "priceSqFt": 30},
        "expected_range": "₹30,000 - ₹50,000"
    },
    {
        "name": "Luxury 4 BHK",
        "features": {"house_size": 2000, "numBathrooms": 3, "numBalconies": 2, "priceSqFt": 45},
        "expected_range": "₹70,000 - ₹1,20,000"
    }
]

# Make predictions for each test case
all_predictions = []
for i, test in enumerate(test_cases, 1):
    features = test["features"]
    X = np.array([[
        features["house_size"],
        features["numBathrooms"],
        features["numBalconies"],
        features["priceSqFt"]
    ]])
    
    predicted_price = model.predict(X)[0]
    all_predictions.append(predicted_price)
    
    print(f"{i}. {test['name']}")
    print(f"   Features: {features['house_size']} sqft, {features['numBathrooms']} bath, {features['numBalconies']} balcony, ₹{features['priceSqFt']}/sqft")
    print(f"   Predicted Rent: ₹{predicted_price:,.0f}/month")
    print(f"   Expected Range: {test['expected_range']}")
    
    # Check if prediction is reasonable
    actual_comparable = df[
        (df['house_size'] >= features['house_size'] * 0.9) & 
        (df['house_size'] <= features['house_size'] * 1.1) &
        (df['priceSqFt'] >= features['priceSqFt'] * 0.8) &
        (df['priceSqFt'] <= features['priceSqFt'] * 1.2)
    ]
    
    if len(actual_comparable) > 0:
        avg_actual_price = actual_comparable['price'].mean()
        deviation = ((predicted_price - avg_actual_price) / avg_actual_price) * 100
        print(f"   Dataset Average: ₹{avg_actual_price:,.0f}/month (based on {len(actual_comparable)} similar properties)")
        print(f"   Deviation: {deviation:+.1f}%")
        
        if abs(deviation) < 20:
            print(f"   ✅ Prediction is ACCURATE (within 20% of dataset)")
        elif abs(deviation) < 30:
            print(f"   ⚠️  Prediction is REASONABLE (within 30% of dataset)")
        else:
            print(f"   ❌ Prediction needs review (>30% deviation)")
    else:
        print(f"   ℹ️  No exact matches in dataset for comparison")
    
    print()

# Summary statistics
print("\n=== Prediction Summary ===")
print(f"Total test cases: {len(test_cases)}")
print(f"Predictions range: ₹{min(all_predictions):,.0f} - ₹{max(all_predictions):,.0f}")
print(f"Average prediction: ₹{np.mean(all_predictions):,.0f}")

# Feature importance
print("\n=== Model Feature Importance ===")
feature_names = ["house_size", "numBathrooms", "numBalconies", "priceSqFt"]
importance = model.feature_importances_
for feat, imp in sorted(zip(feature_names, importance), key=lambda x: x[1], reverse=True):
    print(f"  {feat}: {imp*100:.1f}%")

print("\n=== Validation Complete ===")
print("The model predictions are based on actual Delhi rental market data.")
print("Predictions should be within ±20% of comparable properties in the dataset.")
