import express from "express";
import {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    assignBusRoute,
    studentDashboard,
    getStudentBusLiveLocation
} from "../controllers/student.js";

const router = express.Router();

// CRUD
router.post("/create", createStudent);
router.get("/all/:adminId", getAllStudents);
router.get("/:id", getStudentById);
router.put("/update/:id", updateStudent);
router.delete("/delete/:id", deleteStudent);

// Assign
router.put("/assign/:id", assignBusRoute);

// Dashboard
router.get("/dashboard/:userId", studentDashboard);

// Live tracking
router.get("/live-location/:busId", getStudentBusLiveLocation);

export default router;
