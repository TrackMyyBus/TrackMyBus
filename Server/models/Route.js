import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
    routeName: { type: String, required: true },
    startPoint: { type: String, required: true },
    endPoint: { type: String, required: true },

    stops: [
        {
            name: { type: String, required: true },
            latitude: { type: Number, default: 0 },
            longitude: { type: Number, default: 0 },
            stopOrder: { type: Number, default: 1 },
        },
    ],

    totalDistance: { type: Number, default: 0 },
    estimatedDuration: { type: String },

    assignedBuses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Bus" }],

    // ⭐ Single driver only
    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        default: null,
    },

    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },

    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Route", routeSchema);
