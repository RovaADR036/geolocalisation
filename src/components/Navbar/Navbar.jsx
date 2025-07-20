import { Link } from "react-router-dom";
import CountrySelector from "../CountrySelector/CountrySelector";
import "./Navbar.css";

function Navbar({ countries, onCountrySelect, hasMarkers }) {
  return (
    <nav className="app-navbar">
      <div className="nav-left">
        <Link to="/map" className="nav-btn">
          Vue Carte
        </Link>
        <Link
          to="/list"
          className={`nav-btn ${!hasMarkers ? "disabled" : ""}`}
          onClick={(e) => !hasMarkers && e.preventDefault()}
        >
          Vue Liste
        </Link>
      </div>
      <div className="nav-right">
        <CountrySelector countries={countries} onSelect={onCountrySelect} />
      </div>
    </nav>
  );
}

export default Navbar;
