<!-- src/routes/+page.svelte -->
<script>
// @ts-nocheck

  import Map from "./Map.svelte";
  import { onMount } from 'svelte';
  
  let all_value = [];
  let locations = [];  // Make locations an independent variable

  onMount(async () => {
    try {
      const response = await fetch('http://localhost:5173/api/login/getdata');
      if(response.ok) {
        all_value = await response.json();
        locations = all_value.data || []; // Assign data to locations
        console.log('All geolocation data:', locations);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  });
</script>

<Map {locations} />
