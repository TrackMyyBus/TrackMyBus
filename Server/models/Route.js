import mongoose from "mongoose";

const stopSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Sector 14 Bus Stop"
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    stopOrder: { type: Number }, // order of the stop in the route
});

const routeSchema = new mongoose.Schema({
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },

    routeName: {
        type: String,
        required: true,
    },

    startPoint: {
        name: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },

    endPoint: {
        name: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },

    stops: [stopSchema],

    totalDistance: {
        type: Number, // in kilometers
    },

    estimatedDuration: {
        type: String, // e.g., "1 hour 20 minutes"
    },

    assignedBuses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus",
        },
    ],

    active: {
        type: Boolean,
        default: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Route", routeSchema);
