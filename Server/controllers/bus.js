import Bus from "../models/Bus.js";

// Create a new bus
export const createBus = async (req, res) => {
    try {
        const busData = {
            ...req.body,
            institute: req.user._id, // Automatically assign logged-in admin
        };

        const bus = await Bus.create(busData);
        res.status(201).json(bus);
    } catch (err) {
        console.error("❌ Error creating bus:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// Update a bus
export const updateBus = async (req, res) => {
    try {
        const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedBus) {
            return res.status(404).json({ message: "Bus not found" });
        }

        res.json(updatedBus);
    } catch (err) {
        console.error("❌ Error updating bus:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// Get all buses for this admin
export const getBuses = async (req, res) => {
    try {
        const buses = await Bus.find({ institute: req.user._id })
            .populate("assignedDriver")
            .populate("assignedRoute");

        res.json(buses);
    } catch (err) {
        console.error("❌ Error fetching buses:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// Get single bus
export const getBus = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id)
            .populate("assignedDriver")
            .populate("assignedRoute");

        if (!bus) return res.status(404).json({ message: "Bus not found" });

        res.json(bus);
    } catch (err) {
        console.error("❌ Error fetching bus:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// Delete bus
export const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndDelete(req.params.id);
        if (!bus) return res.status(404).json({ message: "Bus not found" });

        res.json({ message: "Bus deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting bus:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};
