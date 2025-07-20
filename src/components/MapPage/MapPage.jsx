import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapView from "../MapView/MapView";
import PointsList from "../PointsList/PointsList";
import Navbar from "../Navbar/Navbar";
import "./MapPage.css";

function MapPage() {
  const [markers, setMarkers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const navigate = useNavigate();

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
      navigate("/map"); // Redirige vers la vue carte après sélection
    }
  };

  return (
    <div className="app-container">
      <Navbar
        countries={countries}
        onCountrySelect={handleCountrySelect}
        hasMarkers={markers.length > 0}
      />

      <div className="main-content">
        {window.location.pathname === "/list" ? (
          <PointsList
            points={markers}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        ) : (
          <MapView
            points={markers}
            onAddMarker={handleAddMarker}
            selectedCountry={selectedCountry}
          />
        )}
      </div>
    </div>
  );
}

export default MapPage;
