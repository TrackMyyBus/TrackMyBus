import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },

    busId: {
        type: String,
        required: true,
        unique: true,
    },
    busNumberPlate: {
        type: String,
        required: true,
        unique: true,
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
        enum: ["active", "inactive", "maintenance"],
        default: "active",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    trackingStatus: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
    },

    currentLocation: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        speed: { type: Number, default: null },
        heading: { type: Number, default: null },
        battery: { type: Number, default: null },
        lastUpdated: { type: Date, default: null },
    },
});

export default mongoose.model("Bus", busSchema);
