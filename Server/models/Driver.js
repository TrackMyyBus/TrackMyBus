import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    // Reference to institute/admin who manages this driver
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },

    // Personal info
    name: {
        type: String,
        required: true,
        trim: true,
    },
    driverId: {
        type: String,
        required: true,
        unique: true, // e.g. DRV001
    },
    contactNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
    },
    address: {
        type: String,
    },

    // Assigned vehicle and route
    assignedBus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
    },
    assignedRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
    },

    // Tracking / live status
    isActive: {
        type: Boolean,
        default: true,
    },
    currentLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
        lastUpdated: { type: Date },
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Driver", driverSchema);
