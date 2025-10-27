import express from "express";
import {
    addBus,
    getAllBuses,
    getBusById,
    updateBus,
    deleteBus,
} from "../controllers/bus.js";

const router = express.Router();

router.post("/add", addBus);
router.get("/", getAllBuses);
router.get("/:id", getBusById);
router.put("/:id", updateBus);
router.delete("/:id", deleteBus);

export default router;
