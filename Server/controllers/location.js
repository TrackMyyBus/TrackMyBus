import BusLocation from "../models/BusLocation.js";

// 📍 Update location (called by driver)
export const updateBusLocation = async (req, res) => {
    try {
        const { busId, latitude, longitude, speed } = req.body;

        if (!busId || !latitude || !longitude) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Store or update location
        const updatedLocation = await BusLocation.findOneAndUpdate(
            { busId },
            { latitude, longitude, speed, timestamp: new Date() },
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
        const location = await BusLocation.findOne({ busId });

        if (!location) {
            return res.status(404).json({ message: "No location found" });
        }

        res.status(200).json({ success: true, data: location });
    } catch (err) {
        console.error("Error fetching bus location:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
