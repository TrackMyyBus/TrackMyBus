import express from "express";
import { signup, login, logout } from "../controllers/auth.js";

const router = express.Router();

// Auth Routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
