import CountrySelector from "../CountrySelector/CountrySelector";
import "./Navbar.css";
function Navbar({
  activeView,
  setActiveView,
  countries,
  onCountrySelect,
  hasMarkers,
}) {
  return (
    <nav className="app-navbar">
      <div className="nav-left">
        <button
          className={`nav-btn ${activeView === "map" ? "active" : ""}`}
          onClick={() => setActiveView("map")}
        >
          Vue Carte
        </button>
        <button
          className={`nav-btn ${activeView === "list" ? "active" : ""}`}
          onClick={() => setActiveView("list")}
          disabled={!hasMarkers}
        >
          Vue Liste
        </button>
      </div>
      <div className="nav-right">
        <label htmlFor="countrySelect">Sélectionner un pays : </label>
        <CountrySelector countries={countries} onSelect={onCountrySelect} />
      </div>
    </nav>
  );
}

export default Navbar;
