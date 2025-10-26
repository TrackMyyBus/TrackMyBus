import Student from "../models/Student.js";

export const getStudents = async (req, res) => {
    const students = await Student.find();
    res.json(students);
};

export const addStudent = async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
