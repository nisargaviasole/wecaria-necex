<!-- src/routes/Map.svelte -->
<script>
// @ts-nocheck

  import { onMount, afterUpdate } from "svelte";
  export let locations = []; // Array of {latitude, longitude} objects

  // Default center if no locations provided
  export let defaultLatitude = 22.333836;
  export let defaultLongitude = 73.179375;
  export let zoom = 13;

  let mapElement;
  let map;
  let markers = []; // Array to store all markers

  // Function to update all markers
  function updateMarkers(locationArray) {
    if (!map) return;

    // Remove all existing markers
    markers.forEach((marker) => marker.remove());
    markers = [];

    // Add new markers for each location
    locationArray.forEach((location, index) => {
      const marker = L.marker([location.latitude, location.longitude])
        .addTo(map)
        .bindPopup(
          `Location ${index + 1}: ${location.latitude}, ${location.longitude}`
        )
        .openPopup();
      markers.push(marker);
    });

    // If we have locations, fit the map to show all markers
    if (locationArray.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.1)); // 0.1 adds 10% padding around the bounds
    }
  }

  onMount(async () => {
    const L = await import("leaflet");
    await import("leaflet/dist/leaflet.css");

    // Initialize map
    if (!map) {
      map = L.map(mapElement).setView([defaultLatitude, defaultLongitude], zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors"
      }).addTo(map);
    }

    // If locations are provided, show markers
    if (locations.length > 0) {
      updateMarkers(locations);
    }

    // Cleanup on component destruction
    return () => {
      map.remove();
    };
  });

  // Watch for changes in locations array
  afterUpdate(() => {
    if (map && locations && locations.length > 0) {
      updateMarkers(locations);
    }
  });
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->
<div bind:this={mapElement} class="map-container" />

<style>
  .map-container {
    height: 400px;
    width: 100%;
    z-index: 1;
  }

  :global(.leaflet-default-icon-path) {
    background-image: url("/svg/location-pin-alt-1-svgrepo-com.svg");
  }

  :global(.leaflet-control-container .leaflet-control) {
    z-index: 1000;
  }
</style>