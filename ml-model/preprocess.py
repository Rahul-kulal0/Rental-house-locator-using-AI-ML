import pandas as pd
import numpy as np

# Load dataset
df = pd.read_csv("Indian_housing_Delhi_data.csv")
print("Original shape:", df.shape)

# ------------ 1. Remove duplicates ------------
df.drop_duplicates(inplace=True)

# ------------ 2. Clean price column ------------
def clean_price(val):
    try:
        v = str(val).replace(",", "").replace("₹", "").strip()
        return float(v)
    except:
        return np.nan

df["price"] = df["price"].apply(clean_price)

# ------------ 3. Clean house_size (sqft) ------------
def clean_size(val):
    try:
        v = str(val).replace(",", "").replace("sqft", "").strip()
        return float(v)
    except:
        return np.nan

df["house_size"] = df["house_size"].apply(clean_size)

# ------------ 4. Standardize house_type ------------
df["house_type"] = df["house_type"].str.strip().str.title()

# ------------ 5. Standardize location & city ------------
df["location"] = df["location"].str.strip().str.title()
df["city"] = df["city"].str.strip().str.title()

# ------------ 6. Convert bool columns ------------
df["isNegotiable"] = df["isNegotiable"].astype(str).str.lower().map({
    "true": True, "false": False
})

# ------------ 7. Convert numeric columns ------------
num_cols = ["numBathrooms", "numBalconies", "priceSqFt", "SecurityDeposit"]
for col in num_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# ------------ 8. Calculate priceSqFt where missing ------------
# Calculate price per sqft where we have both price and house_size
mask = (df["price"].notnull()) & (df["house_size"].notnull()) & (df["house_size"] > 0)
df.loc[mask, "calculated_priceSqFt"] = df.loc[mask, "price"] / df.loc[mask, "house_size"]

# Fill missing priceSqFt with calculated values where possible
df["priceSqFt"].fillna(df["calculated_priceSqFt"], inplace=True)

# ------------ 9. Handle remaining missing values ------------
df["price"].fillna(df["price"].median(), inplace=True)
df["house_size"].fillna(df["house_size"].median(), inplace=True)
df["numBathrooms"].fillna(df["numBathrooms"].median(), inplace=True)
df["numBalconies"].fillna(0, inplace=True)
df["priceSqFt"].fillna(df["priceSqFt"].median(), inplace=True)

# Remove the temporary calculated column
df.drop(columns=["calculated_priceSqFt"], inplace=True, errors="ignore")

# ------------ 10. Drop useless columns (optional) ------------
df.drop(columns=["currency", "verificationDate", "Status"], inplace=True, errors="ignore")

# ------------10. Reset Index ------------
df.reset_index(drop=True, inplace=True)

# ------------11. Save cleaned file ------------
df.to_csv("cleaned_dataset.csv", index=False)

print("Cleaned shape:", df.shape)
print("Saved cleaned_dataset.csv successfully!")
