import Student from "../models/Student.js";
import Bus from "../models/Bus.js";
import Driver from "../models/Driver.js";
import Route from "../models/Route.js";
import BusLocation from "../models/BusLocation.js";

/**
 * Get student dashboard (profile + assigned bus, driver, route)
 */
export const getStudentDashboard = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id)
            .populate({
                path: "user",
                select: "name email",
            })
            .populate("assignedBus")
            .populate({
                path: "assignedDriver",
                populate: { path: "user", select: "name email" },
            })
            .populate("assignedRoute");

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({
            student,
            assignedBus: student.assignedBus,
            assignedDriver: student.assignedDriver,
            assignedRoute: student.assignedRoute,
        });
    } catch (error) {
        console.error("❌ Error fetching student dashboard:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Update student profile
 */
export const updateStudentProfile = async (req, res) => {
    try {
        const { studentId } = req.params;
        const updates = req.body;

        const updatedStudent = await Student.findByIdAndUpdate(studentId, updates, {
            new: true,
        }).populate("user assignedBus assignedDriver");

        if (!updatedStudent)
            return res.status(404).json({ message: "Student not found" });

        res.status(200).json({
            message: "Student profile updated successfully",
            student: updatedStudent,
        });
    } catch (error) {
        console.error("Error updating student:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get assigned bus live location
 */
export const getAssignedBusLocation = async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await Student.findById(studentId).populate("assignedBus");
        if (!student) return res.status(404).json({ message: "Student not found" });

        const location = await BusLocation.findOne({
            bus: student.assignedBus._id,
        }).populate("bus driver");

        if (!location)
            return res
                .status(404)
                .json({ message: "No live location found for assigned bus" });

        res.status(200).json(location);
    } catch (error) {
        console.error("Error fetching bus location:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * Get route stops for assigned route
 */
export const getAssignedRouteStops = async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await Student.findById(studentId).populate({
            path: "assignedBus",
            populate: { path: "route" },
        });

        if (!student) return res.status(404).json({ message: "Student not found" });

        const route = student.assignedBus?.route;
        if (!route)
            return res.status(404).json({ message: "No route assigned to this bus" });

        res.status(200).json({
            routeName: route.name,
            stops: route.stops,
        });
    } catch (error) {
        console.error("Error fetching route stops:", error);
        res.status(500).json({ message: "Server error" });
    }
};
