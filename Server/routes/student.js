import express from "express";
import { getStudents, addStudent, updateStudent } from "../controllers/student.js";
const router = express.Router();

router.get("/", getStudents);
router.post("/add", addStudent);
router.put("/:id", updateStudent);

export default router;
