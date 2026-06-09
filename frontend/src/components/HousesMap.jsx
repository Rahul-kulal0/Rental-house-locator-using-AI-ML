import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function HousesMap({ houses }) {
  // Filter houses that have valid coordinates
  const housesWithCoordinates = houses.filter(
    house => house.latitude && house.longitude
  );

  // Calculate bounds to fit all markers
  const bounds = housesWithCoordinates.length > 0 
    ? [
        [
          Math.min(...housesWithCoordinates.map(h => h.latitude)),
          Math.min(...housesWithCoordinates.map(h => h.longitude))
        ],
        [
          Math.max(...housesWithCoordinates.map(h => h.latitude)),
          Math.max(...housesWithCoordinates.map(h => h.longitude))
        ]
      ]
    : [[28.5, 77.2], [28.8, 77.5]]; // Default bounds for Delhi area

  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-4">📍 Houses on Map</h2>
      <div className="h-96 rounded-xl overflow-hidden shadow-lg">
        <MapContainer
          bounds={bounds}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {housesWithCoordinates.map((house, index) => (
            <Marker 
              key={house._id || house.id || `house-${index}`} 
              position={[house.latitude, house.longitude]}
            >
              <Popup>
                <div className="min-w-48">
                  <h3 className="font-bold">{house.location}</h3>
                  <p className="text-gray-600 text-sm">{house.city}</p>
                  <p className="font-semibold text-blue-600">₹{house.price?.toLocaleString()}</p>
                  <p className="text-sm">{house.house_type}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}