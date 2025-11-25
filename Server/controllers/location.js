import Bus from "../models/Bus.js";
import BusLocation from "../models/BusLocation.js";

// ============================================================
// ✅ SAVE LOCATION (HTTP fallback if WebSockets fail)
// POST /api/location/update
// ============================================================
export const saveLocation = async (req, res) => {
    try {
        const {
            busId,
            driverId,
            latitude,
            longitude,
            speed,
            heading,
            battery
        } = req.body;

        // Update Bus model with latest location
        await Bus.findByIdAndUpdate(busId, {
            currentLocation: {
                latitude,
                longitude,
                speed,
                heading,
                battery,
                lastUpdated: new Date(),
            },
            trackingStatus: "online",
        });

        // Save historical entry
        await BusLocation.create({
            bus: busId,
            driver: driverId,
            latitude,
            longitude,
            speed,
            status: speed > 0 ? "moving" : "stopped",
            timestamp: new Date(),
        });

        res.status(200).json({
            success: true,
            message: "Location updated successfully",
        });

    } catch (error) {
        console.error("Save Location Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ✅ GET LATEST BUS LOCATION
// GET /api/location/latest/:busId
// ============================================================
export const getLatestLocation = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.busId);

        if (!bus)
            return res.status(404).json({ message: "Bus not found" });

        res.status(200).json({
            success: true,
            latest: bus.currentLocation,
        });
    } catch (error) {
        console.error("Latest Location Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ❇️ GET FULL LOCATION HISTORY
// GET /api/location/history/:busId
// ============================================================
export const getLocationHistory = async (req, res) => {
    try {
        const history = await BusLocation.find({ bus: req.params.busId })
            .sort({ timestamp: -1 });

        res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        console.error("Location History Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
