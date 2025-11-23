import express from "express";
import {
    getStudents,
    addStudent,
    updateStudent,
} from "../controllers/student.js";

const router = express.Router();

// GET all students
router.get("/", getStudents);

// POST new student
router.post("/", addStudent);

// PUT update student
router.put("/:id", updateStudent);

export default router;
