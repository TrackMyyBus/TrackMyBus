import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
    // Link to institute/admin that owns the bus
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },

    // Bus Identification
    busId: {
        type: String,
        required: true,
        unique: true, // e.g. BUS001
    },
    busNumberPlate: {
        type: String,
        required: true,
        unique: true, // actual number plate e.g. HR26DK1234
    },

    // Assignment Details
    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
    },
    assignedRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
    },

    // Tracking Info
    currentLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        speed: { type: Number, default: 0 },
        lastUpdated: { type: Date },
    },

    // Operational Status
    status: {
        type: String,
        enum: ["active", "inactive", "maintenance"],
        default: "active",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Bus", busSchema);
