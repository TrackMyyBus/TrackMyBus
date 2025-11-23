import Student from "../models/Student.js";

// Get all students
export const getStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("assignedBus")
            .populate("assignedDriver")
            .populate("assignedRoute");
        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch students" });
    }
};

// Add new student
export const addStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        const savedStudent = await student.save();
        const populatedStudent = await savedStudent
            .populate("assignedBus")
            .populate("assignedDriver")
            .populate("assignedRoute")
            .execPopulate();
        res.status(201).json(populatedStudent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add student" });
    }
};

// Update student
export const updateStudent = async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate("assignedBus")
            .populate("assignedDriver")
            .populate("assignedRoute");
        res.json(updatedStudent);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update student" });
    }
};
