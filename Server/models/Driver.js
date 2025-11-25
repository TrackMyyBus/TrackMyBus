import mongoose from "mongoose";

const driverSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    institute: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },

    name: { type: String, required: true },
    driverId: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true },

    assignedBus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus" },
    assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },

    isActive: { type: Boolean, default: true },

    currentLocation: {
        latitude: Number,
        longitude: Number,
        lastUpdated: Date,
    },

    socketId: String,
    isSharingLocation: { type: Boolean, default: false },

    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Driver", driverSchema);
