import { useEffect, useState } from "react";
import "./PointsList.css";

function PointsList({ points, itemsPerPage, setItemsPerPage }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPoints = points.filter((point) =>
    point.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPoints.length / itemsPerPage);
  const currentItems = filteredPoints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  return (
    <div className="points-list-container">
      <div className="list-header">
        <h2>Liste des points ({filteredPoints.length})</h2>
        <div className="list-controls">
          <div className="list-search">
            <input
              type="text"
              placeholder="Rechercher un point..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="items-per-page">
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={3}>3/page</option>
              <option value={6}>6/page</option>
              <option value={9}>9/page</option>
              <option value={12}>12/page</option>
            </select>
          </div>
        </div>
      </div>

      <div className="points-grid">
        {currentItems.length > 0 ? (
          currentItems.map((point, idx) => (
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
          ))
        ) : (
          <div className="no-results">
            Aucun point ne correspond à votre recherche
          </div>
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

export default PointsList;
