import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapPage from "./components/MapPage/MapPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/map" element={<MapPage view="map" />} />
        <Route path="/list" element={<MapPage view="list" />} />
      </Routes>
    </Router>
  );
}

export default App;
