import { Link, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function HouseCard({ house }) {
  const [showDescription, setShowDescription] = useState(false);
  const navigate = useNavigate();
  
  // Generate a placeholder image with gradient background if no image
  const hasImage = house.image && house.image !== '';
  
  const handleCardClick = (e) => {
    // If the click is on the image or description, don't navigate
    if (e.target.tagName === 'IMG' || e.target.closest('.description-content')) {
      return;
    }
    // Navigate to house details page
    navigate(`/house/${house._id || house.id || `${house.location}-${house.price}`}`);
  };

  const handleDescriptionClick = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking on description
    setShowDescription(!showDescription);
  };

  return (
    <div 
      className="card card-hover animate-fade-in cursor-pointer group block border rounded-xl shadow transition-all hover:shadow-lg"
      onClick={handleCardClick}
    >
      <div className="h-56 overflow-hidden rounded-t-2xl relative">
        {hasImage ? (
          <img
            src={house.image}
            alt="house"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
            <span className="text-6xl">🏠</span>
          </div>
        )}
        {house.isVerified && (
          <span className="absolute top-3 right-3 badge badge-success shadow-md backdrop-blur-sm bg-green-100/90">
            ✔ Verified
          </span>
        )}
        {house.isNegotiable && (
          <span className="absolute top-3 left-3 badge badge-warning shadow-md backdrop-blur-sm bg-yellow-100/90">
            💰 Negotiable
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
            {house.location}
          </h3>
        </div>

        <p className="text-gray-500 text-sm mb-4 flex items-center gap-1">
          📍 {house.city}
        </p>

        <div className="mt-4 flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-700">{house.house_type}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              🛁 {house.numBathrooms} Bathrooms
            </p>
            {house.house_size && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                📐 {house.house_size} sqft
              </p>
            )}
                    
            {/* Mini Map */}
            {house.latitude && house.longitude && (
              <div className="mt-3 h-32 rounded-lg overflow-hidden">
                <MapContainer 
                  center={[house.latitude, house.longitude]} 
                  zoom={13} 
                  style={{ height: "100%", width: "100%" }}
                  dragging={false}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  doubleClickZoom={false}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[house.latitude, house.longitude]} />
                </MapContainer>
              </div>
            )}
          </div>
          <div className="text-primary-600 font-extrabold text-xl">
            ₹{house.price?.toLocaleString()}
          </div>
        </div>

        {/* Description section */}
        {house.description && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <button 
              onClick={handleDescriptionClick}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
            >
              {showDescription ? 'Hide Description' : 'View Description'} 
              {showDescription ? ' ▲' : ' ▼'}
            </button>
            {showDescription && (
              <div className="mt-2 description-content">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {house.description}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}