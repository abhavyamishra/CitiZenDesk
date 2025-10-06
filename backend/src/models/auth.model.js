const authSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  provider: { type: String, enum: ["local", "google"], default: "local" },
  providerId: { type: String }, 
  role: { 
    type: String, 
    enum: ["user", "staff", "admin"], 
    required: true 
  },

  profileId: { type: mongoose.Schema.Types.ObjectId, required: true },

  refreshToken: { type: String },

}, { timestamps: true });
