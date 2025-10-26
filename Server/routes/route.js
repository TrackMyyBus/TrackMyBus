import express from "express";
import { getRoutes, addRoute, updateRoute } from "../controllers/route.js";
const router = express.Router();

router.get("/", getRoutes);
router.post("/add", addRoute);
router.put("/:id", updateRoute);

export default router;
