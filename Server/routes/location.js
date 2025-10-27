import express from "express";
import { updateBusLocation, getBusLocation } from "../controllers/location.js";

const router = express.Router();

router.post("/update", updateBusLocation);     // called by driver app
router.get("/:busId", getBusLocation);         // called by student/admin

export default router;
