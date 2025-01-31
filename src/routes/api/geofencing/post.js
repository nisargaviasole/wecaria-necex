// @ts-nocheck
// @ts-ignore
export async function POST({ request }) {
    try {
      const data = await request.json();
      const userLatitude = parseFloat(data.latitude);
      const userLongitude = parseFloat(data.longitude);
  
      // Define the geofence area (center and radius in meters)
      const geofenceCenter = { latitude: 22.270428593013648, longitude: 73.19681765297314 }; // Example: San Francisco
      const geofenceRadius = 1000; // 1 kilometer radius
  
      // Function to calculate distance between two points using Haversine formula
      function calculateDistance(lat1, lon1, lat2, lon2) {
        const toRadians = (degrees) => degrees * (Math.PI / 180);
        const R = 6371000; // Earth's radius in meters
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
      }
  
      // Calculate distance between user and geofence center
      const distance = calculateDistance(
        userLatitude,
        userLongitude,
        geofenceCenter.latitude,
        geofenceCenter.longitude
      );
  
      // Check if user is within the geofence
      const isInArea = distance <= geofenceRadius;
  
      return new Response(
        JSON.stringify({
          InArea: isInArea,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }