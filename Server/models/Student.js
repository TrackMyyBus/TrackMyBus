import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  institute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // ✅ should match your Admin model, not "Institute"
    required: true,
  },
  name: { type: String, required: true },
  enrollmentId: { type: String, required: true },
  enrollmentYear: { type: Number, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String },
  address: { type: String },
  assignedBus: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
  },
  assignedDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
  },
  assignedRoute: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Student", studentSchema);
