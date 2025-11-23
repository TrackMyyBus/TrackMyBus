import express from "express";
import {
    getDrivers,
    addDriver,
    updateDriver,
} from "../controllers/driver.js";

const router = express.Router();

// GET all drivers
router.get("/", getDrivers);

// POST new driver
router.post("/", addDriver);

// PUT update driver
router.put("/:id", updateDriver);

export default router;
