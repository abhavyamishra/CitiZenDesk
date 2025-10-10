import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Admin from "./models/admin.model.js";

dotenv.config({ path: path.resolve("../.env") });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to DB");

    const email = "a@citi.com";

    // Delete old admin if exists
    await Admin.deleteMany({ email });
    console.log("✅ Deleted old Admin records if any");

    // Create new admin
    const admin = await Admin.create({
      username: "sa",
      email: email.toLowerCase(),
      password: "1234567", // will be hashed automatically
    });

    console.log("✅ Admin created successfully!");
    console.log("🪪 Email:", email);
    console.log("🔑 Password: 1234567");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
