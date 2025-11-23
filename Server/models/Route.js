import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
    routeName: { type: String, required: true },
    startPoint: { type: String, required: true },
    endPoint: { type: String, required: true },
    totalDistance: { type: Number },
    estimatedDuration: { type: String },
    assignedBuses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus",
        },
    ],
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Route", routeSchema);
