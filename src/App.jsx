import React, { useEffect, useState } from "react";
import EarthquakeMap from "./EarthquakeMap";
import { format } from "date-fns";

const USGS_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minMag, setMinMag] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(USGS_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const features = data?.features ?? [];
  const filtered = features.filter((f) => {
    const mag = f.properties?.mag ?? 0;
    return mag >= minMag;
  });
  const topRecent = [...filtered]
    .sort((a, b) => b.properties.time - a.properties.time)
    .slice(0, 10);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <aside className="w-full md:w-80 bg-white/90 p-4 border-b md:border-r">
        <h1 className="text-2xl font-semibold mb-2">Earthquake Visualizer</h1>
        <p className="text-sm text-slate-600 mb-3">
          Recent earthquakes (last 24 hours) from USGS
        </p>

        <div className="mb-3">
          <label className="block text-sm font-medium">Min magnitude: {minMag}</label>
          <input
            type="range"
            min="0"
            max="8"
            step="0.1"
            value={minMag}
            onChange={(e) => setMinMag(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-3">
          <button
            onClick={fetchData}
            className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {loading && <p className="text-sm">Loading data…</p>}
        {error && (
          <div className="text-sm text-red-600">
            Error: {error} <button onClick={fetchData} className="underline">Retry</button>
          </div>
        )}

        <h2 className="mt-4 font-medium">Recent (top 10)</h2>
        <ul className="space-y-2 mt-2">
          {topRecent.length === 0 && <li className="text-sm text-slate-500">No events</li>}
          {topRecent.map((f) => {
            const { id, properties, geometry } = f;
            const [lon, lat, depth] = geometry?.coordinates ?? [];
            return (
              <li key={id} className="p-2 border rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{properties.place}</div>
                    <div className="text-xs text-slate-600">
                      {properties.mag} • {format(new Date(properties.time), "PP p")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{properties.mag}</div>
                    <button
                      className="text-xs text-blue-600 underline mt-1"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("quake-center", { detail: { id } })
                        );
                      }}
                    >
                      Center
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 text-xs text-slate-500">
          Data source: USGS. Click Refresh to reload.
        </div>
      </aside>

      <main className="flex-1 h-[calc(100vh-0px)]">
        <EarthquakeMap features={filtered} />
      </main>
    </div>
  );
}
