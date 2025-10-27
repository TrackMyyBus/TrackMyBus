import Driver from "../models/Driver.js";
import Bus from "../models/Bus.js";
import Route from "../models/Route.js";
import Student from "../models/Student.js";
import BusLocation from "../models/BusLocation.js";

/**
 * Get driver dashboard (assigned bus, route, and students)
 */
export const getDriverDashboard = async (req, res) => {
    try {
        const { driverId } = req.params;

        const driver = await Driver.findById(driverId)
            .populate("user assignedBus")
            .lean();

        if (!driver) return res.status(404).json({ message: "Driver not found" });

        const bus = await Bus.findById(driver.assignedBus)
            .populate("route")
            .lean();

        const students = await Student.find({ assignedDriver: driverId })
            .populate("user assignedBus")
            .lean();

        res.status(200).json({
            driver,
            assignedBus: bus,
            assignedRoute: bus?.route,
            students,
        });
    } catch (error) {
        console.error("Error fetching driver dashboard:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Update driver's profile (e.g., phone, license)
 */
export const updateDriverProfile = async (req, res) => {
    try {
        const { driverId } = req.params;
        const updates = req.body;

        const updatedDriver = await Driver.findByIdAndUpdate(driverId, updates, {
            new: true,
        }).populate("user assignedBus");

        if (!updatedDriver)
            return res.status(404).json({ message: "Driver not found" });

        res
            .status(200)
            .json({ message: "Driver profile updated", driver: updatedDriver });
    } catch (error) {
        console.error("Error updating driver:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Update or send live bus location
 */
export const updateBusLocation = async (req, res) => {
    try {
        const { driverId } = req.params;
        const { latitude, longitude } = req.body;

        const driver = await Driver.findById(driverId).populate("assignedBus");

        if (!driver) return res.status(404).json({ message: "Driver not found" });
        if (!driver.assignedBus)
            return res.status(400).json({ message: "No bus assigned to this driver" });

        const updatedLocation = await BusLocation.findOneAndUpdate(
            { bus: driver.assignedBus._id },
            {
                bus: driver.assignedBus._id,
                driver: driver._id,
                latitude,
                longitude,
                lastUpdated: new Date(),
            },
            { upsert: true, new: true }
        );

        res.status(200).json({
            message: "Bus location updated successfully",
            location: updatedLocation,
        });
    } catch (error) {
        console.error("Error updating bus location:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get bus live location (for viewing)
 */
export const getBusLocation = async (req, res) => {
    try {
        const { busId } = req.params;
        const location = await BusLocation.findOne({ bus: busId }).populate(
            "bus driver"
        );

        if (!location)
            return res.status(404).json({ message: "No live location found" });

        res.status(200).json(location);
    } catch (error) {
        console.error("Error fetching bus location:", error);
        res.status(500).json({ message: "Server error" });
    }
};
