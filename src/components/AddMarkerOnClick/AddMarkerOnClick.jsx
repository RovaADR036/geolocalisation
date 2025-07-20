import { useMapEvents } from "react-leaflet";

function AddMarkerOnClick({ onAddMarker }) {
  useMapEvents({
    click(e) {
      onAddMarker({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        name: "Point personnalisé",
      });
    },
  });
  return null;
}

export default AddMarkerOnClick;
