import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv("ml-model/Indian_housing_Delhi_data.csv")
print("Original shape:", df.shape)

# ------------ 1. Remove duplicates ------------
df.drop_duplicates(inplace=True)
print("After removing duplicates:", df.shape)

# ------------ 2. Clean price column ------------
def clean_price(val):
    try:
        v = str(val).replace(",", "").replace("₹", "").strip()
        return float(v)
    except:
        return np.nan

df["price"] = df["price"].apply(clean_price)
print("Price column - Non-null values:", df["price"].notnull().sum())

# ------------ 3. Clean house_size (sqft) ------------
def clean_size(val):
    try:
        v = str(val).replace(",", "").replace("sqft", "").strip()
        return float(v)
    except:
        return np.nan

df["house_size"] = df["house_size"].apply(clean_size)
print("House_size column - Non-null values:", df["house_size"].notnull().sum())

# ------------ 4. Check priceSqFt column ------------
print("Original priceSqFt column - Non-null values:", df["priceSqFt"].notnull().sum())

# ------------ 5. Convert numeric columns ------------
num_cols = ["numBathrooms", "numBalconies", "priceSqFt", "SecurityDeposit"]
for col in num_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

print("After converting to numeric - priceSqFt non-null values:", df["priceSqFt"].notnull().sum())

# ------------ 6. Calculate priceSqFt where missing ------------
# Calculate price per sqft where we have both price and house_size
mask = (df["price"].notnull()) & (df["house_size"].notnull()) & (df["house_size"] > 0)
print("Rows with both price and house_size:", mask.sum())

if mask.sum() > 0:
    df.loc[mask, "calculated_priceSqFt"] = df.loc[mask, "price"] / df.loc[mask, "house_size"]
    print("Calculated priceSqFt values:", df.loc[mask, "calculated_priceSqFt"].describe())
    
    # Fill missing priceSqFt with calculated values where possible
    df["priceSqFt"].fillna(df["calculated_priceSqFt"], inplace=True)
    print("After filling - priceSqFt non-null values:", df["priceSqFt"].notnull().sum())

# Show some statistics
print("\nFinal priceSqFt statistics:")
print(df["priceSqFt"].describe())