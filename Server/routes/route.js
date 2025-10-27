import express from "express";
import {
    createRoute,
    getAllRoutes,
    getRouteById,
    updateRoute,
    deleteRoute,
    assignBusToRoute,
} from "../controllers/route.js";

const router = express.Router();

// Create new route
router.post("/create", createRoute);

// Get all routes
router.get("/", getAllRoutes);

// Get specific route (with assigned buses and live bus locations)
router.get("/:routeId", getRouteById);

// Update route (name, stops, etc.)
router.put("/update/:routeId", updateRoute);

// Delete route
router.delete("/delete/:routeId", deleteRoute);

// Assign a bus to a route
router.post("/assign-bus", assignBusToRoute);

export default router;
