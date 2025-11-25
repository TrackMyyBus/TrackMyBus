import express from "express";
import {
    createDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    deleteDriver,
    assignBusRoute,
    driverDashboard
} from "../controllers/driver.js";

const router = express.Router();

// CRUD
router.post("/create", createDriver);
router.get("/all/:adminId", getAllDrivers);
router.get("/:id", getDriverById);
router.put("/update/:id", updateDriver);
router.delete("/delete/:id", deleteDriver);

// Assign
router.put("/assign/:driverId", assignBusRoute);

// Dashboard
router.get("/dashboard/:userId", driverDashboard);

export default router;
