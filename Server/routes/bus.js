import express from "express";
import { getBuses, addBus, updateBus } from "../controllers/bus.js";
const router = express.Router();

router.get("/", getBuses);
router.post("/add", addBus);
router.put("/:id", updateBus);

export default router;
