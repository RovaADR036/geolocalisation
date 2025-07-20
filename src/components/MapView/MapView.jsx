import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import AddMarkerOnClick from "../AddMarkerOnClick/AddMarkerOnClick";
import FlyToCountry from "../FlyToCountry/FlyToCountry";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

function MapView({ points, onAddMarker, selectedCountry }) {
  return (
    <div className="map-view">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AddMarkerOnClick onAddMarker={onAddMarker} />
        {selectedCountry && <FlyToCountry position={selectedCountry} />}

        {points.map((point, index) => (
          <Marker key={index} position={[point.lat, point.lng]}>
            <Popup>
              <div className="popup-content">
                {point.flag && (
                  <img
                    src={point.flag}
                    alt={`Drapeau ${point.name}`}
                    className="popup-flag"
                  />
                )}
                <h3>{point.name}</h3>
                {point.region && (
                  <p>
                    <strong>Région:</strong> {point.region}
                  </p>
                )}
                {point.capital && (
                  <p>
                    <strong>Capitale:</strong> {point.capital}
                  </p>
                )}
                {point.population && (
                  <p>
                    <strong>Population:</strong> {point.population}
                  </p>
                )}
                <div className="popup-coords">
                  <span>Lat: {point.lat.toFixed(4)}</span>
                  <span>Lng: {point.lng.toFixed(4)}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapView;
