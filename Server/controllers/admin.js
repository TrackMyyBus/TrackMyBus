import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Driver from "../models/Driver.js";
import Bus from "../models/Bus.js";
import Route from "../models/Route.js";

/* ============================================================
   ✅ 1. ADMIN OVERVIEW
   GET /api/admin/overview/:adminId
============================================================ */
export const getOverview = async (req, res) => {
    try {
        const { adminId } = req.params;

        const studentsCount = await Student.countDocuments({ institute: adminId });
        const driversCount = await Driver.countDocuments({ institute: adminId });
        const busesCount = await Bus.countDocuments({ institute: adminId });
        const routesCount = await Route.countDocuments({ institute: adminId });

        res.status(200).json({
            success: true,
            studentsCount,
            driversCount,
            busesCount,
            routesCount,
        });
    } catch (error) {
        console.error("Overview Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   ✅ 2. GET ADMIN PROFILE
   GET /api/admin/profile/:adminId
============================================================ */
export const getAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);

        if (!admin)
            return res.status(404).json({ success: false, message: "Admin not found" });

        res.status(200).json({ success: true, admin });
    } catch (error) {
        console.error("Admin Profile Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   ✅ 3. UPDATE ADMIN PROFILE
   PUT /api/admin/update/:adminId
============================================================ */
export const updateAdminProfile = async (req, res) => {
    try {
        const admin = await Admin.findByIdAndUpdate(
            req.params.adminId,
            req.body,
            { new: true }
        );

        if (!admin)
            return res.status(404).json({ success: false, message: "Admin not found" });

        res.status(200).json({
            success: true,
            message: "Admin profile updated",
            admin,
        });
    } catch (error) {
        console.error("Admin Update Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   ✅ 4. GET ALL STUDENTS
   GET /api/admin/students/:adminId
============================================================ */
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ institute: req.params.adminId })
            .populate("assignedBus")
            .populate("assignedRoute");

        res.status(200).json({ success: true, students });
    } catch (error) {
        console.error("Get Students Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   ✅ 5. GET ALL DRIVERS
   GET /api/admin/drivers/:adminId
============================================================ */
export const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find({ institute: req.params.adminId })
            .populate("assignedBus")
            .populate("assignedRoute");

        res.status(200).json({ success: true, drivers });
    } catch (error) {
        console.error("Get Drivers Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   ✅ 6. GET ALL BUSES
   GET /api/admin/buses/:adminId
============================================================ */
export const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find({ institute: req.params.adminId })
            .populate("assignedDriver")
            .populate("assignedRoute");

        res.status(200).json({ success: true, buses });
    } catch (error) {
        console.error("Get Buses Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   ✅ 7. GET ALL ROUTES
   GET /api/admin/routes/:adminId
============================================================ */
export const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find({ institute: req.params.adminId })
            .populate("assignedBuses");

        res.status(200).json({ success: true, routes });
    } catch (error) {
        console.error("Get Routes Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   ✅ 8. CREATE NOTIFICATION
   POST /api/admin/notification
============================================================ */
export const createNotification = async (req, res) => {
    try {
        const { adminId, title, message } = req.body;

        const admin = await Admin.findById(adminId);
        if (!admin)
            return res.status(404).json({ success: false, message: "Admin not found" });

        admin.notifications.push({ title, message });
        await admin.save();

        res.status(201).json({
            success: true,
            message: "Notification created",
        });
    } catch (error) {
        console.error("Notification Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   ✅ 9. GET NOTIFICATIONS
   GET /api/admin/notification/:adminId
============================================================ */
export const getNotifications = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);

        if (!admin)
            return res.status(404).json({ success: false, message: "Admin not found" });

        res.status(200).json({ success: true, notifications: admin.notifications });
    } catch (error) {
        console.error("Get Notifications Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
