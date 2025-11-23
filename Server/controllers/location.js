import BusLocation from "../models/BusLocation.js";
import Driver from "../models/Driver.js";
import Bus from "../models/Bus.js";


// 📍 Update location (called by driver)
export const updateBusLocation = async (req, res) => {
    try {
        const { busId, driverId, latitude, longitude, speed } = req.body;

        if (!busId || !latitude || !longitude) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const updatedLocation = await BusLocation.findOneAndUpdate(
            { bus: busId },
            {
                bus: busId,
                driver: driverId,
                latitude,
                longitude,
                speed,
                timestamp: new Date(),
                status: speed > 0 ? "moving" : "stopped"
            },
            { upsert: true, new: true }
        );

        res.status(200).json({ success: true, data: updatedLocation });
    } catch (err) {
        console.error("Error updating bus location:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


// 🗺️ Get current location (for student or admin)
export const getBusLocation = async (req, res) => {
    try {
        const { busId } = req.params;
        const location = await BusLocation.findOne({ bus: busId });

        if (!location) {
            return res.status(404).json({ message: "No location found" });
        }

        res.status(200).json({ success: true, data: location });
    } catch (err) {
        console.error("Error fetching bus location:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const startSharingLocation = async (req, res) => {
    try {
        const { driverId, busId } = req.body;
        if (!driverId || !busId) {
            return res.status(400).json({ success: false, message: "driverId and busId are required" });
        }

        const driver = await Driver.findById(driverId);
        if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });

        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ success: false, message: "Bus not found" });

        // Update DB flags
        driver.isSharingLocation = true;
        await driver.save();

        bus.trackingStatus = "online";
        await bus.save();

        return res.status(200).json({ success: true, message: "Driver is now sharing live location" });
    } catch (err) {
        console.error("startSharingLocation error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
