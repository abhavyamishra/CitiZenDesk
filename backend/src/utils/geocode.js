import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const geocodeAddress = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    const response = await axios.get(url);

    if (response.data.status !== "OK") {
      throw new Error(`Geocoding failed: ${response.data.status}`);
    }

    const location = response.data.results[0].geometry.location;

    return {
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: response.data.results[0].formatted_address,
    };
  } catch (error) {
    console.error("❌ Error in geocoding:", error.message);
    throw error;
  }
};