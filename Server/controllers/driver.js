import Driver from "../models/Driver.js";

// Get all drivers
export const getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find()
            .populate("assignedBus")
            .populate("assignedRoute");
        res.json(drivers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch drivers" });
    }
};

// Add new driver
export const addDriver = async (req, res) => {
    try {
        const driver = new Driver(req.body);
        const savedDriver = await driver.save();
        const populatedDriver = await savedDriver
            .populate("assignedBus")
            .populate("assignedRoute")
            .execPopulate();
        res.status(201).json(populatedDriver);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add driver" });
    }
};

// Update driver
export const updateDriver = async (req, res) => {
    try {
        const updatedDriver = await Driver.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate("assignedBus")
            .populate("assignedRoute");
        res.json(updatedDriver);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update driver" });
    }
};
