import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MapView from "../MapView/MapView";
import PointsList from "../PointsList/PointsList";
import Navbar from "../Navbar/Navbar";
import "./MapPage.css";

function MapPage() {
  const [markers, setMarkers] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const location = useLocation();

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,latlng,population,region,capital,flags,cca2"
        );
        const data = await response.json();
        setCountries(
          data.sort((a, b) => a.name.common.localeCompare(b.name.common))
        );
      } catch (error) {
        console.error("Erreur de chargement des pays:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleAddMarker = (position) => {
    const country = countries.find(
      (c) =>
        c.latlng &&
        Math.abs(c.latlng[0] - position.lat) < 0.1 &&
        Math.abs(c.latlng[1] - position.lng) < 0.1
    );

    const newMarker = country
      ? {
          lat: position.lat,
          lng: position.lng,
          name: country.name.common,
          flag:
            country.flags?.png ||
            `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`,
          region: country.region,
          capital: country.capital?.[0] || "N/A",
          population: country.population.toLocaleString(),
        }
      : position;

    setMarkers((prev) => [...prev, newMarker]);
  };

  const handleCountrySelect = (e) => {
    const country = countries.find((c) => c.name.common === e.target.value);
    if (!country?.latlng) return;

    const [lat, lng] = country.latlng;
    const marker = {
      lat,
      lng,
      name: country.name.common,
      flag:
        country.flags?.png ||
        `https://flagcdn.com/w40/${country.cca2.toLowerCase()}.png`,
      region: country.region,
      capital: country.capital?.[0] || "N/A",
      population: country.population.toLocaleString(),
    };

    handleAddMarker(marker);
    setSelectedCountry(marker);
  };

  return (
    <div className="app-container">
      <Navbar
        countries={countries}
        onCountrySelect={handleCountrySelect}
        hasMarkers={markers.length > 0}
      />

      <div className="main-content">
        {location.pathname === "/list" ? (
          <PointsList points={markers} />
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
