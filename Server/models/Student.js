import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    // Linked login user account
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    // Linked institute (Admin)
    institute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },

    // Basic details
    name: {
        type: String,
        required: true,
        trim: true,
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

    // College details
    enrollmentId: {
        type: String,
        required: true,
        unique: true,
    },

    enrollmentYear: {
        type: Number,
        required: true,
    },

    // Bus details
    assignedBus: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Bus",
        required: false,
    },

    assignedRoute: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Route",
        required: false,
    },

    // Account status
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Student", studentSchema);
