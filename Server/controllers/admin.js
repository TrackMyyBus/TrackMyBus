import mongoose from "mongoose";
import Admin from "../models/Admin.js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Driver from "../models/Driver.js";
import Bus from "../models/Bus.js";
import Route from "../models/Route.js";
import BusLocation from "../models/BusLocation.js";
import bcrypt from "bcryptjs";

/**
 * Create a new admin (institute)
 */
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, contactNumber, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    const admin = await Admin.create({
      user: user._id,
      contactNumber,
      department,
    });

    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new driver account
 */
export const createDriver = async (req, res) => {
  try {
    const { name, email, password, licenseNumber, phone } = req.body;

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
      user: user._id,
      licenseNumber,
      phone,
    });

    res.status(201).json({ message: "Driver created successfully", driver });
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new student account
 */
export const createStudent = async (req, res) => {
  try {
    if (!req.admin) {
      return res
        .status(400)
        .json({ message: "Admin context missing, please login again" });
    }

    const {
      name,
      enrollmentId,
      enrollmentYear,
      email,
      contactNumber,
      address,
      assignedBus,
      assignedDriver,
      assignedRoute,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Student already exists" });

    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    const student = await Student.create({
      user: user._id,
      institute: req.admin._id, // 👈 auto-linked here
      name,
      enrollmentId,
      enrollmentYear,
      email,
      contactNumber,
      address,
      assignedBus,
      assignedDriver,
      assignedRoute,
    });

    const populatedStudent = await Student.findById(student._id).populate([
      "assignedBus",
      "assignedDriver",
      "assignedRoute",
      { path: "institute", model: "Admin" },
    ]);

    res.status(201).json({
      message: "Student created successfully",
      student: populatedStudent,
    });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Create a new bus
 */
export const createBus = async (req, res) => {
  try {
    const {
      institute,
      busId,
      busNumberPlate,
      capacity,
      modelName,
      assignedDriver,
      assignedRoute,
    } = req.body;

    if (!institute || !busId || !busNumberPlate || !capacity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // ✅ Convert string to ObjectId
    const instituteId = new mongoose.Types.ObjectId(institute);

    const bus = await Bus.create({
      institute: instituteId,
      busId,
      busNumberPlate,
      capacity,
      modelName,
      assignedDriver,
      assignedRoute,
    });

    res.status(201).json({
      message: "Bus created successfully",
      bus,
    });
  } catch (error) {
    console.error("Error creating bus:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all data overview (dashboard)
 */
export const getAdminDashboardData = async (req, res) => {
  try {
    const [students, drivers, buses, routes, locations] = await Promise.all([
      Student.find().populate("assignedBus assignedDriver assignedRoute"),
      Driver.find().populate("assignedBus"),
      Bus.find().populate("assignedDriver assignedRoute"),
      Route.find(),
      // ✅ FIX: use "driver" instead of "assignedDriver"
      BusLocation.find().populate("bus driver"),
    ]);

    res.status(200).json({
      students,
      drivers,
      buses,
      routes,
      liveLocations: locations,
    });
  } catch (error) {
    console.error("Error fetching admin dashboard data:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

/**
 * Update any user (student/driver)
 */
export const updateUser = async (req, res) => {
  try {
    const { type, id } = req.params; // type: "student" | "driver"
    const data = req.body;

    let updatedDoc;
    if (type === "student")
      updatedDoc = await Student.findByIdAndUpdate(id, data, { new: true });
    else if (type === "driver")
      updatedDoc = await Driver.findByIdAndUpdate(id, data, { new: true });
    else if (type === "route")
      updatedDoc = await Route.findByIdAndUpdate(id, data, { new: true });
    else if (type === "bus")
      updatedDoc = await Bus.findByIdAndUpdate(id, data, { new: true });

    if (!updatedDoc) return res.status(404).json({ message: "Not found" });

    res
      .status(200)
      .json({ message: `${type} updated successfully`, updatedDoc });
  } catch (error) {
    console.error("Error updating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Delete a user (student/driver/route/bus)
 */
export const deleteUser = async (req, res) => {
  try {
    const { type, id } = req.params;

    if (type === "student") await Student.findByIdAndDelete(id);
    else if (type === "driver") await Driver.findByIdAndDelete(id);
    else if (type === "route") await Route.findByIdAndDelete(id);
    else if (type === "bus") await Bus.findByIdAndDelete(id);
    else return res.status(400).json({ message: "Invalid type" });

    res.status(200).json({ message: `${type} deleted successfully` });
  } catch (error) {
    console.error("Error deleting:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDropdownData = async (req, res) => {
  try {
    const drivers = await Driver.find().select("_id name");
    const routes = await Route.find().select(
      "_id routeName startPoint endPoint"
    );
    const buses = await Bus.find().select("_id busId busNumberPlate");

    res.status(200).json({ drivers, routes, buses });
  } catch (error) {
    console.error("Error fetching dropdown data:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
