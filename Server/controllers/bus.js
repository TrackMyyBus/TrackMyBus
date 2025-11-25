import Admin from "../models/Admin.js";
import Bus from "../models/Bus.js";
import Driver from "../models/Driver.js";
import Route from "../models/Route.js";

// ============================================================
// CREATE BUS
// ============================================================
export const createBus = async (req, res) => {
    try {
        const {
            busId,
            busNumberPlate,
            institute,
            assignedDriver,
            assignedRoute,
        } = req.body;

        const bus = await Bus.create({
            busId,
            busNumberPlate,
            institute,
            assignedDriver,
            assignedRoute,
        });

        // ⭐ Add bus to Admin DB
        await Admin.findByIdAndUpdate(institute, {
            $addToSet: { buses: bus._id },
        });

        // ⭐ If driver assigned
        if (assignedDriver) {
            await Driver.findByIdAndUpdate(assignedDriver, {
                assignedBus: bus._id,
            });
        }

        // ⭐ If route assigned
        if (assignedRoute) {
            await Route.findByIdAndUpdate(assignedRoute, {
                $addToSet: { assignedBuses: bus._id },
            });
        }

        res.status(201).json({
            success: true,
            message: "Bus created successfully",
            bus,
        });
    } catch (error) {
        console.error("Create Bus Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ============================================================
// ✅ GET ALL BUSES (ADMIN)
// GET /api/bus/all/:adminId
// ============================================================
export const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find({ institute: req.params.adminId })
            .populate("assignedDriver", "name driverId contactNumber")
            .populate("assignedRoute", "routeName startPoint endPoint");

        res.status(200).json({ success: true, buses });
    } catch (error) {
        console.error("Get All Buses Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ✅ GET BUS BY ID
// GET /api/bus/:id
// ============================================================
export const getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id)
            .populate("assignedDriver", "name driverId contactNumber")
            .populate("assignedRoute", "routeName startPoint endPoint");

        if (!bus) return res.status(404).json({ message: "Bus not found" });

        res.status(200).json({ success: true, bus });
    } catch (error) {
        console.error("Get Bus Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ✅ UPDATE BUS
// PUT /api/bus/update/:id
// ============================================================
export const updateBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!bus) return res.status(404).json({ message: "Bus not found" });

        res.status(200).json({
            success: true,
            message: "Bus updated successfully",
            bus,
        });
    } catch (error) {
        console.error("Update Bus Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ❌ DELETE BUS
// DELETE /api/bus/delete/:id
// ============================================================
export const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);
        if (!bus) return res.status(404).json({ message: "Bus not found" });

        // Remove driver assignment
        if (bus.assignedDriver) {
            await Driver.findByIdAndUpdate(bus.assignedDriver, {
                assignedBus: null,
            });
        }

        // Remove from route
        if (bus.assignedRoute) {
            await Route.findByIdAndUpdate(bus.assignedRoute, {
                $pull: { assignedBuses: bus._id },
            });
        }

        await Bus.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Bus deleted successfully",
        });
    } catch (error) {
        console.error("Delete Bus Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ============================================================
// ✅ ASSIGN DRIVER → BUS (2-WAY)
// PUT /api/bus/assign-driver/:busId
// ============================================================
export const assignDriver = async (req, res) => {
    try {
        const { driverId } = req.body;
        const busId = req.params.busId;

        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ message: "Bus not found" });

        // Remove driver from old bus
        if (bus.assignedDriver) {
            await Driver.findByIdAndUpdate(bus.assignedDriver, {
                assignedBus: null,
            });
        }

        // Assign new driver
        bus.assignedDriver = driverId;
        await bus.save();

        await Driver.findByIdAndUpdate(driverId, {
            assignedBus: busId,
        });

        res.json({ success: true, bus });
    } catch (err) {
        console.error("Assign Driver Error:", err);
        res.status(500).json(err);
    }
};

// ============================================================
// ✅ ASSIGN ROUTE → BUS (2-WAY)
// PUT /api/bus/assign-route/:busId
// ============================================================
export const assignRoute = async (req, res) => {
    try {
        const busId = req.params.busId;
        const { routeId } = req.body;

        const bus = await Bus.findById(busId);
        if (!bus) return res.status(404).json({ message: "Bus not found" });

        // Remove from old route
        if (bus.assignedRoute) {
            await Route.findByIdAndUpdate(bus.assignedRoute, {
                $pull: { assignedBuses: busId },
            });
        }

        // Assign new route
        bus.assignedRoute = routeId;
        await bus.save();

        await Route.findByIdAndUpdate(routeId, {
            $addToSet: { assignedBuses: busId },
        });

        res.json({ success: true, bus });
    } catch (err) {
        console.error("Assign Route Error:", err);
        res.status(500).json(err);
    }
};

// ============================================================
// ✅ FULL BUS INFO (bus + driver + route)
// GET /api/bus/info/:busId
// ============================================================
export const getBusFullInfo = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.busId)
            .populate("assignedDriver")
            .populate("assignedRoute");

        if (!bus)
            return res.status(404).json({ message: "Bus not found" });

        res.status(200).json({
            success: true,
            bus,
            driver: bus.assignedDriver || null,
            route: bus.assignedRoute || null,
        });
    } catch (error) {
        console.error("Bus Info Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
