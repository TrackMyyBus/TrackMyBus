import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    // Reference to which institute/admin created this student
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },

    // Basic student info
    name: {
        type: String,
        required: true,
        trim: true,
    },
    enrollmentId: {
        type: String,
        required: true,
        unique: true,
    },
    enrollmentYear: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },

    // Bus information
    busNumber: {
        type: String, // internal bus code like BUS001
        required: true,
    },
    busPlateNumber: {
        type: String, // actual number on the bus plate
        required: true,
    },

    // References
    assignedDriver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true,
    },
    assignedRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: true,
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },

    // Time info
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Student", studentSchema);
