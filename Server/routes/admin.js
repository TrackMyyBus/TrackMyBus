import express from "express";
import {
    getOverview,
    getAdminProfile,
    updateAdminProfile,
    getAllStudents,
    getAllDrivers,
    getAllBuses,
    getAllRoutes,
    createNotification,
    getNotifications,
} from "../controllers/admin.js";

const router = express.Router();

// Overview
router.get("/overview/:adminId", getOverview);

// Admin profile
router.get("/profile/:adminId", getAdminProfile);
router.put("/update/:adminId", updateAdminProfile);

// Students
router.get("/students/:adminId", getAllStudents);

// Drivers
router.get("/drivers/:adminId", getAllDrivers);

// Buses
router.get("/buses/:adminId", getAllBuses);

// Routes
router.get("/routes/:adminId", getAllRoutes);

// Notifications
router.post("/notification", createNotification);
router.get("/notification/:adminId", getNotifications);

export default router;
