import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix icônes leaflet (pour Vite ou CRA)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Données statiques exemples
const dataPoints = [
  {
    id: 1,
    name: "Pharmacie Andohalo",
    lat: -18.9105,
    lng: 47.5259,
    description: "Ouverte 24h/24",
  },
  {
    id: 2,
    name: "École Mahamasina",
    lat: -18.9142,
    lng: 47.5199,
    description: "École publique",
  },
  {
    id: 3,
    name: "Station Essence Analakely",
    lat: -18.9087,
    lng: 47.5245,
    description: "Station Total",
  },
  {
    id: 4,
    name: "Hôpital Befelatanana",
    lat: -18.9075,
    lng: 47.5273,
    description: "Soins urgents",
  },
  {
    id: 5,
    name: "Bibliothèque Municipale",
    lat: -18.9121,
    lng: 47.5177,
    description: "Livres et étude",
  },
  // Ajoute plus de données si tu veux pour tester pagination
];

// Composant Pagination simple
const Pagination = ({ total, page, pageSize, onChange }) => {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;

  return (
    <div style={{ margin: "1rem 0" }}>
      {Array.from({ length: pages }, (_, i) => (
        <button
          key={i}
          style={{
            marginRight: 5,
            backgroundColor: i + 1 === page ? "#007bff" : "#eee",
            color: i + 1 === page ? "white" : "black",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
          }}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

const GeoApp = () => {
  const [view, setView] = useState("map"); // map | list | both
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 3; // nombre d'items par page

  // Filtrer les données selon recherche
  const filteredPoints = useMemo(() => {
    return dataPoints.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Pagination des données filtrées
  const paginatedPoints = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredPoints.slice(start, start + pageSize);
  }, [filteredPoints, page]);

  // Centre par défaut
  const center = [-18.91, 47.52];

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>📍 GeoApp Interactive</h1>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher par nom..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); // reset page
        }}
        style={{
          padding: "8px",
          width: "300px",
          marginBottom: "15px",
          fontSize: "1rem",
        }}
      />

      {/* Boutons switch vue */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setView("map")}
          style={{
            marginRight: 10,
            backgroundColor: view === "map" ? "#007bff" : "#eee",
            color: view === "map" ? "white" : "black",
            border: "none",
            padding: "8px 15px",
            cursor: "pointer",
          }}
        >
          Carte
        </button>
        <button
          onClick={() => setView("list")}
          style={{
            marginRight: 10,
            backgroundColor: view === "list" ? "#007bff" : "#eee",
            color: view === "list" ? "white" : "black",
            border: "none",
            padding: "8px 15px",
            cursor: "pointer",
          }}
        >
          Liste
        </button>
        <button
          onClick={() => setView("both")}
          style={{
            backgroundColor: view === "both" ? "#007bff" : "#eee",
            color: view === "both" ? "white" : "black",
            border: "none",
            padding: "8px 15px",
            cursor: "pointer",
          }}
        >
          Les deux
        </button>
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        {(view === "map" || view === "both") && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: 400, width: "100%" }}
              key="map"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {paginatedPoints.map((point) => (
                <Marker
                  key={point.id}
                  position={[point.lat, point.lng]}
                  eventHandlers={{
                    click: () => setSelectedPoint(point),
                  }}
                >
                  <Popup>
                    <strong>{point.name}</strong>
                    <br />
                    {point.description}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {(view === "list" || view === "both") && (
          <div
            style={{
              flex: 1,
              maxHeight: 400,
              overflowY: "auto",
              border: "1px solid #ddd",
              padding: 10,
            }}
          >
            {paginatedPoints.length === 0 && <p>Aucun résultat.</p>}
            {paginatedPoints.map((point) => (
              <div
                key={point.id}
                onClick={() => setSelectedPoint(point)}
                style={{
                  cursor: "pointer",
                  marginBottom: 12,
                  backgroundColor:
                    selectedPoint?.id === point.id ? "#e0f0ff" : "transparent",
                  padding: 8,
                  borderRadius: 4,
                  border:
                    selectedPoint?.id === point.id
                      ? "1px solid #007bff"
                      : "1px solid transparent",
                }}
              >
                <h3 style={{ margin: 0 }}>{point.name}</h3>
                <p style={{ margin: "4px 0" }}>{point.description}</p>
                <small>
                  Lat: {point.lat.toFixed(4)}, Lng: {point.lng.toFixed(4)}
                </small>
              </div>
            ))}

            {/* Pagination */}
            <Pagination
              total={filteredPoints.length}
              page={page}
              pageSize={pageSize}
              onChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Affiche détails du point sélectionné */}
      {selectedPoint && (
        <div
          style={{
            marginTop: 20,
            padding: 15,
            backgroundColor: "#f9f9f9",
            border: "1px solid #ddd",
            borderRadius: 6,
            maxWidth: 600,
          }}
        >
          <h2>Détails</h2>
          <p>
            <strong>{selectedPoint.name}</strong>
          </p>
          <p>{selectedPoint.description}</p>
          <p>
            Latitude: {selectedPoint.lat.toFixed(5)} <br />
            Longitude: {selectedPoint.lng.toFixed(5)}
          </p>
          <button onClick={() => setSelectedPoint(null)}>Fermer</button>
        </div>
      )}
    </div>
  );
};

export default GeoApp;
