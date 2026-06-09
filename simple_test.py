import pandas as pd

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

print("\n=== Summary of Improvements ===")
print("1. Preprocessing now calculates priceSqFt from price and house_size where missing")
print("2. Prediction script handles zero/negative priceSqFt values with reasonable defaults")
print("3. Model should now have more complete data for training")
print("4. Predictions should be more accurate with better data quality")