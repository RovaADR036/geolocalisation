import { useEffect, useState } from "react";

const Sidebar = ({ countryDetails }) => {
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Mise à jour dynamique du nombre d'éléments par page
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const screenHeight = window.innerHeight;
      const approxItemHeight = 120; // en px
      const maxItems = Math.floor((screenHeight - 150) / approxItemHeight);
      setItemsPerPage(maxItems || 1);
    };

    calculateItemsPerPage();
    window.addEventListener("resize", calculateItemsPerPage);
    return () => window.removeEventListener("resize", calculateItemsPerPage);
  }, []);

  const totalPages = Math.ceil(countryDetails.length / itemsPerPage);
  const start = page * itemsPerPage;
  const currentItems = countryDetails.slice(start, start + itemsPerPage);

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  // Aller à la dernière page automatiquement si ajout d'élément
  useEffect(() => {
    const newTotalPages = Math.ceil(countryDetails.length / itemsPerPage);
    if (newTotalPages > totalPages) {
      setPage(newTotalPages - 1);
    }
  }, [countryDetails, itemsPerPage]);

  return (
    <div className="sidebar">
      <h2>Détails des pays</h2>

      {currentItems.map((country, idx) => (
        <div key={start + idx} className="country-block">
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

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={handlePrev} disabled={page === 0}>
            ←
          </button>
          <span>
            Page {page + 1} / {totalPages}
          </span>
          <button onClick={handleNext} disabled={page === totalPages - 1}>
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
