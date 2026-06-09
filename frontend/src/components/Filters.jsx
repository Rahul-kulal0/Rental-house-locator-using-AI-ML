import { useState } from "react";

export default function Filters({ onFilter }) {
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [numBathrooms, setNumBathrooms] = useState("");

  const applyFilters = () => {
    onFilter({ city, minPrice, maxPrice, numBathrooms });
  };

  const clearFilters = () => {
    setCity("");
    setMinPrice("");
    setMaxPrice("");
    setNumBathrooms("");
    onFilter({ city: "", minPrice: "", maxPrice: "", numBathrooms: "" });
  };

  return (
    <div className="card mb-8 animate-slide-up">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🔍 Filters
          </h2>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-primary-600 transition-colors font-medium"
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="form-group">
            <label className="form-label text-sm">🏛️ City</label>
            <input
              type="text"
              placeholder="Enter city name"
              className="input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label text-sm">💵 Min Price</label>
            <input
              type="number"
              placeholder="Min ₹"
              className="input"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label text-sm">💰 Max Price</label>
            <input
              type="number"
              placeholder="Max ₹"
              className="input"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label text-sm">🛁 Bathrooms</label>
            <select
              className="input cursor-pointer"
              value={numBathrooms}
              onChange={(e) => setNumBathrooms(e.target.value)}
            >
              <option value="">Any</option>
              <option value="1">1 Bathroom</option>
              <option value="2">2 Bathrooms</option>
              <option value="3">3+ Bathrooms</option>
            </select>
          </div>

        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={applyFilters}
            className="btn-primary flex-1 md:flex-none"
          >
            🔍 Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="btn-secondary flex-1 md:flex-none"
          >
            ✖ Clear
          </button>
        </div>
      </div>
    </div>
  );
}
