import express from "express";
import {
    createBus,
    getAllBuses,
    getBusById,
    updateBus,
    deleteBus,
    assignDriver,
    assignRoute,
    getBusFullInfo
} from "../controllers/bus.js";

const router = express.Router();

// CRUD
router.post("/create", createBus);
router.get("/all/:adminId", getAllBuses);
router.get("/:id", getBusById);
router.put("/update/:id", updateBus);
router.delete("/delete/:id", deleteBus);

// Assignments
router.put("/assign-driver/:busId", assignDriver);
router.put("/assign-route/:busId", assignRoute);

// Bus+Driver+Route info
router.get("/info/:busId", getBusFullInfo);

export default router;
