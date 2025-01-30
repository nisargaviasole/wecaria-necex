<script>
  // @ts-nocheck
  import { onMount, afterUpdate } from "svelte";
  import maplibregl from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";

  export let locations = [];
  export let defaultLatitude = 22.333836;
  export let defaultLongitude = 73.179375;
  export let zoom = 13;

  let mapElement;
  let map;
  let markers = [];

  onMount(() => {
    map = new maplibregl.Map({
      container: mapElement,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: "osm-layer",
            type: "raster",
            source: "osm",
          },
        ],
      },
      center: [defaultLongitude, defaultLatitude],
      zoom: zoom,
    });

    map.addControl(new maplibregl.NavigationControl()); // Add zoom controls

    updateMarkersAndPath(locations);
  });

  function updateMarkersAndPath(locationArray) {
    if (!map) return;

    // Remove old markers
    markers.forEach(marker => marker.remove());
    markers = [];

    // Remove old path if it exists
    if (map.getSource("path")) {
      map.removeLayer("path-layer");
      map.removeSource("path");
    }

    // Add new markers
    locationArray.forEach((location, index) => {
      const marker = new maplibregl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .setPopup(
          new maplibregl.Popup({ offset: 25 }).setText(
            `Location ${index + 1}: ${location.latitude}, ${location.longitude}`
          )
        )
        .addTo(map);

      markers.push(marker);
    });

    // Draw path if there are at least two points
    if (locationArray.length > 1) {
      const coordinates = locationArray.map(loc => [loc.longitude, loc.latitude]);

      map.addSource("path", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      });

      map.addLayer({
        id: "path-layer",
        type: "line",
        source: "path",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff0000", // Red path color
          "line-width": 4, // Thickness of the line
          "line-opacity": 0.8,
        },
      });
    }

    // Fit map to markers
    if (locationArray.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      locationArray.forEach(location => {
        bounds.extend([location.longitude, location.latitude]);
      });
      map.fitBounds(bounds, { padding: 20 });
    }
  }

  afterUpdate(() => {
    if (map && locations.length > 0) {
      updateMarkersAndPath(locations);
    }
  });
</script>

<div bind:this={mapElement} class="map-container"></div>
<style>
  .map-container {
    height: 100vh; /* Full-screen height */
    width: 100%;
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
    overflow: hidden; /* Ensures content does not overflow */
  }

  /* Improve popup visibility */
  .maplibregl-popup-content {
    font-family: Arial, sans-serif;
    font-size: 14px;
    background: white;
    border-radius: 5px;
    padding: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  /* Styling the red path */
  .maplibregl-canvas {
    background-color: #eef2f3; /* Light gray background */
  }

  /* Custom zoom buttons */
  .maplibregl-ctrl-group {
    border-radius: 8px;
    overflow: hidden;
  }

  .maplibregl-ctrl button {
    background: white;
    border-radius: 5px;
    transition: background 0.2s;
  }

  .maplibregl-ctrl button:hover {
    background: #f0f0f0;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .map-container {
      height: 70vh; /* Adjust height for smaller screens */
    }
  }
</style>