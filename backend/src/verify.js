import mongoose from "mongoose";
import dotenv from "dotenv";
import Auth from "./models/auth.model.js";

dotenv.config({ path: "../.env" });

const verify = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB:", mongoose.connection.name);

  const auth = await Auth.findOne({ email: "admin@citizendesk.com" });
  console.log("Auth document:", auth);

  process.exit(0);
};

verify();
