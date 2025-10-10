import mongoose from "mongoose";
import dotenv from "dotenv";
import Admin from "./models/admin.model.js";

dotenv.config({ path: "../.env" });

const testAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const admin = await Admin.findOne({ email: "admin@citizendesk.com" });
  console.log("Admin record:", admin);

  process.exit(0);
};

testAdmin();
