import Admin from "../models/Admin.js";
import Route from "../models/Route.js";
import Bus from "../models/Bus.js";
import Driver from "../models/Driver.js";

/* ============================================================
   CREATE ROUTE
============================================================ */
export const createRoute = async (req, res) => {
    try {
        const {
            institute,
            routeName,
            startPoint,
            endPoint,
            totalDistance,
            estimatedDuration,
            stops,
            assignedDriver,
            assignedBuses,
        } = req.body;

        const route = await Route.create({
            institute,
            routeName,
            startPoint,
            endPoint,
            totalDistance,
            estimatedDuration,
            stops,
            assignedDriver: assignedDriver || null,
            assignedBuses: assignedBuses || [],
        });

        // Add route under Admin
        await Admin.findByIdAndUpdate(institute, {
            $addToSet: { routes: route._id },
        });

        // Assign driver → link both sides
        if (assignedDriver) {
            await Driver.findByIdAndUpdate(assignedDriver, {
                assignedRoute: route._id,
            });
        }

        res.status(201).json({
            success: true,
            message: "Route created successfully",
            route,
        });
    } catch (error) {
        console.error("Create Route Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

/* ============================================================
   GET ALL ROUTES
============================================================ */
export const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find({ institute: req.params.adminId })
            .populate("assignedBuses", "busId busNumberPlate assignedDriver")
            .populate("assignedDriver", "driverId name contactNumber");

        res.status(200).json({ success: true, routes });
    } catch (error) {
        console.error("Get All Routes Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   GET ROUTE BY ID
============================================================ */
export const getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id)
            .populate("assignedBuses", "busId busNumberPlate assignedDriver")
            .populate("assignedDriver", "driverId name contactNumber");

        if (!route)
            return res.status(404).json({ message: "Route not found" });

        res.status(200).json({ success: true, route });
    } catch (error) {
        console.error("Get Route Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   UPDATE ROUTE
============================================================ */
export const updateRoute = async (req, res) => {
    try {
        const { assignedDriver } = req.body;

        // FIX: do not send empty string to ObjectId
        if (assignedDriver === "") {
            delete req.body.assignedDriver;
        }

        const route = await Route.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!route)
            return res.status(404).json({ message: "Route not found" });

        /* -------------------------------------------
           DRIVER LINK UPDATE
        --------------------------------------------- */
        if (assignedDriver) {
            // Remove driver from old routes
            await Route.updateMany(
                { assignedDriver },
                { $set: { assignedDriver: null } }
            );

            // Assign route → driver
            await Driver.findByIdAndUpdate(assignedDriver, {
                assignedRoute: route._id,
            });
        }

        res.status(200).json({
            success: true,
            message: "Route updated successfully",
            route,
        });
    } catch (error) {
        console.error("Update Route Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   DELETE ROUTE
============================================================ */
export const deleteRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route)
            return res.status(404).json({ message: "Route not found" });

        // Remove route from buses
        await Bus.updateMany(
            { assignedRoute: route._id },
            { $set: { assignedRoute: null } }
        );

        // Remove route link from driver
        if (route.assignedDriver) {
            await Driver.findByIdAndUpdate(route.assignedDriver, {
                $set: { assignedRoute: null },
            });
        }

        await Route.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Route deleted successfully",
        });
    } catch (error) {
        console.error("Delete Route Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   ASSIGN BUS TO ROUTE
============================================================ */
export const assignBusToRoute = async (req, res) => {
    try {
        const { busId } = req.body;
        const routeId = req.params.routeId;

        const route = await Route.findById(routeId);
        if (!route)
            return res.status(404).json({ message: "Route not found" });

        const bus = await Bus.findById(busId);
        if (!bus)
            return res.status(404).json({ message: "Bus not found" });

        // Remove bus from previous route
        if (bus.assignedRoute && bus.assignedRoute.toString() !== routeId) {
            await Route.findByIdAndUpdate(bus.assignedRoute, {
                $pull: { assignedBuses: bus._id },
            });
        }

        // Assign new route to bus
        bus.assignedRoute = routeId;
        await bus.save();

        // Add bus to route's bus list
        await Route.findByIdAndUpdate(routeId, {
            $addToSet: { assignedBuses: bus._id },
        });

        res.json({
            success: true,
            message: "Bus assigned to route successfully",
            route,
        });
    } catch (error) {
        console.error("Assign Bus to Route Error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

/* ============================================================
   ASSIGN DRIVER TO ROUTE
============================================================ */
export const assignDriverToRoute = async (req, res) => {
    try {
        const { driverId } = req.body;
        const routeId = req.params.routeId;

        const route = await Route.findById(routeId);
        if (!route)
            return res.status(404).json({ message: "Route not found" });

        const driver = await Driver.findById(driverId);
        if (!driver)
            return res.status(404).json({ message: "Driver not found" });

        // Remove driver from all routes
        await Route.updateMany(
            { assignedDriver: driverId },
            { $set: { assignedDriver: null } }
        );

        // Assign new driver
        route.assignedDriver = driverId;
        await route.save();

        // Update driver model link
        driver.assignedRoute = routeId;
        await driver.save();

        res.json({
            success: true,
            message: "Driver assigned to route successfully",
            route,
        });
    } catch (error) {
        console.error("Assign Driver Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
