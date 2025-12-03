import Admin from "../models/Admin.js";
import Driver from "../models/Driver.js";
import User from "../models/User.js";
import Bus from "../models/Bus.js";
import Route from "../models/Route.js";
import bcrypt from "bcryptjs";

// ============================================================
// CREATE DRIVER
// ============================================================
export const createDriver = async (req, res) => {
    try {
        const {
            name,
            email,
            contactNumber,
            address,
            driverId,
            institute,
            assignedBus,
            assignedRoute,
        } = req.body;

        // Duplicate email check
        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Email already exists" });

        // Duplicate driverId check
        const existingDriver = await Driver.findOne({ driverId });
        if (existingDriver)
            return res.status(400).json({ message: "Driver ID already exists" });

        // ⭐ NO HASHING HERE — schema hashes automatically
        const user = await User.create({
            name,
            email,
            password: driverId, // RAW
            role: "driver",
        });

        const driver = await Driver.create({
            userId: user._id,
            name,
            driverId,
            contactNumber,
            address,
            institute,
            assignedBus,
            assignedRoute,
        });

        // Add to admin
        await Admin.findByIdAndUpdate(institute, {
            $addToSet: { drivers: driver._id }
        });

        // Assign to bus
        if (assignedBus) {
            await Bus.findByIdAndUpdate(assignedBus, {
                assignedDriver: driver._id,
            });
        }

        // Assign to route
        if (assignedRoute) {
            await Route.findByIdAndUpdate(assignedRoute, {
                $addToSet: { assignedDrivers: driver._id }
            });
        }

        res.status(201).json({
            success: true,
            message: "Driver created successfully",
            driver,
        });

    } catch (err) {
        console.error("Create Driver Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
};


// ============================================================
// ✅ GET ALL DRIVERS OF ADMIN
// GET /api/drivers/all/:adminId
// ============================================================
export const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find({ institute: req.params.adminId })
            .populate("assignedBus", "busId busNumberPlate assignedRoute")
            .populate("assignedRoute", "routeName startPoint endPoint");

        res.status(200).json({ success: true, drivers });
    } catch (error) {
        console.error("Get All Drivers Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ✅ GET ONE DRIVER
// GET /api/drivers/:id
// ============================================================
export const getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id)
            .populate("assignedBus")
            .populate("assignedRoute");

        if (!driver)
            return res.status(404).json({ message: "Driver not found" });

        res.status(200).json({ success: true, driver });
    } catch (error) {
        console.error("Get Driver Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ✅ UPDATE DRIVER
// PUT /api/drivers/update/:id
// ============================================================
export const updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!driver)
            return res.status(404).json({ message: "Driver not found" });

        res.status(200).json({
            success: true,
            message: "Driver updated successfully",
            driver,
        });
    } catch (error) {
        console.error("Update Driver Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ❌ DELETE DRIVER
// DELETE /api/drivers/delete/:id
// ============================================================
export const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        if (!driver)
            return res.status(404).json({ message: "Driver not found" });

        // Delete login account
        await User.findByIdAndDelete(driver.userId);

        // Delete driver profile
        await Driver.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Driver deleted successfully",
        });
    } catch (error) {
        console.error("Delete Driver Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ✅ ASSIGN BUS & ROUTE TO DRIVER (2-WAY SAFE)
// PUT /api/drivers/assign/:driverId
// ============================================================
export const assignBusRoute = async (req, res) => {
    try {
        const { assignedBus, assignedRoute } = req.body;
        const driverId = req.params.driverId;

        const driver = await Driver.findById(driverId);
        if (!driver)
            return res.status(404).json({ message: "Driver not found" });

        // Remove from old bus
        if (driver.assignedBus) {
            await Bus.findByIdAndUpdate(driver.assignedBus, {
                assignedDriver: null,
            });
        }

        // Remove from old route
        if (driver.assignedRoute) {
            await Route.findByIdAndUpdate(driver.assignedRoute, {
                assignedDriver: null,
            });
        }

        // Assign new bus
        if (assignedBus) {
            await Bus.findByIdAndUpdate(assignedBus, {
                assignedDriver: driverId,
            });
        }

        // Assign new route (single)
        if (assignedRoute) {
            await Route.findByIdAndUpdate(assignedRoute, {
                assignedDriver: driverId,
            });
        }

        driver.assignedBus = assignedBus;
        driver.assignedRoute = assignedRoute;
        await driver.save();

        res.status(200).json({
            success: true,
            message: "Driver updated successfully",
            driver,
        });

    } catch (error) {
        console.error("Assign Bus/Route Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ✅ DRIVER DASHBOARD
// GET /api/drivers/dashboard/:userId
// ============================================================
export const driverDashboard = async (req, res) => {
    try {
        const driver = await Driver.findOne({ userId: req.params.userId })
            .populate("assignedBus")
            .populate("assignedRoute");

        if (!driver)
            return res.status(404).json({ message: "Driver not found" });

        res.status(200).json({
            success: true,
            dashboard: {
                driver,
                bus: driver.assignedBus,
                route: driver.assignedRoute,
            },
        });
    } catch (error) {
        console.error("Driver Dashboard Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
