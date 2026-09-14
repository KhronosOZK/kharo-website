import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { areaCoords } from "@/lib/geo";

// Leaflet computes its size once on mount; a map that's initialised while its
// container is display:none (our mobile toggle) or that gets resized after
// mount renders at the wrong size until told to re-measure.
function InvalidateOnVisible({ trigger }) {
  const map = useMap();
  useEffect(() => {
    const id = requestAnimationFrame(() => map.invalidateSize());
    return () => cancelAnimationFrame(id);
  }, [trigger, map]);
  return null;
}

// Custom price-pill marker instead of Leaflet's default pin - matches the
// site's pill-button language instead of looking like a generic map widget.
function priceIcon(price, active) {
  return L.divIcon({
    className: "",
    html: `<div style="
      background:${active ? "#0B6B4F" : "#ffffff"};
      color:${active ? "#ffffff" : "#111111"};
      border:1.5px solid ${active ? "#0B6B4F" : "#E0E0E0"};
      border-radius:999px;
      padding:5px 10px;
      font:700 12px/1 'DM Sans', sans-serif;
      box-shadow:0 6px 16px -6px rgba(0,0,0,0.35);
      white-space:nowrap;
    ">£${price}</div>`,
    iconSize: null,
    iconAnchor: [24, 14],
  });
}

// Refits the map to the current markers whenever the filtered result set changes,
// so the map view always matches what's actually on screen (the "auto-updates" part).
function FitToMarkers({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points).pad(0.3);
    map.fitBounds(bounds, { maxZoom: 12 });
  }, [points, map]);
  return null;
}

export default function SearchMap({ results, activeBorough, onAreaClick, visibilityTrigger }) {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  // Group listings by area so nearby cars share one pin (like Airbnb's price pins),
  // rather than trying to plot 120 exact-but-fake coordinates on top of each other.
  const groups = useMemo(() => {
    const byArea = new Map();
    for (const v of results) {
      const key = `${v.city}|${v.borough}`;
      if (!byArea.has(key)) {
        byArea.set(key, { city: v.city, borough: v.borough, coords: areaCoords(v.borough, v.city), vehicles: [] });
      }
      byArea.get(key).vehicles.push(v);
    }
    return [...byArea.values()].map((g) => ({
      ...g,
      minPrice: Math.min(...g.vehicles.map((v) => v.weekly_rent)),
    }));
  }, [results]);

  const points = useMemo(() => groups.map((g) => g.coords), [groups]);

  return (
    <MapContainer
      center={[52.9, -1.5]}
      zoom={6}
      scrollWheelZoom
      className="w-full h-full rounded-2xl"
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        className="grayscale-map-tiles"
      />
      <FitToMarkers points={points} />
      {groups.map((g) => (
        <Marker
          key={`${g.city}|${g.borough}`}
          position={g.coords}
          icon={priceIcon(g.minPrice, activeBorough === g.borough)}
          eventHandlers={{
            click: () => {
              if (g.vehicles.length === 1) {
                navigate(`/vehicle/${g.vehicles[0].id}`);
              } else {
                onAreaClick(activeBorough === g.borough ? null : g.borough);
              }
            },
          }}
        />
      ))}
    </MapContainer>
  );
}
