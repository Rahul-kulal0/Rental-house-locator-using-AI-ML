/*
Instructions to use this single-file React preview

1) Prereqs
   - Node 18+ and npm installed
   - You already created the frontend via Vite (or run: npm create vite@latest frontend --template react)

2) Install Tailwind (if not done):
   cd frontend
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

3) Tailwind config (tailwind.config.cjs)
   module.exports = {
     content: ["./index.html", "./src/***.{js,jsx}"],
     theme: { extend: {} },
     plugins: [],
   }

4) Create src/index.css and include:
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

5) Replace src/App.jsx with the component below (or create a new file and import it in main.jsx)

6) Run dev server:
   npm install
   npm run dev

This single-file React component is a complete frontend layout that matches the screenshot: left filter panel + right grid of house cards.
It fetches houses from http://localhost:5000/api/houses (fallback to sample data if API not available).

*/

import React, { useEffect, useState } from "react";
import "./index.css"; // make sure Tailwind is configured
import Navbar from "./components/Navbar";
import LoadingSkeleton from "./components/LoadingSkeleton";
import FeaturedBanner from "./components/FeaturedBanner";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HouseDetails from "./pages/HouseDetails";
import HousesMap from "./components/HousesMap";
import PricePredictor from "./components/PricePredictor";
import { Routes, Route, Navigate } from "react-router-dom";
import HouseCard from "./components/HouseCard";




function SearchBar({ onSearch }) {
  const [q, setQ] = useState("");
  
  const handleSearch = (value) => {
    setQ(value);
    onSearch(value);
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <div className="relative">
        <input
          value={q}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-3 pl-12 border rounded-xl shadow-sm focus:ring-2 ring-blue-400 transition-all"
          placeholder="Search location, city or house type..."
        />
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
          🔍
        </span>
        {q && (
          <button
            onClick={() => handleSearch("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

function Filters({ applyFilters }) {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bhk, setBhk] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [verified, setVerified] = useState(false);
  const [furnishing, setFurnishing] = useState("");

  const reset = () => {
    setCity("");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setBhk("");
    setBathrooms("");
    setNegotiable(false);
    setVerified(false);
    setFurnishing("");
    applyFilters({});
  };

  const send = () => {
    applyFilters({ city, location, minPrice, maxPrice, bhk, bathrooms, negotiable, verified, furnishing });
  };

  return (
    <div className="p-6 bg-white border rounded-xl shadow sticky top-6">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>

      <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City (e.g., Delhi)" className="w-full p-2 border rounded mb-3" />
      
      <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Location/Area" className="w-full p-2 border rounded mb-3" />

      <div className="flex gap-3 mb-3">
        <input value={minPrice} onChange={e=>setMinPrice(e.target.value)} type="number" placeholder="Min Price" className="w-1/2 p-2 border rounded" />
        <input value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} type="number" placeholder="Max Price" className="w-1/2 p-2 border rounded" />
      </div>

      <select value={bhk} onChange={e=>setBhk(e.target.value)} className="w-full p-2 border rounded mb-3">
        <option value="">Bedrooms (BHK)</option>
        <option value="1">1 BHK</option>
        <option value="2">2 BHK</option>
        <option value="3">3 BHK</option>
        <option value="4">4 BHK+</option>
      </select>

      <select value={bathrooms} onChange={e=>setBathrooms(e.target.value)} className="w-full p-2 border rounded mb-3">
        <option value="">Bathrooms</option>
        <option value="1">1+</option>
        <option value="2">2+</option>
        <option value="3">3+</option>
      </select>

      <label className="flex items-center gap-2 mb-3"><input type="checkbox" checked={negotiable} onChange={()=>setNegotiable(!negotiable)} /> Rent Negotiable</label>
      <label className="flex items-center gap-2 mb-3"><input type="checkbox" checked={verified} onChange={()=>setVerified(!verified)} /> Verified Only</label>

      <select value={furnishing} onChange={e=>setFurnishing(e.target.value)} className="w-full p-2 border rounded mb-3">
        <option value="">Furnishing</option>
        <option value="unfurnished">Unfurnished</option>
        <option value="semi">Semi-Furnished</option>
        <option value="full">Fully Furnished</option>
      </select>

      <div className="flex gap-3 mt-4">
        <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded shadow">Apply Filters</button>
        <button onClick={reset} className="bg-gray-200 px-4 py-2 rounded">Reset</button>
      </div>
    </div>
  );
}


export default function App() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "map"

  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  // Redirect to home if already logged in when accessing login/signup
  const AuthRoute = ({ children }) => {
    return !isAuthenticated() ? children : <Navigate to="/" />;
  };

  useEffect(() => {
    loadAll();
  }, [page, searchQuery]);


  async function loadAll() {
  setLoading(true);
  setError(null);
  try {
    // Build query params
    const params = new URLSearchParams();
    if (searchQuery) {
      params.append('location', searchQuery);
    }
    
    // Try to load from ML dataset first
    const res = await fetch(`http://localhost:5000/api/houses/dataset?${params.toString()}`);
    const data = await res.json();

    if (data?.data && data.data.length > 0) {
      // Paginate the dataset results manually
      const startIndex = (page - 1) * 12;
      const endIndex = startIndex + 12;
      const paginatedData = data.data.slice(startIndex, endIndex);
      setHouses(paginatedData);
      setTotalPages(Math.ceil(data.data.length / 12));
    } else {
      // Fallback to MongoDB houses
      const mongoRes = await fetch(`http://localhost:5000/api/houses/paginated?page=${page}&limit=12`);
      const mongoData = await mongoRes.json();
      if (mongoData?.data) {
        setHouses(mongoData.data);
        setTotalPages(mongoData.pagination.pages);
      } else {
        setHouses([]);
        setTotalPages(1);
      }
    }
  } catch (e) {
    console.error("Error loading houses:", e);
    setError(e.message);
    setHouses([]);
    setTotalPages(1);
  }
  setLoading(false);
}


  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  };

  const applyFilters = async (filters) => {
    const params = new URLSearchParams();
    for(const k in filters){ if(filters[k] !== "" && filters[k] !== false && filters[k] != null) params.append(k, filters[k]); }
    setLoading(true);
    try{
      // Use ML dataset API for filtering
      const res = await fetch(`http://localhost:5000/api/houses/dataset?${params.toString()}`);
      const data = await res.json();
      if(data?.data) {
        setHouses(data.data.slice(0, 50)); // Limit to first 50 results
        setPage(1);
        setTotalPages(Math.ceil(data.data.length / 12));
      }
    }catch(e){ 
      console.error(e); 
    }
    setLoading(false);
  };

return (
  <div className="min-h-screen bg-gray-50">
    <Navbar />

    <FeaturedBanner />

    <Routes>
      {/* LOGIN AS DEFAULT ROUTE */}
      <Route path="/" element={
        isAuthenticated() ? (
          <Navigate to="/home" />
        ) : (
          <Navigate to="/login" />
        )
      } />

      {/* HOME PAGE */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 p-6">

              {/* LEFT FILTERS */}
              <aside className="col-span-3">
                <Filters applyFilters={applyFilters} />
              </aside>

              {/* RIGHT CONTENT */}
              <main className="col-span-9">
                <h1 className="text-4xl font-extrabold mb-6">Rental Houses</h1>

                <SearchBar onSearch={handleSearch} />

                {/* Price Predictor Section */}
                <div className="mt-8">
                  <PricePredictor />
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mt-6">
                    Error loading houses: {error}
                  </div>
                )}

                {/* View Toggle Buttons */}
                <div className="flex justify-end mt-4">
                  <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                    >
                      Grid View
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("map")}
                      className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${viewMode === "map" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                    >
                      Map View
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                    <LoadingSkeleton />
                  </div>
                ) : houses.length === 0 ? (
                  <div className="text-center mt-10">
                    <h2 className="text-2xl font-semibold">No houses found</h2>
                    <p className="text-gray-600 mt-2">Try adjusting your search or filters</p>
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {houses.map((h, index) => (
                      <HouseCard key={h._id || h.id || `house-${index}-${h.location}-${h.price}`} house={h} />
                    ))}
                  </div>
                ) : (
                  <HousesMap houses={houses} />
                )}

                {/* PAGINATION */}
                {!loading && houses.length > 0 && viewMode === "grid" && (
                  <div className="flex justify-center items-center gap-4 mt-10">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className={`px-4 py-2 rounded border ${page === 1 ? "opacity-50" : "hover:bg-gray-200"}`}
                    >
                      ⬅ Previous
                    </button>

                    <span className="text-lg font-bold">
                      Page {page} / {totalPages}
                    </span>

                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className={`px-4 py-2 rounded border ${page === totalPages ? "opacity-50" : "hover:bg-gray-200"}`}
                    >
                      Next ➡
                    </button>
                  </div>
                )}

              </main>
            </div>
          </ProtectedRoute>
        }
      />

      {/* AUTH ROUTES */}
      <Route path="/login" element={
        <AuthRoute>
          <Login />
        </AuthRoute>
      } />
      <Route path="/signup" element={
        <AuthRoute>
          <Signup />
        </AuthRoute>
      } />
      <Route path="/house/:id" element={<ProtectedRoute><HouseDetails /></ProtectedRoute>} />
      <Route path="/predict" element={<ProtectedRoute><PricePredictor /></ProtectedRoute>} />
    </Routes>
  </div>
);
}



