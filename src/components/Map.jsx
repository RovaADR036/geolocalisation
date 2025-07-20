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
import "./Map.css"; // On ajoute les styles externes
import { Draggable } from "leaflet";

const AddMarkerOnClick = ({ onAddMarker }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onAddMarker({ lat, lng, name: "Point manuel" });
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
  const itemsPerPage = 3; // Nombre d'éléments par page

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(countryDetails.length / itemsPerPage);

  // Obtenir les éléments pour la page actuelle
  const currentItems = countryDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="sidebar">
      <h2>Détails des pays</h2>

      <div className="country-list">
        {currentItems.map((country, idx) => (
          <div key={idx} className="country-block">
            <h3>{country.name}</h3>
            <p>
              <strong>Latitude:</strong> {country.lat}
            </p>
            <p>
              <strong>Longitude:</strong> {country.lng}
            </p>
            <hr />
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

function Map() {
  const [markers, setMarkers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryDetails, setCountryDetails] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,latlng"
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
    setMarkers((prev) => [...prev, position]);
    setCountryDetails((prev) => [...prev, position]);
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
              Draggable={true}
            >
              <Popup>
                {position.name}
                <br />
                Lat: {position.lat.toFixed(4)}, Lng: {position.lng.toFixed(4)}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <Sidebar countryDetails={countryDetails} />
      </div>
    </div>
  );
}

export default Map;
