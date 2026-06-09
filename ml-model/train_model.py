import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import numpy as np
import sys

# Load dataset
df = pd.read_csv("cleaned_dataset.csv")

print("=== Training Data Analysis ===")
print(f"Total rows: {len(df)}")
print(f"Columns: {df.columns.tolist()}")

# Check data types and convert if necessary
df['house_size'] = pd.to_numeric(df['house_size'], errors='coerce')
df['numBathrooms'] = pd.to_numeric(df['numBathrooms'], errors='coerce')
df['numBalconies'] = pd.to_numeric(df['numBalconies'], errors='coerce')
df['price'] = pd.to_numeric(df['price'], errors='coerce')
df['priceSqFt'] = pd.to_numeric(df['priceSqFt'], errors='coerce')

print(f"\nMissing values before cleaning:")
print(df[['house_size', 'numBathrooms', 'numBalconies', 'price', 'priceSqFt']].isnull().sum())

# Fill missing values with median for numeric columns
for col in ['house_size', 'numBathrooms', 'numBalconies', 'priceSqFt']:
    median_val = df[df[col].notna()][col].median()
    print(f"\n{col} median: {median_val}")
    df[col] = df[col].fillna(median_val)

# For price, we need to calculate it if missing
if df['price'].isnull().any():
    print("\nCalculating missing prices...")
    mask = df['price'].isnull() & (df['house_size'] > 0) & (df['priceSqFt'] > 0)
    df.loc[mask, 'price'] = df.loc[mask, 'house_size'] * df.loc[mask, 'priceSqFt']
    # Fill remaining with median
    df['price'] = df['price'].fillna(df['price'].median())

# Remove invalid rows
df = df[df['house_size'] > 0]
df = df[df['price'] > 0]
df = df[df['priceSqFt'] > 0]

print(f"\nRows after cleaning: {len(df)}")

# Select important features
features = [
    "house_size",
    "numBathrooms",
    "numBalconies",
    "priceSqFt"
]

X = df[features]
y = df["price"]

print(f"\nFeature Statistics:")
print(X.describe())
print(f"\nPrice Statistics:")
print(y.describe())

# Train-test split
if len(X) < 10:
    print("ERROR: Not enough data for training!")
    sys.exit(1)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Random Forest Model with better parameters
model = RandomForestRegressor(
    n_estimators=300,
    max_depth=20,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Evaluate model
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
