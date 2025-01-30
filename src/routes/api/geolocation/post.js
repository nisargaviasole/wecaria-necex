import { connectDb } from "./db.js";
// @ts-ignore
export async function POST({ request }) {
  try {
    const data = await request.json();
    const db = await connectDb();
    let latitude = data.latitude;
    let longitude = data.longitude;
    console.log("data comes");
    const store_value = await db.collection("user_geolocation").insertOne({
      latitude: latitude,
      longitude: longitude
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Data Stored",
        store_data: store_value
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid data" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
