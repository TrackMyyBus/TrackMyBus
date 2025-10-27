import Bus from "../models/Bus.js";
import Driver from "../models/Driver.js";
import Route from "../models/Route.js";

// ✅ Add a new bus
export const addBus = async (req, res) => {
    try {
        const { busNumber, busPlateNumber, capacity, assignedDriver, route } = req.body;

        // Check if bus already exists
        const existingBus = await Bus.findOne({ busNumber });
        if (existingBus)
            return res.status(400).json({ message: "Bus with this number already exists" });

        // Optional: validate driver or route existence
        if (assignedDriver) {
            const driverExists = await Driver.findById(assignedDriver);
            if (!driverExists)
                return res.status(400).json({ message: "Assigned driver not found" });
        }

        if (route) {
            const routeExists = await Route.findById(route);
            if (!routeExists)
                return res.status(400).json({ message: "Assigned route not found" });
        }

        const newBus = await Bus.create({
            busNumber,
            busPlateNumber,
            capacity,
            assignedDriver,
            route,
        });

        res.status(201).json({ message: "Bus added successfully", bus: newBus });
    } catch (error) {
        console.error("Error adding bus:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get all buses
export const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find()
            .populate("assignedDriver", "name contactNumber licenseNumber")
            .populate("route", "routeName startPoint endPoint totalStops");
        res.status(200).json(buses);
    } catch (error) {
        console.error("Error fetching buses:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Get single bus by ID
export const getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id)
            .populate("assignedDriver", "name contactNumber licenseNumber")
            .populate("route", "routeName startPoint endPoint totalStops");

        if (!bus) return res.status(404).json({ message: "Bus not found" });

        res.status(200).json(bus);
    } catch (error) {
        console.error("Error fetching bus:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update bus details
export const updateBus = async (req, res) => {
    try {
        const { busNumber, busPlateNumber, capacity, assignedDriver, route, isActive } = req.body;

        const updatedBus = await Bus.findByIdAndUpdate(
            req.params.id,
            { busNumber, busPlateNumber, capacity, assignedDriver, route, isActive },
            { new: true }
        );

        if (!updatedBus) return res.status(404).json({ message: "Bus not found" });

        res.status(200).json({ message: "Bus updated successfully", bus: updatedBus });
    } catch (error) {
        console.error("Error updating bus:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Delete a bus
export const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) return res.status(404).json({ message: "Bus not found" });

        res.status(200).json({ message: "Bus deleted successfully" });
    } catch (error) {
        console.error("Error deleting bus:", error);
        res.status(500).json({ message: "Server error" });
    }
};
