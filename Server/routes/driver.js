import express from "express";
import {
    getDriverDashboard,
    updateDriverProfile,
    updateBusLocation,
    getBusLocation,
} from "../controllers/driver.js";

const router = express.Router();

// Get driver dashboard (assigned bus, route, students)
router.get("/dashboard/:driverId", getDriverDashboard);

// Update driver profile
router.put("/update/:driverId", updateDriverProfile);

// Update or send live bus location
router.post("/update-location/:driverId", updateBusLocation);

// Get live bus location by busId
router.get("/bus-location/:busId", getBusLocation);

export default router;
