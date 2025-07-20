import { useMapEvents } from "react-leaflet";

const AddMarkerOnClick = ({ onAddMarker }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onAddMarker({ lat, lng, name: "Point personnalisé" });
    },
  });

  return null;
};

export default AddMarkerOnClick;
