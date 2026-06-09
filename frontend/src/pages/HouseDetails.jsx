import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios";
import { getHouseImages } from "../utils/houseImages";
import MapView from "../components/MapView";

export default function HouseDetails() {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    fetchHouse();
    fetchSimilar();
  }, [id]);

  const fetchHouse = async () => {
    try {
      // Try to fetch from dataset API first
      const res = await axios.get(`/houses/dataset/${id}`);
      if (res.data.success) {
        setHouse(res.data.data);
      } else {
        // Fallback to MongoDB API
        const fallbackRes = await axios.get(`/houses/${id}`);
        setHouse(fallbackRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching house:", error);
      // Fallback to MongoDB API
      try {
        const fallbackRes = await axios.get(`/houses/${id}`);
        setHouse(fallbackRes.data.data);
      } catch (fallbackError) {
        console.error("Error fetching house from MongoDB:", fallbackError);
      }
    }
  };

  const fetchSimilar = async () => {
    try {
      // Try to fetch similar houses from dataset API first
      const res = await axios.get(`/houses/dataset/similar/${id}`);
      if (res.data.success) {
        setSimilar(res.data.data);
      } else {
        // Fallback to MongoDB API
        const fallbackRes = await axios.get(`/houses/similar/${id}`);
        setSimilar(fallbackRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching similar houses:", error);
      // Fallback to MongoDB API
      try {
        const fallbackRes = await axios.get(`/houses/similar/${id}`);
        setSimilar(fallbackRes.data.data);
      } catch (fallbackError) {
        console.error("Error fetching similar houses from MongoDB:", fallbackError);
      }
    }
  };

  if (!house) return <h2 className="text-center mt-10">Loading...</h2>;

  const images = getHouseImages(house);

  return (
    <div className="p-6">

      {/* ⭐ IMAGE GALLERY */}
      <div className="w-full mb-6">
        <img
          src={images[currentImage]}
          alt="House"
          onClick={() => setIsModalOpen(true)}
          className="w-full h-72 object-cover rounded-xl shadow cursor-pointer hover:opacity-90"
        />

        <div className="flex gap-3 mt-3 overflow-x-auto">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Thumbnail"
              onClick={() => setCurrentImage(index)}
              className={`w-32 h-24 object-cover rounded-lg cursor-pointer 
                hover:opacity-80 transition 
                ${currentImage === index ? "ring-4 ring-blue-500" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* ⭐ DETAILS */}
      <h1 className="text-3xl font-bold">{house.location}</h1>
      <p className="text-gray-600">{house.city}</p>

      <p className="text-2xl font-bold text-blue-600 mt-4">
        ₹ {house.price?.toLocaleString()}
      </p>

      <div className="mt-4 space-y-2">
        <p><strong>Type:</strong> {house.house_type}</p>
        <p><strong>Bathrooms:</strong> {house.numBathrooms}</p>
        <p><strong>Size:</strong> {house.house_size} sqft</p>
        <p><strong>Negotiable:</strong> {house.isNegotiable ? "Yes" : "No"}</p>
        <p><strong>Security Deposit:</strong> ₹ {house.SecurityDeposit || "Not specified"}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Property Description</h2>
        <div className="bg-white rounded-xl shadow-sm p-6">
          {house.description ? (
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {house.description}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-700">
                This beautiful {house.house_type} is located in the prime area of {house.location}, {house.city}. 
                It offers a perfect blend of comfort and convenience for your living needs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">🛏️</span>
                  <span><strong>Bathrooms:</strong> {house.numBathrooms}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">🌅</span>
                  <span><strong>Balconies:</strong> {house.numBalconies}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">📐</span>
                  <span><strong>Size:</strong> {house.house_size ? `${house.house_size} sq.ft.` : 'Not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-500">💰</span>
                  <span><strong>Rent:</strong> {house.isNegotiable ? 'Negotiable' : 'Fixed'}</span>
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {house.isVerified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✅ Verified Property
                  </span>
                )}
                {house.isNegotiable && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    💰 Rent Negotiable
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 mt-4">
                Located in a well-connected area with easy access to transportation, markets, and essential services. 
                This property offers excellent value for money and is ideal for {house.house_type.includes('Bhk') ? 'families' : 'professionals'}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ⭐ AMENITIES SECTION */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Property Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

          {/* Bathrooms */}
          <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-3xl">🛁</span>
            <div>
              <p className="font-semibold text-lg">{house.numBathrooms}</p>
              <p className="text-gray-600 text-sm">Bathroom{house.numBathrooms !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Balconies */}
          <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-3xl">🌅</span>
            <div>
              <p className="font-semibold text-lg">{house.numBalconies}</p>
              <p className="text-gray-600 text-sm">Balcon{house.numBalconies !== 1 ? 'ies' : 'y'}</p>
            </div>
          </div>

          {/* Security Deposit */}
          <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-3xl">🔐</span>
            <div>
              <p className="font-semibold text-lg">₹ {house.SecurityDeposit?.toLocaleString() || 'N/A'}</p>
              <p className="text-gray-600 text-sm">Security Deposit</p>
            </div>
          </div>

          {/* Negotiable */}
          <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-3xl">🤝</span>
            <div>
              <p className="font-semibold text-lg">
                {house.isNegotiable ? "Yes" : "No"}
              </p>
              <p className="text-gray-600 text-sm">Rent Negotiable</p>
            </div>
          </div>

          {/* Verified */}
          <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-3xl">{house.isVerified ? "✔" : "❌"}</span>
            <div>
              <p className="font-semibold text-lg">
                {house.isVerified ? "Verified" : "Not Verified"}
              </p>
              <p className="text-gray-600 text-sm">Property Status</p>
            </div>
          </div>

          {/* Water Supply */}
          <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-3xl">🚰</span>
            <div>
              <p className="font-semibold text-lg">24×7</p>
              <p className="text-gray-600 text-sm">Water Supply</p>
            </div>
          </div>

          {/* Power Backup */}
          <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-3xl">🔌</span>
            <div>
              <p className="font-semibold text-lg">Yes</p>
              <p className="text-gray-600 text-sm">Power Backup</p>
            </div>
          </div>

          {/* Furnishing */}
          <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3 hover:shadow-md transition-shadow">
            <span className="text-3xl">🪑</span>
            <div>
              <p className="font-semibold text-lg">
                {house.house_type?.includes("Studio")
                  ? "Semi-Furnished"
                  : house.house_type?.includes("Bhk")
                  ? "Fully Furnished"
                  : "Unfurnished"}
              </p>
              <p className="text-gray-600 text-sm">Furnishing</p>
            </div>
          </div>

        </div>
      </div>

      {/* CONTACT OWNER */}
      <div className="mt-10 p-6 border rounded-xl shadow bg-white">
        <h2 className="text-2xl font-semibold mb-4">Contact Property Owner</h2>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <div>
              <p className="text-gray-600 text-sm">Owner Name</p>
              <p className="font-semibold text-lg">{house.ownerName || "Property Owner"}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-2xl">📞</span>
            <div>
              <p className="text-gray-600 text-sm">Contact Number</p>
              <p className="font-semibold text-lg">{house.ownerPhone || "Not Available"}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          {house.ownerPhone && (
            <a href={`tel:${house.ownerPhone}`}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition transform hover:-translate-y-0.5">
              <span className="text-xl">📞</span>
              <span>Call Owner</span>
            </a>
          )}

          {house.ownerPhone && (
            <a
              href={`https://wa.me/+91${house.ownerPhone}?text=Hi,%20I%20am%20interested%20in%20your%20property%20at%20${house.location}%20(${house.city}).`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg shadow hover:bg-green-600 transition transform hover:-translate-y-0.5"
            >
              <span className="text-xl">💬</span>
              <span>WhatsApp</span>
            </a>
          )}
          
          {!house.ownerPhone && (
            <p className="text-gray-500 italic">Contact information not available for this property</p>
          )}
        </div>
      </div>

      {/* ⭐ MAP */}
      <div className="mt-10 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <p className="text-lg">{house.location}, {house.city}</p>
        {house.latitude && house.longitude ? (
          <MapView latitude={house.latitude} longitude={house.longitude} location={`${house.location}, ${house.city}`} />
        ) : (
          <div className="mt-4 h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Map coordinates not available for this property</p>
          </div>
        )}
      </div>

      {/* ⭐ SIMILAR PROPERTIES */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Similar Properties</h2>
        
        {similar.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similar.map((item) => (
              <div
                key={item._id}
                onClick={() => (window.location.href = `/house/${item._id}`)}
                className="p-4 border rounded-xl shadow hover:shadow-lg cursor-pointer transition transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-bold text-gray-800">{item.location}</h3>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <span>📍</span> {item.city}
                </p>
                <p className="text-blue-600 font-bold text-xl mt-3">
                  ₹ {item.price?.toLocaleString()}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <p className="text-sm font-medium text-gray-700">{item.house_type}</p>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>🛁 {item.numBathrooms}</span>
                    <span>🌅 {item.numBalconies}</span>
                  </div>
                </div>
                
                {item.isVerified && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">
                    Verified
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-500">No similar properties found</p>
          </div>
        )}
      </div>

      {/* ⭐ FULL SCREEN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center z-50">

          <button
            className="absolute top-5 right-5 text-white text-3xl font-bold"
            onClick={() => setIsModalOpen(false)}
          >
            ✕
          </button>

          <img
            src={images[currentImage]}
            alt="Full"
            className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-lg"
          />

          <div className="flex gap-4 mt-6 overflow-x-auto">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setCurrentImage(index)}
                className={`w-28 h-20 object-cover rounded-lg cursor-pointer transition 
                  ${currentImage === index ? "ring-4 ring-blue-400" : "opacity-70"}`}
              />
            ))}
          </div>

          <button
            className="absolute left-5 text-white text-4xl font-bold"
            onClick={() =>
              setCurrentImage((currentImage - 1 + images.length) % images.length)
            }
          >
            ❮
          </button>

          <button
            className="absolute right-5 text-white text-4xl font-bold"
            onClick={() =>
              setCurrentImage((currentImage + 1) % images.length)
            }
          >
            ❯
          </button>

        </div>
      )}

    </div>
  );
}
