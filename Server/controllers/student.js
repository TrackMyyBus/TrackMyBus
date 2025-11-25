// studentController.js

import Student from "../models/Student.js";
import User from "../models/User.js";
import Bus from "../models/Bus.js";
import Admin from "../models/Admin.js";
import Route from "../models/Route.js";
import bcrypt from "bcryptjs";

// ============================================================
// ✅ CREATE STUDENT (AUTO CREATES LOGIN ACCOUNT)
// ============================================================
export const createStudent = async (req, res) => {
    try {
        const {
            name,
            email,
            contactNumber,
            address,
            enrollmentId,
            enrollmentYear,
            institute,
            assignedBus,
            assignedRoute
        } = req.body;

        // Duplicate email check
        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already exists" });

        // ⭐ NO HASHING HERE — schema hashes automatically
        const user = await User.create({
            name,
            email,
            password: enrollmentId, // RAW
            role: "student",
        });

        // Create profile
        const student = await Student.create({
            userId: user._id,
            institute,
            name,
            email,
            contactNumber,
            address,
            enrollmentId,
            enrollmentYear,
            assignedBus,
            assignedRoute
        });

        // Add to admin
        await Admin.findByIdAndUpdate(institute, {
            $addToSet: { students: student._id }
        });

        // 2-way bus link
        if (assignedBus) {
            await Bus.findByIdAndUpdate(assignedBus, {
                $addToSet: { assignedStudents: student._id }
            });
        }

        // 2-way route link
        if (assignedRoute) {
            await Route.findByIdAndUpdate(assignedRoute, {
                $addToSet: { assignedStudents: student._id }
            });
        }

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student,
        });

    } catch (err) {
        console.error("Create Student Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};


// ============================================================
// GET ALL STUDENTS OF ADMIN
// ============================================================
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ institute: req.params.adminId })
            .populate("assignedBus")
            .populate("assignedRoute");

        res.status(200).json(students);
    } catch (err) {
        console.error("Get Students Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ============================================================
// GET ONE STUDENT BY ID
// ============================================================
export const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate("assignedBus")
            .populate("assignedRoute");

        if (!student)
            return res.status(404).json({ message: "Student not found" });

        res.status(200).json(student);
    } catch (err) {
        console.error("Get Student Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ============================================================
// UPDATE STUDENT
// ============================================================
export const updateStudent = async (req, res) => {
    try {
        const updated = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated)
            return res.status(404).json({ message: "Student not found" });

        res.status(200).json(updated);
    } catch (err) {
        console.error("Update Student Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ============================================================
// DELETE STUDENT
// ============================================================
export const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student)
            return res.status(404).json({ message: "Student not found" });

        // Remove from Bus
        if (student.assignedBus) {
            await Bus.findByIdAndUpdate(student.assignedBus, {
                $pull: { assignedStudents: student._id }
            });
        }

        // Remove from Route
        if (student.assignedRoute) {
            await Route.findByIdAndUpdate(student.assignedRoute, {
                $pull: { assignedStudents: student._id }
            });
        }

        // Delete User Login
        await User.findByIdAndDelete(student.userId);
        await Student.findByIdAndDelete(student._id);

        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        console.error("Delete Student Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ============================================================
// ASSIGN BUS & ROUTE (2-WAY RELATION CORRECTED)
// ============================================================
export const assignBusRoute = async (req, res) => {
    try {
        const { assignedBus, assignedRoute } = req.body;
        const studentId = req.params.id;

        const student = await Student.findById(studentId);
        if (!student)
            return res.status(404).json({ message: "Student not found" });

        // -------------------
        // Remove OLD BUS link
        // -------------------
        if (student.assignedBus) {
            await Bus.findByIdAndUpdate(student.assignedBus, {
                $pull: { assignedStudents: studentId }
            });
        }

        // -------------------
        // Add NEW BUS link
        // -------------------
        if (assignedBus) {
            await Bus.findByIdAndUpdate(assignedBus, {
                $addToSet: { assignedStudents: studentId }
            });
        }

        // -------------------
        // Remove OLD ROUTE link
        // -------------------
        if (student.assignedRoute) {
            await Route.findByIdAndUpdate(student.assignedRoute, {
                $pull: { assignedStudents: studentId }
            });
        }

        // -------------------
        // Add NEW ROUTE link
        // -------------------
        if (assignedRoute) {
            await Route.findByIdAndUpdate(assignedRoute, {
                $addToSet: { assignedStudents: studentId }
            });
        }

        // Update Student Model
        student.assignedBus = assignedBus;
        student.assignedRoute = assignedRoute;
        await student.save();

        res.status(200).json({
            success: true,
            message: "Bus & Route assigned successfully",
            student,
        });
    } catch (err) {
        console.error("Assign Bus/Route Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ============================================================
// LIVE LOCATION (FROM BUS TABLE)
// ============================================================
export const getStudentBusLiveLocation = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.busId);

        if (!bus)
            return res.status(404).json({ message: "Bus not found" });

        res.status(200).json(bus.currentLocation || null);
    } catch (err) {
        console.error("Live Location Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};

// ============================================================
// STUDENT DASHBOARD DATA (FULL, FIXED)
// ============================================================
export const studentDashboard = async (req, res) => {
    try {
        const { userId } = req.params;

        const student = await Student.findOne({ userId })
            .populate("assignedBus")
            .populate("assignedRoute");

        if (!student)
            return res.status(404).json({ message: "Student not found" });

        res.status(200).json({
            student: {
                id: student._id,
                name: student.name,
                assignedBus: student.assignedBus?._id || null,
                assignedRoute: student.assignedRoute?._id || null,
            },
            bus: student.assignedBus || null,
            route: student.assignedRoute || null,
            notifications: student.notifications || []
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};
