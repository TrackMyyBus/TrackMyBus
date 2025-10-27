import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    instituteName: { type: String, required: true, trim: true },
    instituteCode: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },

    // Relationships (references)
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
    drivers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
    buses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bus" }],
    routes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Route" }],

    notifications: [
        {
            title: { type: String },
            message: { type: String },
            date: { type: Date, default: Date.now },
        },
    ],

    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Admin", adminSchema);
