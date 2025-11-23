import express from "express";
import {
    createRoute,
    getAllRoutes,
    getRouteById,
    updateRoute,
    deleteRoute,
    assignBusToRoute,
} from "../controllers/route.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ROUTE CRUD
router.post("/", protect, createRoute);

// GET ALL ROUTES for current admin/institute
router.get("/", protect, getAllRoutes);

router.get("/:routeId", protect, getRouteById);
router.put("/:routeId", protect, updateRoute);
router.delete("/:routeId", protect, deleteRoute);

// ASSIGN BUS
router.post("/assign", protect, assignBusToRoute);

export default router;
