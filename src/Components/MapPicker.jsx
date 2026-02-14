// Changes 09/09/2025
import React, { useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

// Fix untuk ikon marker default leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

/**
 * Komponen ini sekarang langsung memanggil onPositionChange dari induk.
 * Ia tidak lagi mengatur state lokal.
 */
function MapEvents({ onPositionChange }) {
  useMapEvents({
    click(e) {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

/**
 * Komponen ini akan menggerakkan view peta ke posisi marker saat posisi berubah.
 */
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapPicker = ({ position, onPositionChange }) => {
  // Handler untuk event 'dragend' pada Marker
  const eventHandlers = useMemo(
    () => ({
      dragend(e) {
        const marker = e.target;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          // Langsung panggil onPositionChange, jangan set state lokal
          onPositionChange([lat, lng]);
        }
      },
    }),
    [onPositionChange]
  );

  return (
    <MapContainer
      center={position} // Posisi peta sekarang langsung dari props
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    >
      <ChangeView center={position} zoom={13} />

      {/* ESRI */}
      <TileLayer
        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
      />

      {/* OpenStreetMap */}
      {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={position} // Posisi marker sekarang langsung dari props
      />
      <MapEvents onPositionChange={onPositionChange} />
    </MapContainer>
  );
};

export default MapPicker;
