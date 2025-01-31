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

    // Wait for the map to load before adding markers or circles
    map.on("load", () => {
      updateMarkers(locations);
      addCircle({ latitude: 22.270428593013648, longitude: 73.19681765297314 });
    });
  });

  function updateMarkers(locationArray) {
    if (!map) return;

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

  function addCircle(circleLocation) {
    if (!map) return;

    // Add a GeoJSON source for the circle
    map.addSource("circle-source", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [circleLocation.longitude, circleLocation.latitude],
            },
          },
        ],
      },
    });

    // Add a circle layer
    map.addLayer({
      id: "circle-layer",
      type: "circle",
      source: "circle-source",
      paint: {
        "circle-radius": 100, // Radius of the circle in meters
        "circle-color": "#007BFF", // Blue color
        "circle-opacity": 0.5, // Semi-transparent
        "circle-stroke-width": 2, // Border width
        "circle-stroke-color": "#0056b3", // Darker blue border
      },
    });
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