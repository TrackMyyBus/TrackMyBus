import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    instituteName: { type: String, required: true, trim: true },
    instituteCode: { type: String, required: true, unique: true },
    contactNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },

    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
    buses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bus" }],
    routes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Route" }],

    notifications: [
        {
            title: String,
            message: String,
            date: { type: Date, default: Date.now },
        },
    ],

    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Admin", adminSchema);
