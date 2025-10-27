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

const router = express.Router();

// Create new Admin (Institute)
router.post("/create-admin", createAdmin);

// Create new Driver account
router.post("/create-driver", createDriver);

// Create new Student account
router.post("/create-student", createStudent);

// Create new Route
router.post("/create-route", createRoute);

// Create new Bus
router.post("/create-bus", createBus);

// Get full dashboard overview
router.get("/dashboard", getAdminDashboardData);

// Update student, driver, route, or bus
// Example: PUT /api/admin/update/student/:id
router.put("/update/:type/:id", updateUser);

// Delete student, driver, route, or bus
// Example: DELETE /api/admin/delete/student/:id
router.delete("/delete/:type/:id", deleteUser);

export default router;
