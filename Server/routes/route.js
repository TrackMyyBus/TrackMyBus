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

// CRUD
router.post("/create", createRoute);
router.get("/all/:adminId", getAllRoutes);
router.get("/:id", getRouteById);
router.put("/update/:id", updateRoute);
router.delete("/delete/:id", deleteRoute);

// Assign bus
router.put("/assign-bus/:routeId", assignBusToRoute);

export default router;
