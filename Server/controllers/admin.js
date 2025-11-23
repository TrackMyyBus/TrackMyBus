import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Driver from "../models/Driver.js";
import Bus from "../models/Bus.js";
import Route from "../models/Route.js";
import bcrypt from "bcryptjs";

/** Create a new admin */
export const createAdmin = async (req, res) => {
    try {
        const { instituteName, instituteCode, email, password, contactNumber, address, city, state } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: instituteName,
            email,
            password: hashedPassword,
            role: "admin",
        });

        const admin = await Admin.create({
            instituteName,
            instituteCode,
            email,
            password: hashedPassword,
            contactNumber,
            address,
            city,
            state,
        });

        res.status(201).json({ message: "Admin created successfully", admin });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/** Create a new driver */
export const createDriver = async (req, res) => {
    try {
        const { name, email, password, contactNumber } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Driver already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "driver",
        });

        const driver = await Driver.create({
            name,
            email,
            contactNumber,
            password: hashedPassword,
            institute: req.user._id, // admin ID
        });

        res.status(201).json({ message: "Driver created successfully", driver });
    } catch (error) {
        console.error("Error creating driver:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/** Create a new student */
export const createStudent = async (req, res) => {
    try {
        const { name, email, password, enrollmentId, enrollmentYear, contactNumber, bus, driver, route } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "Student already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "student",
        });

        const student = await Student.create({
            name,
            email,
            enrollmentId,
            enrollmentYear,
            contactNumber,
            assignedBus: bus,
            assignedDriver: driver,
            assignedRoute: route,
            institute: req.user._id,
        });

        res.status(201).json({ message: "Student created successfully", student });
    } catch (error) {
        console.error("Error creating student:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/** Create a new bus */
export const createBus = async (req, res) => {
    try {
        const { busId, busNumberPlate, assignedDriver, assignedRoute } = req.body;

        const bus = await Bus.create({
            busId,
            busNumberPlate,
            assignedDriver,
            assignedRoute,
            institute: req.user._id,
        });

        res.status(201).json({ message: "Bus created successfully", bus });
    } catch (error) {
        console.error("Error creating bus:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/** Create a new route */
export const createRoute = async (req, res) => {
    try {
        const route = await Route.create({
            ...req.body,
            institute: req.user._id,
        });
        res.status(201).json({ message: "Route created successfully", route });
    } catch (error) {
        console.error("Error creating route:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/** Dashboard data */
export const getAdminDashboardData = async (req, res) => {
    try {
        const instituteId = req.user._id;

        const totalStudents = await Student.countDocuments({ institute: instituteId });
        const totalDrivers = await Driver.countDocuments({ institute: instituteId });
        const totalBuses = await Bus.countDocuments({ institute: instituteId });
        const totalRoutes = await Route.countDocuments({ institute: instituteId });

        res.status(200).json({
            success: true,
            stats: { totalStudents, totalDrivers, totalBuses, totalRoutes },
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/** Update entity */
export const updateUser = async (req, res) => {
    try {
        const { type, id } = req.params;
        const data = req.body;

        let updatedDoc;
        if (type === "student") updatedDoc = await Student.findByIdAndUpdate(id, data, { new: true });
        else if (type === "driver") updatedDoc = await Driver.findByIdAndUpdate(id, data, { new: true });
        else if (type === "bus") updatedDoc = await Bus.findByIdAndUpdate(id, data, { new: true });
        else if (type === "route") updatedDoc = await Route.findByIdAndUpdate(id, data, { new: true });
        else return res.status(400).json({ message: "Invalid type" });

        res.status(200).json({ message: `${type} updated successfully`, updatedDoc });
    } catch (error) {
        console.error("Error updating:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/** Delete entity */
export const deleteUser = async (req, res) => {
    try {
        const { type, id } = req.params;

        if (type === "student") await Student.findByIdAndDelete(id);
        else if (type === "driver") await Driver.findByIdAndDelete(id);
        else if (type === "bus") await Bus.findByIdAndDelete(id);
        else if (type === "route") await Route.findByIdAndDelete(id);
        else return res.status(400).json({ message: "Invalid type" });

        res.status(200).json({ message: `${type} deleted successfully` });
    } catch (error) {
        console.error("Error deleting:", error);
        res.status(500).json({ message: "Server error" });
    }
};
