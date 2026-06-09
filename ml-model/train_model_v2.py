import pandas as pd
import re
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import numpy as np

# Load dataset
df = pd.read_csv("cleaned_dataset.csv")

print("=== Dataset Preprocessing ===")
print(f"Total rows: {len(df)}")

# Extract house_size from description if not available
def extract_house_size(row):
    # First try the house_size column
    if pd.notna(row['house_size']) and row['house_size'] != '':
        try:
            return float(row['house_size'])
        except:
            pass
    
    # Try to extract from description
    desc = str(row['description']) if pd.notna(row['description']) else ""
    
    # Look for patterns like "400 Square feet", "1200 sqft", "850 sq. ft."
    patterns = [
        r'(\d+)\s*(?:square\s*feet|sq\.?\s*feet|sqft|sq\.?\s*ft|sft)',
        r'area\s+of\s+(\d+)\s*(?:sqft|sq\.?\s*feet)?',
        r'(\d+)\s*sq\.?m\.',
        r'built-up\s+area\s+is\s+(\d+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, desc, re.IGNORECASE)
        if match:
            size = float(match.group(1))
            # Convert if in square meters (assuming > 200 means sq meters)
            if size < 200:  # Likely in square meters
                size = size * 10.764  # Convert to sq feet
            return size
    
    return None

# Extract price per sqft if not available
def calc_price_sqft(row):
    if pd.notna(row['priceSqFt']) and row['priceSqFt'] != '' and row['priceSqFt'] > 0:
        try:
            return float(row['priceSqFt'])
        except:
            pass
    
    # Calculate from price and house_size
    if row['house_size_extracted'] and row['price'] > 0:
        return row['price'] / row['house_size_extracted']
    
    return None

# Extract house size for all rows
print("\nExtracting house sizes from descriptions...")
df['house_size_extracted'] = df.apply(extract_house_size, axis=1)

# Use extracted house_size where original is missing
mask = df['house_size_extracted'].notna()
print(f"Found {mask.sum()} valid house sizes")

# Create cleaned dataframe
df_clean = df[mask].copy()
df_clean['house_size'] = df_clean['house_size_extracted']
df_clean['priceSqFt'] = df_clean.apply(calc_price_sqft, axis=1)

# Remove rows with invalid priceSqFt
df_clean = df_clean[df_clean['priceSqFt'].notna()]
df_clean = df_clean[df_clean['priceSqFt'] > 0]

print(f"Rows after cleaning: {len(df_clean)}")

if len(df_clean) < 100:
    print("ERROR: Not enough data!")
    exit(1)

# Select features
features = ["house_size", "numBathrooms", "numBalconies", "priceSqFt"]
X = df_clean[features]
y = df_clean["price"]

print(f"\nFeature Statistics:")
print(X.describe())
print(f"\nPrice Statistics:")
print(y.describe())

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Random Forest Model
model = RandomForestRegressor(
    n_estimators=300,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Evaluate
train_score = model.score(X_train, y_train)
test_score = model.score(X_test, y_test)

print(f"\n✅ Model Training Complete!")
print(f"Train R² Score: {train_score:.4f}")
print(f"Test R² Score: {test_score:.4f}")

# Feature importance
feature_importance = pd.DataFrame({
    'Feature': features,
    'Importance': model.feature_importances_
}).sort_values('Importance', ascending=False)

print(f"\nFeature Importance:")
print(feature_importance)

# Save model
with open("model.pkl", "wb") as f:
    pickle.dump(model, f)

print("\n✅ Random Forest model trained & saved successfully")
print(f"Trained on {len(df_clean)} samples")
