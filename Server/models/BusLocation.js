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
        required: true,
    },

    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    speed: { type: Number, default: 0 },
    heading: { type: Number },
    accuracy: { type: Number },
    battery: { type: Number },

    timestamp: {
        type: Date,
        default: Date.now,
    },

    status: {
        type: String,
        enum: ["moving", "stopped", "offline"],
        default: "moving",
    },

    address: { type: String },
});

busLocationSchema.index({ bus: 1, timestamp: -1 });

export default mongoose.model("BusLocation", busLocationSchema);
