import express from "express";
import {
    saveLocation,
    getLatestLocation,
    getLocationHistory
} from "../controllers/location.js";

const router = express.Router();

router.post("/update", saveLocation);
router.get("/latest/:busId", getLatestLocation);
router.get("/history/:busId", getLocationHistory);

export default router;
