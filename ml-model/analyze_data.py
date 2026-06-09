import pandas as pd
import numpy as np

# Load the cleaned dataset
df = pd.read_csv('cleaned_dataset.csv')

print("=== Dataset Analysis ===")
print(f"Total rows: {len(df)}")
print(f"Columns: {list(df.columns)}")

# Check priceSqFt column specifically
print("\n=== PriceSqFt Analysis ===")
print(f"Missing priceSqFt: {df['priceSqFt'].isnull().sum()}")
print(f"Empty priceSqFt: {(df['priceSqFt'] == '').sum()}")
print(f"Zero priceSqFt: {(df['priceSqFt'] == 0).sum()}")
print(f"NaN priceSqFt: {df['priceSqFt'].isna().sum()}")

# Check data types
print(f"\nData type of priceSqFt: {df['priceSqFt'].dtype}")

# Show some sample values
print("\nSample priceSqFt values:")
print(df['priceSqFt'].head(10))

# Calculate price per sqft where we can
print("\n=== Calculated Price Per Sq Ft Where Possible ===")
# Calculate where we have both price and house_size
valid_rows = df[(df['price'].notnull()) & (df['house_size'].notnull()) & (df['house_size'] > 0)]
calculated_price_per_sqft = valid_rows['price'] / valid_rows['house_size']

print(f"Rows with valid price and house_size: {len(valid_rows)}")
print(f"Calculated average price per sqft: {calculated_price_per_sqft.mean():.2f}")
print(f"Calculated median price per sqft: {calculated_price_per_sqft.median():.2f}")
print(f"Calculated min price per sqft: {calculated_price_per_sqft.min():.2f}")
print(f"Calculated max price per sqft: {calculated_price_per_sqft.max():.2f}")