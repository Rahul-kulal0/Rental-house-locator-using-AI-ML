import pickle
import sys
import numpy as np
import os

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "model.pkl")

# Load model
try:
    model = pickle.load(open(model_path, "rb"))
    print("Model loaded successfully", file=sys.stderr)
except Exception as e:
    print(f"Error loading model: {e}", file=sys.stderr)
    sys.exit(1)

# Input from backend
try:
    house_size = float(sys.argv[1])
    numBathrooms = float(sys.argv[2])
    numBalconies = float(sys.argv[3])
    priceSqFt = float(sys.argv[4])
    print(f"Input features: house_size={house_size}, numBathrooms={numBathrooms}, numBalconies={numBalconies}, priceSqFt={priceSqFt}", file=sys.stderr)
except (IndexError, ValueError) as e:
    print(f"Invalid input arguments: {e}", file=sys.stderr)
    sys.exit(1)

# Validate inputs
if house_size <= 0:
    print("Error: house_size must be positive", file=sys.stderr)
    sys.exit(1)

if numBathrooms < 0:
    print("Error: numBathrooms cannot be negative", file=sys.stderr)
    sys.exit(1)

if numBalconies < 0:
    print("Error: numBalconies cannot be negative", file=sys.stderr)
    sys.exit(1)

# If priceSqFt is 0 or negative, use dataset-based defaults
if priceSqFt <= 0:
    # Use a reasonable default based on Delhi rental market analysis
    # This is calculated from the actual dataset median
    if house_size <= 500:
        priceSqFt = 45.0  # Studio/1BHK
    elif house_size <= 800:
        priceSqFt = 35.0  # 2BHK
    elif house_size <= 1500:
        priceSqFt = 30.0  # 3BHK
    else:
        priceSqFt = 40.0  # 4BHK+
    print(f"Using default priceSqFt: {priceSqFt} based on house_size: {house_size}", file=sys.stderr)

# Prepare input for model
X = np.array([[house_size, numBathrooms, numBalconies, priceSqFt]])

# Make prediction
predicted_price = model.predict(X)

# Ensure prediction is reasonable (not negative)
final_price = max(0, predicted_price[0])

print(round(final_price, 2))
