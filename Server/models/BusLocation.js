import mongoose from "mongoose";

const busLocationSchema = new mongoose.Schema({
    bus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    speed: {
        type: Number,
        default: 0, // in km/h
    },
    accuracy: {
        type: Number, // GPS accuracy in meters
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ["moving", "stopped", "offline"],
        default: "moving",
    },
    address: {
        type: String, // optional reverse geocode for display
    },
});

export default mongoose.model("BusLocation", busLocationSchema);
