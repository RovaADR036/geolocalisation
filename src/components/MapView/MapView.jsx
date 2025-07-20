import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import AddMarkerOnClick from "../AddMarkerOnClick/AddMarkerOnClick";
import FlyToCountry from "../FlyToCountry/FlyToCountry";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

function MapView({ points, onAddMarker, selectedCountry }) {
  return (
    <div className="map-view">
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AddMarkerOnClick onAddMarker={onAddMarker} />
        {selectedCountry && <FlyToCountry position={selectedCountry} />}

        {points.map((position, idx) => (
          <Marker
            key={idx}
            position={[position.lat, position.lng]}
            draggable={true}
          >
            <Popup>
              <div className="popup-content">
                {position.flag && (
                  <img
                    src={position.flag}
                    alt={`Drapeau ${position.name}`}
                    className="popup-flag"
                  />
                )}
                <h3>{position.name}</h3>
                {position.region && (
                  <p>
                    <strong>Région:</strong> {position.region}
                  </p>
                )}
                {position.capital && (
                  <p>
                    <strong>Capitale:</strong> {position.capital}
                  </p>
                )}
                {position.population && (
                  <p>
                    <strong>Population:</strong>{" "}
                    {position.population.toLocaleString()}
                  </p>
                )}
                <div className="popup-coords">
                  <span>Lat: {position.lat.toFixed(4)}</span>
                  <span>Lng: {position.lng.toFixed(4)}</span>
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
