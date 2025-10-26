import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    employeeId: { type: String, required: true },
    contactNumber: { type: String },
});

export default mongoose.model("Admin", adminSchema);
