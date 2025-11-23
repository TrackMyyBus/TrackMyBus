import express from "express";
import {
    createBus,
    updateBus,
    getBuses,
    getBus,
    deleteBus,
} from "../controllers/bus.js";
import { protect, verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// All routes require admin access
router.use(protect, verifyAdmin);

router.post("/", createBus);        // Add bus
router.get("/", getBuses);          // Get all buses
router.get("/:id", getBus);         // Get single bus
router.put("/:id", updateBus);      // Update bus
router.delete("/:id", deleteBus);   // Delete bus

export default router;
