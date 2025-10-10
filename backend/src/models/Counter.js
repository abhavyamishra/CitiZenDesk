import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  dept: { type: String, required: true },
  date: { type: String, required: true }, // YYYYMMDD
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);
export default Counter;
