# Earthquake Visualizer (React + Vite + Tailwind + react-leaflet)

This project visualizes recent earthquakes (last 24 hours) using the USGS GeoJSON feed
and renders them on an interactive Leaflet map via react-leaflet.

## Quick start

1. Install dependencies
   ```bash
   npm install
   ```
2. Run dev server
   ```bash
   npm run dev
   ```
3. Open the URL shown by Vite (usually http://localhost:5173)

## Notes for reviewers
- Data source: https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson
- Uses Tailwind CSS for styling.
- Click a list item in the sidebar to center the map on an event.
- For large feeds consider adding clustering.

## How to deploy
- Import this project into CodeSandbox or StackBlitz (choose Vite + React template) or deploy on Vercel/Netlify.
- CodeSandbox: create new sandbox → Import from GitHub or Upload ZIP.

