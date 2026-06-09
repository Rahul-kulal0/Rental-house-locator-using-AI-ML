import { useEffect, useState } from "react";
import axios from "axios";

export default function Favorites() {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");

    const results = [];

    for (let id of favIds) {
      const res = await axios.get(`http://localhost:5000/api/houses/${id}`);
      results.push(res.data.data);
    }

    setHouses(results);
  };

  if (houses.length === 0)
    return <h2 className="text-center mt-10">No favorites yet ❤️</h2>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Favorite Houses ❤️</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house) => (
          <div
            key={house._id}
            className="p-4 border rounded-xl shadow cursor-pointer hover:shadow-lg transition"
            onClick={() => (window.location.href = `/house/${house._id}`)}
          >
            <h3 className="text-lg font-bold">{house.location}</h3>
            <p className="text-gray-600">{house.city}</p>
            <p className="text-blue-600 font-bold mt-2">
              ₹ {house.price?.toLocaleString()}
            </p>
            <p className="text-sm">{house.house_type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
