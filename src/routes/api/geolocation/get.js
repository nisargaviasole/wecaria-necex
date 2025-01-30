import { connectDb } from "./db.js";

export async function GET() {
  try {
    const db = await connectDb();
    const allvalues = await db.collection("user_geolocation").find().toArray();

    return new Response(JSON.stringify({ success: true, data: allvalues }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow all origins (or specify your frontend domain)
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    });
  } catch (error) {
    console.log("error", error);
    return new Response(
      JSON.stringify({ success: false, message: "Invalid data" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      }
    );
  }
}
