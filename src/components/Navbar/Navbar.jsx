import { Link } from "react-router-dom";
import CountrySelector from "../CountrySelector/CountrySelector";
import "./Navbar.css";

function Navbar({ countries, onCountrySelect, hasMarkers }) {
  return (
    <nav className="app-navbar">
      <div className="nav-left">
        <Link
          to="/map"
          className={`nav-btn ${
            window.location.pathname === "/map" ? "active" : ""
          }`}
        >
          Vue Carte
        </Link>
        <Link
          to="/list"
          className={`nav-btn ${
            window.location.pathname === "/list" ? "active" : ""
          } ${!hasMarkers ? "disabled" : ""}`}
          onClick={(e) => {
            if (!hasMarkers) {
              e.preventDefault();
            }
          }}
        >
          Vue Liste
        </Link>
      </div>
      <div className="nav-right">
        <label htmlFor="countrySelect">Sélectionner un pays : </label>
        <CountrySelector countries={countries} onSelect={onCountrySelect} />
      </div>
    </nav>
  );
}

export default Navbar;
