import { useState, useEffect } from "react";
import axios from "../utils/axios";
import HouseCard from "../components/HouseCard";
import LoadingSkeleton from "../components/LoadingSkeleton";

const DatasetHouses = () => {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    city: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    bhk: "",
  });

  useEffect(() => {
    fetchStats();
    fetchHouses();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/houses/dataset/stats");
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchHouses = async (filterParams = {}) => {
    try {
      setLoading(true);
      const response = await axios.get("/api/houses/dataset", {
        params: filterParams,
      });
      if (response.data.success) {
        setHouses(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching houses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    const activeFilters = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        activeFilters[key] = filters[key];
      }
    });
    fetchHouses(activeFilters);
  };

  const resetFilters = () => {
    setFilters({
      city: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      bhk: "",
    });
    fetchHouses();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            🏠 ML Dataset Houses
          </h1>
          <p className="text-lg opacity-90">
            Browse houses from our comprehensive machine learning dataset
          </p>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="max-w-7xl mx-auto px-6 -mt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="card glass text-center">
              <h3 className="text-3xl font-extrabold text-primary-600">
                {stats.totalHouses.toLocaleString()}
              </h3>
              <p className="text-gray-600 font-medium mt-1">Total Houses</p>
            </div>
            <div className="card glass text-center">
              <h3 className="text-3xl font-extrabold text-secondary-600">
                {Object.keys(stats.cities).length}
              </h3>
              <p className="text-gray-600 font-medium mt-1">Cities</p>
            </div>
            <div className="card glass text-center">
              <h3 className="text-3xl font-extrabold text-accent-600">
                ₹{stats.avgPrice.toLocaleString()}
              </h3>
              <p className="text-gray-600 font-medium mt-1">Avg Price</p>
            </div>
            <div className="card glass text-center">
              <h3 className="text-3xl font-extrabold text-green-600">
                {Object.keys(stats.houseTypes).length}
              </h3>
              <p className="text-gray-600 font-medium mt-1">House Types</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 p-6 mt-6">
        {/* Filters Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <div className="card sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Search Filters</h2>

            <div className="space-y-3">
              <input
                type="text"
                name="city"
                placeholder="City (e.g., Delhi, Mumbai)"
                className="input-field"
                value={filters.city}
                onChange={handleFilterChange}
              />

              <input
                type="text"
                name="location"
                placeholder="Location/Area"
                className="input-field"
                value={filters.location}
                onChange={handleFilterChange}
              />

              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                className="input-field"
                value={filters.minPrice}
                onChange={handleFilterChange}
              />

              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                className="input-field"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />

              <input
                type="text"
                name="bhk"
                placeholder="BHK (e.g., 2, 3)"
                className="input-field"
                value={filters.bhk}
                onChange={handleFilterChange}
              />

              <div className="flex gap-3 mt-4">
                <button onClick={applyFilters} className="btn-primary flex-1">
                  Apply
                </button>
                <button onClick={resetFilters} className="btn-secondary flex-1">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Houses Grid */}
        <main className="col-span-12 md:col-span-9">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {houses.length > 0
                ? `Showing ${houses.length} houses`
                : "No houses found"}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : houses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {houses.map((house, index) => (
                <div
                  key={index}
                  className="card card-hover animate-fade-in"
                >
                  <div className="h-56 overflow-hidden rounded-t-2xl relative bg-gradient-to-br from-primary-100 to-secondary-100">
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">🏠</span>
                    </div>
                    {house.isVerified && (
                      <span className="absolute top-3 right-3 badge badge-success shadow-md">
                        ✔ Verified
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-gray-800 hover:text-primary-600 transition-colors">
                        {house.location}
                      </h3>
                    </div>

                    <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
                      📍 {house.city}
                    </p>

                    <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          {house.house_type}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          🛁 {house.numBathrooms} Bathrooms
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          📐 {house.house_size} sqft
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-primary-600 font-extrabold text-xl">
                          ₹{house.price.toLocaleString()}
                        </div>
                        {house.isNegotiable && (
                          <span className="badge badge-warning text-xs mt-1">
                            Negotiable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                No houses found
              </h3>
              <p className="text-gray-500">
                Try adjusting your filters to see more results
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DatasetHouses;
