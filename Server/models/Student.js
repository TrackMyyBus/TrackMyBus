import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rollNumber: { type: String, required: true },
    department: { type: String },
    year: { type: Number },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
});

export default mongoose.model("Student", studentSchema);
