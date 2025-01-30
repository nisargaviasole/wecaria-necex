<script>
// @ts-nocheck

  import { onMount, afterUpdate } from "svelte";
  export let locations = [];
  export let defaultLatitude = 22.333836;
  export let defaultLongitude = 73.179375;
  export let zoom = 13;

  let mapElement;
  let map;

  onMount(() => {
    import('maplibre-gl').then((L) => {
      // Initialize Maplibre map
      map = new L.Map(mapElement)
        .setView([defaultLatitude, defaultLongitude], zoom)
        .addLayer(new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'));

      // Add markers
      locations.forEach(location => {
        L.marker([location.latitude, location.longitude])
          .addTo(map)
          .bindPopup(`Location: ${location.latitude}, ${location.longitude}`)
          .openPopup();
      });
    });
  });

  afterUpdate(() => {
    if (map && locations.length > 0) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      locations.forEach(location => {
        L.marker([location.latitude, location.longitude])
          .addTo(map)
          .bindPopup(`Location: ${location.latitude}, ${location.longitude}`)
          .openPopup();
      });
    }
  });
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->
<div bind:this={mapElement} class="map-container" />
