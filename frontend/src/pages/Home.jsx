import { useEffect, useState } from "react";
import axios from "axios";
import HouseCard from "../components/HouseCard";
import Filters from "../components/Filters";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/houses/paginate?page=1&limit=20");
      setHouses(response.data.data);
    } catch (error) {
      console.error("Error fetching houses:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = async (filters) => {
    setLoading(true);
    let url = "http://localhost:5000/api/houses/filter?";

    if (filters.city) url += `city=${filters.city}&`;
    if (filters.minPrice) url += `minPrice=${filters.minPrice}&`;
    if (filters.maxPrice) url += `maxPrice=${filters.maxPrice}&`;
    if (filters.numBathrooms) url += `numBathrooms=${filters.numBathrooms}&`;

    try {
      const response = await axios.get(url);
      setHouses(response.data.data);
    } catch (error) {
      console.error("Error applying filters:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-16 px-6 animate-fade-in">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-shadow-lg animate-slide-up">
            Find Your Dream Home 🏡
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 animate-slide-up">
            Discover thousands of rental properties at the best prices
          </p>
          <SearchBar />
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-10">
        <Filters onFilter={applyFilter} />

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 animate-slide-up">
          <div className="card text-center p-6 hover-lift">
            <div className="text-4xl mb-3">🏘️</div>
            <h3 className="text-3xl font-bold text-primary-600">{houses.length}+</h3>
            <p className="text-gray-600 font-medium">Properties Available</p>
          </div>
          <div className="card text-center p-6 hover-lift">
            <div className="text-4xl mb-3">📍</div>
            <h3 className="text-3xl font-bold text-primary-600">50+</h3>
            <p className="text-gray-600 font-medium">Cities Covered</p>
          </div>
          <div className="card text-center p-6 hover-lift">
            <div className="text-4xl mb-3">⭐</div>
            <h3 className="text-3xl font-bold text-primary-600">100%</h3>
            <p className="text-gray-600 font-medium">Verified Listings</p>
          </div>
        </div>

        {/* Houses Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="loading-spinner mb-4"></div>
            <h2 className="text-xl text-gray-600 font-medium">Loading amazing homes...</h2>
          </div>
        ) : houses.length > 0 ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              🏠 Available Properties
              <span className="text-lg font-normal text-gray-500">({houses.length} found)</span>
            </h2>
            <div className="house-grid">
              {houses.map((house) => (
                <HouseCard key={house._id} house={house} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">No properties found</h2>
            <p className="text-gray-500">Try adjusting your filters or search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
