import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MapPage from "./components/MapPage/MapPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MapPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/list" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
