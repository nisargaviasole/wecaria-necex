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
  const ORS_API_KEY = "5b3ce3597851110001cf624890c342a6cbf64524bb786f3848fd3c99"; // Replace with your API key

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

  async function fetchRouteFromORS(locationArray) {
    if (locationArray.length < 2) return;

    const coordinates = locationArray.map(loc => [loc.longitude, loc.latitude]);
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&coordinates=${coordinates.map(coord => coord.join(",")).join("|")}&format=geojson`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching route:", error);
      return null;
    }
  }

  async function updateMarkersAndPath(locationArray) {
    if (!map) return;

    // Remove old markers
    markers.forEach(marker => marker.remove());
    markers = [];

    // Remove old path if it exists
    if (map.getSource("route")) {
      map.removeLayer("route-layer");
      map.removeSource("route");
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

    // Get road-based route
    const routeData = await fetchRouteFromORS(locationArray);
    if (routeData) {
      map.addSource("route", {
        type: "geojson",
        data: routeData,
      });

      map.addLayer({
        id: "route-layer",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#007bff", // Blue route color
          "line-width": 4,
          "line-opacity": 0.8,
        },
      });

      // Fit map to route
      const bounds = new maplibregl.LngLatBounds();
      routeData.features[0].geometry.coordinates.forEach(coord => bounds.extend(coord));
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
    height: 100vh;
    width: 100%;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .maplibregl-popup-content {
    font-family: Arial, sans-serif;
    font-size: 14px;
    background: white;
    border-radius: 5px;
    padding: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  .maplibregl-canvas {
    background-color: #eef2f3;
  }

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

  @media (max-width: 768px) {
    .map-container {
      height: 70vh;
    }
  }
</style>
