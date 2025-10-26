import express from "express";
import { getDrivers, addDriver, updateDriver } from "../controllers/driver.js";
const router = express.Router();

router.get("/", getDrivers);
router.post("/add", addDriver);
router.put("/:id", updateDriver);

export default router;
