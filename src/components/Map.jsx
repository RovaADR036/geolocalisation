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
        name: "Impossible d'avoir le nom via l'API",
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

function Sidebar({ countryDetails }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;

  const filteredCountries = countryDetails.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCountries.length / itemsPerPage);

  const currentItems = filteredCountries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="sidebar">
      <h2>Pays marqués ({countryDetails.length})</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher un pays marqué..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="country-list">
        {currentItems.length > 0 ? (
          currentItems.map((country, idx) => (
            <div key={idx} className="country-block">
              {country.flag && (
                <img
                  src={country.flag}
                  alt={`Drapeau ${country.name}`}
                  className="country-flag"
                />
              )}
              <h3>{country.name}</h3>
              {country.region && (
                <p>
                  <strong>Région:</strong> {country.region}
                </p>
              )}
              {country.capital && (
                <p>
                  <strong>Capitale:</strong> {country.capital}
                </p>
              )}
              {country.population && (
                <p>
                  <strong>Population:</strong>{" "}
                  {country.population.toLocaleString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">Aucun résultat trouvé</p>
        )}
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

function Map() {
  const [markers, setMarkers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryDetails, setCountryDetails] = useState([]);
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

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
    setCountryDetails((prev) => [...prev, markerData]);

    // Afficher la sidebar automatiquement quand un point est ajouté
    if (!sidebarVisible) {
      setSidebarVisible(true);
    }
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
      <div className="topbar">
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
        <button
          onClick={toggleSidebar}
          className="toggle-sidebar-btn"
          disabled={countryDetails.length === 0}
        >
          {sidebarVisible ? "◄ Masquer" : "Afficher ►"}
        </button>
      </div>

      <div className="map-with-sidebar">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          style={{ height: "90vh", width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AddMarkerOnClick onAddMarker={handleAddMarker} />
          {selectedCountry && <FlyToCountry position={selectedCountry} />}

          {markers.map((position, idx) => (
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

        {sidebarVisible && countryDetails.length > 0 && (
          <Sidebar countryDetails={countryDetails} />
        )}
      </div>
    </div>
  );
}

export default Map;
