import express from "express";
import {
    saveLocation,
    getLatestLocation,
    getLocationHistory
} from "../controllers/location.js";

const router = express.Router();

// Save location
router.post("/update", saveLocation);

// Latest 
router.get("/latest/:busId", getLatestLocation);

// History
router.get("/history/:busId", getLocationHistory);

export default router;
