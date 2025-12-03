import Bus from "../models/Bus.js";
import BusLocation from "../models/BusLocation.js";

// SAVE LOCATION
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

        await BusLocation.create({
            bus: busId,
            driver: driverId,
            latitude,
            longitude,
            speed,
            heading,
            battery,
            status: speed > 0 ? "moving" : "stopped",
            timestamp: new Date(),
        });

        return res.json({ success: true, message: "Location updated" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// LATEST LOCATION
export const getLatestLocation = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.busId);

        if (!bus) return res.status(404).json({ message: "Bus not found" });

        res.json({ success: true, latest: bus.currentLocation });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// HISTORY
export const getLocationHistory = async (req, res) => {
    try {
        const history = await BusLocation.find({ bus: req.params.busId })
            .sort({ timestamp: -1 });

        res.json({ success: true, history });

    } catch (err) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
