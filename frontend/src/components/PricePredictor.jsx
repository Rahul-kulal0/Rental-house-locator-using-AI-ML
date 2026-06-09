import { useState } from "react";
import api from "../utils/axios";

export default function PricePredictor() {
  const [form, setForm] = useState({
    bedrooms: "",
    house_size: "",
    numBathrooms: "",
    priceSqFt: ""
  });
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    setLoading(true);
    try {
      // Validate inputs
      if (!form.bedrooms || !form.house_size || !form.numBathrooms) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Parse and validate values
      const bedrooms = parseInt(form.bedrooms);
      const houseSize = parseFloat(form.house_size);
      const numBathrooms = parseInt(form.numBathrooms);
      let pricePerSqFt = parseFloat(form.priceSqFt);

      // Validate bedrooms (typical: 1-5 BHK)
      if (bedrooms < 1 || bedrooms > 5) {
        alert("Bedrooms should be between 1 and 5 (1BHK to 5BHK)");
        setLoading(false);
        return;
      }

      // Validate house size based on bedrooms
      const minSizeForBedrooms = bedrooms * 350; // Minimum 350 sqft per bedroom
      const maxSizeForBedrooms = bedrooms * 800; // Maximum 800 sqft per bedroom
      
      if (houseSize < minSizeForBedrooms || houseSize > maxSizeForBedrooms) {
        alert(`For ${bedrooms} BHK, house size should typically be between ${minSizeForBedrooms}-${maxSizeForBedrooms} sqft`);
        setLoading(false);
        return;
      }

      // If priceSqFt not provided, calculate based on typical Delhi rates from dataset
      // Dataset analysis shows priceSqFt typically ranges from 15-100 Rs/sqft
      if (!pricePerSqFt || pricePerSqFt <= 0) {
        // Calculate estimated priceSqFt based on house size and location tier
        // Smaller houses typically have higher price per sqft
        if (houseSize <= 500) {
          pricePerSqFt = 45; // Studio/1BHK
        } else if (houseSize <= 800) {
          pricePerSqFt = 35; // 2BHK
        } else if (houseSize <= 1500) {
          pricePerSqFt = 30; // 3BHK
        } else {
          pricePerSqFt = 40; // Larger properties
        }
      }

      // Prepare payload - balconies removed, using 0 as placeholder for model compatibility
      const numBalconies = 0; // Balconies not used in prediction

      const predictionData = {
        house_size: houseSize,
        numBathrooms: numBathrooms,
        numBalconies: numBalconies,
        priceSqFt: pricePerSqFt
      };

      console.log("Sending prediction request:", predictionData);
      const res = await api.post("/price/predict", predictionData);
      
      const predictedPrice = parseFloat(res.data.predictedPrice);
      
      // Validate prediction is reasonable (dataset range: 5000-250000 Rs/month)
      if (predictedPrice < 1000 || predictedPrice > 500000) {
        alert("Warning: Prediction may be outside normal range. Please verify inputs.");
      }
      
      setPrice(predictedPrice);
    } catch (error) {
      console.error("Prediction error:", error);
      console.error("Error response:", error.response?.data);
      const errorMsg = error.response?.data?.error || error.message || "Failed to predict price. Please try again.";
      alert(`Prediction Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-8 mt-10 animate-slide-up">
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🤖</div>
        <h2 className="text-3xl font-bold text-gradient mb-2">
          AI Rent Price Predictor
        </h2>
        <p className="text-gray-600">Powered by Random Forest Algorithm</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="form-group">
          <label className="form-label">🛏️ Bedrooms (BHK)</label>
          <input 
            type="number"
            className="input" 
            placeholder="e.g., 2 for 2BHK"
            value={form.bedrooms}
            onChange={e=>setForm({...form, bedrooms:e.target.value})} 
          />
          <small className="text-gray-500 text-xs mt-1">Typical: 1-5 BHK</small>
        </div>

        <div className="form-group">
          <label className="form-label">📏 House Size (Square Feet)</label>
          <input 
            type="number"
            className="input" 
            placeholder="e.g., 750 for 750 sqft"
            value={form.house_size}
            onChange={e=>setForm({...form, house_size:e.target.value})} 
          />
          <small className="text-gray-500 text-xs mt-1">Typical range: 400-2500 sqft</small>
        </div>

        <div className="form-group">
          <label className="form-label">🛁 Bathrooms</label>
          <input 
            type="number"
            className="input" 
            placeholder="Number of bathrooms"
            value={form.numBathrooms}
            onChange={e=>setForm({...form, numBathrooms:e.target.value})} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">🌅 Balconies</label>
          <input 
            type="number"
            className="input" 
            placeholder="Number of balconies"
            value={form.numBalconies}
            onChange={e=>setForm({...form, numBalconies:e.target.value})} 
          />
        </div>

        <div className="form-group">
          <label className="form-label">💰 Price per SqFt (Optional)</label>
          <input 
            type="number"
            className="input" 
            placeholder="e.g., 35 (Rs/sqft)"
            value={form.priceSqFt}
            onChange={e=>setForm({...form, priceSqFt:e.target.value})} 
          />
          <small className="text-gray-500 text-xs mt-1">Typical: 15-100 Rs/sqft in Delhi</small>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          💡 <strong>Prediction Factors:</strong> Bedrooms, House Size, Bathrooms, and Price per SqFt
        </p>
      </div>

      <button 
        onClick={predict}
        disabled={loading}
        className="btn-primary w-full mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
            Calculating...
          </span>
        ) : (
          "🔮 Predict Rent Price"
        )}
      </button>

      {price && (
        <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl animate-scale-in">
          <p className="text-center text-gray-600 text-sm mb-2">Estimated Monthly Rent</p>
          <p className="text-center text-4xl font-extrabold text-green-600">
            ₹ {parseInt(price).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
