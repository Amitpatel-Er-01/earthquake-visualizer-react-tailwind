import React, { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";

function getColor(mag) {
  if (mag >= 6) return "#800026";
  if (mag >= 5) return "#BD0026";
  if (mag >= 4) return "#E31A1C";
  if (mag >= 3) return "#FC4E2A";
  if (mag >= 2) return "#FD8D3C";
  if (mag >= 1) return "#FEB24C";
  return "#FED976";
}

function MapEvents({ features }) {
  const map = useMap();
  useEffect(() => {
    function handleCenter(e) {
      const id = e.detail?.id;
      if (!id) return;
      const feat = features.find((f) => f.id === id);
      if (!feat) return;
      const [lon, lat] = feat.geometry.coordinates;
      map.setView([lat, lon], 6, { animate: true });
    }
    window.addEventListener("quake-center", handleCenter);
    return () => window.removeEventListener("quake-center", handleCenter);
  }, [map, features]);
  return null;
}

export default function EarthquakeMap({ features }) {
  const center = [20, 0];
  return (
    <MapContainer center={center} zoom={2} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents features={features} />
      {features.map((f) => {
        const { id, properties, geometry } = f;
        const [lon, lat, depth] = geometry?.coordinates ?? [];
        const mag = properties.mag ?? 0;
        const radius = Math.max(4, mag * mag * 2);
        return (
          <CircleMarker
            key={id}
            center={[lat, lon]}
            radius={radius}
            pathOptions={{ color: getColor(mag), fillOpacity: 0.6, weight: 1 }}
          >
            <Popup>
              <div className="max-w-xs">
                <div className="font-semibold">{properties.place}</div>
                <div>Magnitude: {mag}</div>
                <div>Depth: {depth ?? "N/A"} km</div>
                <div>Time: {new Date(properties.time).toLocaleString()}</div>
                <div>
                  <a href={properties.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">USGS details</a>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
