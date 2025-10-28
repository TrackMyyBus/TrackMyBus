import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },

  name: { type: String, required: true, trim: true },

  enrollmentId: { type: String, required: true, unique: true },

  enrollmentYear: { type: Number, required: true },

  email: { type: String, required: true, unique: true },

  contactNumber: { type: String, required: true },

  address: { type: String },

  assignedBus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true,
  },

  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: true,
  },

  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },

  status: { type: String, enum: ["active", "inactive"], default: "active" },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Student", studentSchema);
