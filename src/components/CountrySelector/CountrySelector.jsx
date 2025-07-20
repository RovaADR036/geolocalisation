import "./CountrySelector.css";

function CountrySelector({ countries, onSelect }) {
  return (
    <select onChange={onSelect} defaultValue="">
      <option value="" disabled>
        -- Choisir un pays --
      </option>
      {countries.map((country) => (
        <option key={country.name.common} value={country.name.common}>
          {country.name.common}
        </option>
      ))}
    </select>
  );
}

export default CountrySelector;
