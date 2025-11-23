import express from "express";
import {
    createAdmin,
    createDriver,
    createStudent,
    createRoute,
    createBus,
    getAdminDashboardData,
    updateUser,
    deleteUser,
} from "../controllers/admin.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ✅ Protect routes that require authentication
router.post("/create-admin", protect, createAdmin);
router.post("/create-driver", protect, createDriver);
router.post("/create-student", protect, createStudent);
router.post("/create-route", protect, createRoute);
router.post("/create-bus", protect, createBus);
router.get("/dashboard", protect, getAdminDashboardData);
router.put("/update/:type/:id", protect, updateUser);
router.delete("/delete/:type/:id", protect, deleteUser);

export default router;
