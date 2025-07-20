import { useEffect } from "react";
import { useMap } from "react-leaflet";

const FlyToCountry = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 5);
    }
  }, [position, map]);

  return null;
};

export default FlyToCountry;
