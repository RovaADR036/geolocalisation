import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";

const AddMarkerOnClick = ({ onAddMarker }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onAddMarker({
        lat,
        lng,
        name: "Point personnalisé",
      });
    },
  });
  return null;
};

const FlyToCountry = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 5);
    }
  }, [position, map]);

  return null;
};

function PointsList({ points, itemsPerPage }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(points.length / itemsPerPage);
  const currentItems = points.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="points-list-container">
      <h2>Liste des points ({points.length})</h2>

      <div className="points-grid">
        {currentItems.map((point, idx) => (
          <div key={idx} className="point-card">
            {point.flag && (
              <img src={point.flag} alt="Drapeau" className="point-flag" />
            )}
            <h3>{point.name}</h3>
            <p>
              <strong>Coordonnées :</strong> {point.lat.toFixed(4)},{" "}
              {point.lng.toFixed(4)}
            </p>
            {point.region && (
              <p>
                <strong>Région :</strong> {point.region}
              </p>
            )}
            {point.capital && (
              <p>
                <strong>Capitale :</strong> {point.capital}
              </p>
            )}
            {point.population && (
              <p>
                <strong>Population :</strong>{" "}
                {point.population.toLocaleString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Précédent
          </button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  );
}

function MapView({
  points,
  onAddMarker,
  selectedCountry,
  countries,
  onCountrySelect,
}) {
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

function Map() {
  const [markers, setMarkers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [activeView, setActiveView] = useState("map"); // 'map' or 'list'
  const [itemsPerPage, setItemsPerPage] = useState(6); // Nombre d'éléments par page

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,latlng,population,region,capital,flags"
        );
        const data = await response.json();
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
      } catch (error) {
        console.error("Erreur de chargement des pays :", error);
      }
    };

    fetchCountries();
  }, []);

  const handleAddMarker = (position) => {
    const country = countries.find(
      (c) =>
        c.latlng &&
        Math.abs(c.latlng[0] - position.lat) < 0.0001 &&
        Math.abs(c.latlng[1] - position.lng) < 0.0001
    );

    const markerData = country
      ? {
          lat: position.lat,
          lng: position.lng,
          name: country.name.common,
          flag: country.flags.png,
          region: country.region,
          capital: country.capital?.[0],
          population: country.population,
        }
      : position;

    setMarkers((prev) => [...prev, markerData]);
  };

  const handleCountrySelect = (e) => {
    const countryName = e.target.value;
    const country = countries.find((c) => c.name.common === countryName);

    if (country && country.latlng) {
      const [lat, lng] = country.latlng;
      const marker = {
        lat,
        lng,
        name: country.name.common,
        flag: country.flags.png,
        region: country.region,
        capital: country.capital?.[0],
        population: country.population,
      };
      handleAddMarker(marker);
      setSelectedCountry(marker);
    }
  };

  return (
    <div className="app-container">
      <nav className="app-navbar">
        <div className="nav-left">
          <label htmlFor="countrySelect">Sélectionner un pays : </label>
          <select
            id="countrySelect"
            onChange={handleCountrySelect}
            defaultValue=""
          >
            <option value="" disabled>
              -- Choisir un pays --
            </option>
            {countries.map((country) => (
              <option key={country.name.common} value={country.name.common}>
                {country.name.common}
              </option>
            ))}
          </select>
        </div>

        <div className="nav-center">
          <button
            className={`nav-btn ${activeView === "map" ? "active" : ""}`}
            onClick={() => setActiveView("map")}
          >
            Vue Carte
          </button>
          <button
            className={`nav-btn ${activeView === "list" ? "active" : ""}`}
            onClick={() => setActiveView("list")}
            disabled={markers.length === 0}
          >
            Vue Liste
          </button>
        </div>

        <div className="nav-right">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="page-selector"
          >
            <option value={3}>3 par page</option>
            <option value={6}>6 par page</option>
            <option value={9}>9 par page</option>
            <option value={12}>12 par page</option>
          </select>
        </div>
      </nav>

      <div className="main-content">
        {activeView === "map" ? (
          <MapView
            points={markers}
            onAddMarker={handleAddMarker}
            selectedCountry={selectedCountry}
            countries={countries}
            onCountrySelect={handleCountrySelect}
          />
        ) : (
          <PointsList points={markers} itemsPerPage={itemsPerPage} />
        )}
      </div>
    </div>
  );
}

export default Map;
