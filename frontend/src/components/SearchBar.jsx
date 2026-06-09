import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔍 Fetch suggestions from API
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const delay = setTimeout(async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/houses/search?query=${query}`
        );
        setSuggestions(res.data.data);
        setShow(true);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(delay);
  }, [query]);

  const handleSelect = (id) => {
    window.location.href = `/house/${id}`;
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8 mb-6 animate-slide-down">
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search location, city, house type..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShow(true)}
          className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-gray-200 shadow-md focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all duration-300 text-lg placeholder:text-gray-400 hover:shadow-lg"
        />
        {loading && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-primary-600 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* 🔽 Suggestions Dropdown */}
      {show && suggestions.length > 0 && (
        <div className="absolute z-50 bg-white w-full border-2 border-gray-200 rounded-xl shadow-hard mt-2 max-h-96 overflow-y-auto scrollbar-thin animate-slide-down">
          {suggestions.map((item) => (
            <div
              key={item._id}
              onClick={() => handleSelect(item._id)}
              className="p-4 hover:bg-primary-50 cursor-pointer transition-colors duration-200 border-b border-gray-100 last:border-b-0 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                    {item.location}
                  </p>
                  <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                    <span>📍 {item.city}</span>
                    <span>•</span>
                    <span>{item.house_type}</span>
                  </p>
                </div>
                <div className="text-primary-600 font-bold text-lg">
                  ₹ {item.price?.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* If no results */}
      {show && query.length >= 2 && suggestions.length === 0 && !loading && (
        <div className="absolute z-50 bg-white w-full border-2 border-gray-200 rounded-xl shadow-medium mt-2 p-6 text-center animate-slide-down">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-gray-600 font-medium">No results found for "{query}"</p>
          <p className="text-gray-400 text-sm mt-1">Try different keywords or check spelling</p>
        </div>
      )}
    </div>
  );
}
