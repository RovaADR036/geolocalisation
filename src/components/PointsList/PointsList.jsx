import { useState, useEffect } from "react";
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

  useEffect(() => setCurrentPage(1), [searchTerm, itemsPerPage]);

  return (
    <div className="points-list-container">
      <div className="list-header">
        <h2>Liste des points ({filteredPoints.length})</h2>
        <div className="list-controls">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {[3, 6, 9, 12].map((num) => (
              <option key={num} value={num}>
                {num}/page
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="points-grid">
        {currentItems.length > 0 ? (
          currentItems.map((point, index) => (
            <div key={index} className="point-card">
              {point.flag && (
                <img src={point.flag} alt="Drapeau" className="point-flag" />
              )}
              <h3>{point.name}</h3>
              <p>
                <strong>Coordonnées:</strong> {point.lat.toFixed(4)},{" "}
                {point.lng.toFixed(4)}
              </p>
              {point.region && (
                <p>
                  <strong>Région:</strong> {point.region}
                </p>
              )}
              {point.capital && (
                <p>
                  <strong>Capitale:</strong> {point.capital}
                </p>
              )}
              {point.population && (
                <p>
                  <strong>Population:</strong> {point.population}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="no-results">Aucun résultat trouvé</div>
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
