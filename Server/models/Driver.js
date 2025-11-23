import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },

    name: {
        type: String,
        required: true,
        trim: true,
    },

    driverId: {
        type: String,
        required: true,
        unique: true,
    },

    contactNumber: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        unique: true,
    },

    address: { type: String },

    assignedBus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
    },

    assignedRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    currentLocation: {
        latitude: Number,
        longitude: Number,
        lastUpdated: Date,
    },

    socketId: { type: String, default: null },
    isSharingLocation: { type: Boolean, default: false },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Driver", driverSchema);
