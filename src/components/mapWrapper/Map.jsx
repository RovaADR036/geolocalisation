import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

// import L from "leaflet";
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Correction des icônes
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// Composant de gestion du clic

function ClickHandler({ onClick }) {
  useMapEvents({
    click(e) {
      onClick(e.latlng); // e.latlng = {lat, lng}
      console.log("Clic détecté à :", e.latlng);
    },
  });
  return null;
}

const Map = () => {
  const [markerPositions, setMarkerPositions] = useState([]); // Plusieurs positions

  // Ajoute une nouvelle position au tableau
  const handleClick = (latlng) => {
    setMarkerPositions((prevPositions) => [...prevPositions, latlng]);
  };

  return (
    <MapContainer
      center={[-18.8792, 47.5079]}
      zoom={6}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      <ClickHandler onClick={handleClick} />

      {/* Affiche tous les marqueurs */}
      {markerPositions.map((position, index) => (
        <Marker key={index} position={position}>
          <Popup>
            Marqueur #{index + 1} <br />
            Latitude : {position.lat.toFixed(5)} <br />
            Longitude : {position.lng.toFixed(5)} <br />
            pays : Madagascar
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
