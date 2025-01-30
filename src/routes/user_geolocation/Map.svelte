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
      container: mapElement, // Correctly binding map to the HTML element
      style: "https://demotiles.maplibre.org/style.json", // Free MapLibre tiles
      center: [defaultLongitude, defaultLatitude],
      zoom: zoom,
    });

    map.addControl(new maplibregl.NavigationControl()); // Add zoom controls

    updateMarkers(locations);
  });

  function updateMarkers(locationArray) {
    if (!map) return;

    // Remove existing markers
    markers.forEach(marker => marker.remove());
    markers = [];

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
      updateMarkers(locations);
    }
  });
</script>

<div bind:this={mapElement} class="map-container"></div>

<style>
  .map-container {
    height: 400px;
    width: 100%;
  }
</style>
