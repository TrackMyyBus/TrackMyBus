import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    licenseNumber: { type: String, required: true },
    phone: { type: String },
    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
});

export default mongoose.model("Driver", driverSchema);
