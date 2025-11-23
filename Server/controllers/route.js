import Route from "../models/Route.js";
import Bus from "../models/Bus.js";
import BusLocation from "../models/BusLocation.js";

/**
 * Create a new route
 */
export const createRoute = async (req, res) => {
    try {
        const { routeName, startPoint, endPoint, totalDistance, estimatedDuration } = req.body;

        if (!routeName || !startPoint || !endPoint) {
            return res.status(400).json({ message: "Route name, start, and end points are required" });
        }

        const route = await Route.create({
            routeName,
            startPoint,
            endPoint,
            totalDistance,
            estimatedDuration,
            institute: req.user._id, // institute auto
        });

        res.status(201).json({ message: "Route created successfully", route });
    } catch (error) {
        console.error("Error creating route:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get all routes
 */
export const getAllRoutes = async (req, res) => {
    try {
        const instituteId = req.user._id; // req.user comes from your protect middleware
        const routes = await Route.find({ institute: instituteId })
            .populate("assignedBuses") // optional, to get bus info
            .sort({ createdAt: -1 }); // newest first

        res.status(200).json(routes);
    } catch (err) {
        console.error("Error fetching routes:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get single route by ID (with assigned buses + live locations)
 */
export const getRouteById = async (req, res) => {
    try {
        const { routeId } = req.params;
        const route = await Route.findById(routeId).populate("assignedBuses");
        if (!route) return res.status(404).json({ message: "Route not found" });

        const liveLocations = await BusLocation.find({
            bus: { $in: route.assignedBuses },
        }).populate("bus driver");

        res.status(200).json({ route, liveLocations });
    } catch (error) {
        console.error("Error fetching route details:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Update route
 */
export const updateRoute = async (req, res) => {
    try {
        const { routeId } = req.params;
        const updates = req.body;

        const updatedRoute = await Route.findByIdAndUpdate(routeId, updates, { new: true }).populate("assignedBuses");

        if (!updatedRoute) return res.status(404).json({ message: "Route not found" });

        res.status(200).json({ message: "Route updated successfully", route: updatedRoute });
    } catch (error) {
        console.error("Error updating route:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Delete route
 */
export const deleteRoute = async (req, res) => {
    try {
        const { routeId } = req.params;

        const route = await Route.findByIdAndDelete(routeId);
        if (!route) return res.status(404).json({ message: "Route not found" });

        await Bus.updateMany({ route: routeId }, { $unset: { route: "" } });

        res.status(200).json({ message: "Route deleted successfully" });
    } catch (error) {
        console.error("Error deleting route:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Assign bus to route
 */
export const assignBusToRoute = async (req, res) => {
    try {
        const { routeId, busId } = req.body;

        const route = await Route.findById(routeId);
        const bus = await Bus.findById(busId);

        if (!route || !bus) return res.status(404).json({ message: "Bus or Route not found" });

        bus.route = routeId;
        await bus.save();

        if (!route.assignedBuses.includes(busId)) {
            route.assignedBuses.push(busId);
            await route.save();
        }

        res.status(200).json({ message: "Bus assigned to route successfully" });
    } catch (error) {
        console.error("Error assigning bus to route:", error);
        res.status(500).json({ message: "Server error" });
    }
};
