import express from "express";
import {
    getStudentDashboard,
    updateStudentProfile,
    getAssignedBusLocation,
    getAssignedRouteStops,
} from "../controllers/student.js";

const router = express.Router();

// Get student dashboard
router.get("/dashboard/:studentId", getStudentDashboard);

// Update student profile
router.put("/update/:studentId", updateStudentProfile);

// Get live location of assigned bus
router.get("/bus-location/:studentId", getAssignedBusLocation);

// Get route stops of assigned route
router.get("/route-stops/:studentId", getAssignedRouteStops);

export default router;
