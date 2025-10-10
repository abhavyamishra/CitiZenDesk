import mongoose from "mongoose";
import dotenv from "dotenv";
import Auth from "./models/auth.model.js"; // adjust path if needed

dotenv.config({ path: "../.env" }); // path to your .env

const checkAuth = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to DB");

    const adminAuth = await Auth.findOne({ email: "admin@citizendesk.com" });
    if (adminAuth) {
      console.log("✅ Admin Auth exists:", adminAuth);
    } else {
      console.log("❌ Admin Auth NOT found!");
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkAuth();
