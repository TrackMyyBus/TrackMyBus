import mongoose from "mongoose";
import dotenv from "dotenv";

// Import all models
import Admin from "./models/Admin.js";
import Driver from "./models/Driver.js";
import Student from "./models/Student.js";
import Route from "./models/Route.js";
import Bus from "./models/Bus.js";
import BusLocation from "./models/BusLocation.js";
import User from "./models/User.js";

dotenv.config();

// 🧩 Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ Connection Error:", err));

// ✅ Helper to create users (NO MANUAL HASHING)
const createUser = async (name, email, password, role) => {
    const existing = await User.findOne({ email });
    if (existing) return existing; // Skip if exists
    return await User.create({ name, email, password, role });
};

// ✅ Main Seeder Function
const seedData = async () => {
    try {
        console.log("🧹 Clearing old data...");
        await Promise.all([
            Admin.deleteMany({}),
            Driver.deleteMany({}),
            Student.deleteMany({}),
            Route.deleteMany({}),
            Bus.deleteMany({}),
            BusLocation.deleteMany({}),
            User.deleteMany({}),
        ]);

        console.log("✅ Old data cleared!");

        // 1️⃣ Create Admins
        const admin1 = await Admin.create({
            instituteName: "ABC Institute of Technology",
            instituteCode: "INST001",
            email: "admin1@abc.edu",
            password: "Admin@123", // plain — will be hashed by schema
            contactNumber: "9876543210",
            address: "Sector 21, Delhi",
            city: "New Delhi",
            state: "Delhi",
            notifications: [
                {
                    title: "System Ready",
                    message: "Admin account created successfully",
                },
            ],
        });

        const admin2 = await Admin.create({
            instituteName: "XYZ College of Engineering",
            instituteCode: "INST002",
            email: "admin2@xyz.edu",
            password: "Admin@123",
            contactNumber: "9988776655",
            address: "Sector 12, Noida",
            city: "Noida",
            state: "UP",
            notifications: [
                { title: "Setup Complete", message: "Admin created successfully" },
            ],
        });

        await createUser(admin1.instituteName, admin1.email, "Admin@123", "admin");
        await createUser(admin2.instituteName, admin2.email, "Admin@123", "admin");

        console.log("✅ Admins added!");

        // 2️⃣ Create Drivers
        const drivers = await Driver.insertMany([
            {
                institute: admin1._id,
                driverId: "DRV001",
                name: "Ravi Kumar",
                email: "ravi.kumar@abc.edu",
                password: "Driver@123",
                contactNumber: "9812345678",
                licenseNumber: "DL12345",
                location: { latitude: 28.7041, longitude: 77.1025 },
                status: "active",
            },
            {
                institute: admin2._id,
                driverId: "DRV002",
                name: "Amit Sharma",
                email: "amit.sharma@xyz.edu",
                password: "Driver@123",
                contactNumber: "9823456789",
                licenseNumber: "DL67890",
                location: { latitude: 28.5355, longitude: 77.391 },
                status: "active",
            },
        ]);

        await createUser("Ravi Kumar", "ravi.kumar@abc.edu", "Driver@123", "driver");
        await createUser(
            "Amit Sharma",
            "amit.sharma@xyz.edu",
            "Driver@123",
            "driver"
        );

        console.log("✅ Drivers added!");

        // 3️⃣ Create Routes
        const routes = await Route.insertMany([
            {
                institute: admin1._id,
                routeName: "Delhi Route 1",
                startPoint: {
                    name: "Rajiv Chowk",
                    latitude: 28.6328,
                    longitude: 77.2197,
                },
                endPoint: {
                    name: "Dwarka Sector 21",
                    latitude: 28.5562,
                    longitude: 77.0674,
                },
                stops: [
                    { name: "CP", latitude: 28.6328, longitude: 77.2197, stopOrder: 1 },
                    { name: "Janakpuri", latitude: 28.621, longitude: 77.0905, stopOrder: 2 },
                ],
                totalDistance: 25,
                estimatedDuration: "45 minutes",
            },
            {
                institute: admin2._id,
                routeName: "Noida Route 1",
                startPoint: {
                    name: "Sector 15 Metro",
                    latitude: 28.585,
                    longitude: 77.315,
                },
                endPoint: { name: "Sector 62", latitude: 28.628, longitude: 77.368 },
                stops: [
                    { name: "Sector 18", latitude: 28.57, longitude: 77.325, stopOrder: 1 },
                    { name: "Sector 37", latitude: 28.58, longitude: 77.34, stopOrder: 2 },
                ],
                totalDistance: 18,
                estimatedDuration: "35 minutes",
            },
        ]);

        console.log("✅ Routes added!");

        // 4️⃣ Create Buses
        const buses = await Bus.insertMany([
            {
                institute: admin1._id,
                busId: "BUS001",
                busNumberPlate: "DL01AB1234",
                assignedDriver: drivers[0]._id,
                assignedRoute: routes[0]._id,
                currentLocation: {
                    latitude: 28.7041,
                    longitude: 77.1025,
                    speed: 40,
                    lastUpdated: new Date(),
                },
                status: "active",
            },
            {
                institute: admin2._id,
                busId: "BUS002",
                busNumberPlate: "UP16XY5678",
                assignedDriver: drivers[1]._id,
                assignedRoute: routes[1]._id,
                currentLocation: {
                    latitude: 28.5355,
                    longitude: 77.391,
                    speed: 35,
                    lastUpdated: new Date(),
                },
                status: "active",
            },
        ]);

        console.log("✅ Buses added!");

        // 5️⃣ Create Students
        const students = await Student.insertMany([
            {
                institute: admin1._id,
                name: "Neha Gupta",
                enrollmentId: "STU001",
                enrollmentYear: 2022,
                email: "neha@abc.edu",
                password: "Student@123",
                contactNumber: "9991112233",
                address: "Sector 10, Delhi",
                busNumber: "BUS001",
                busPlateNumber: "DL01AB1234",
                assignedDriver: drivers[0]._id,
                assignedRoute: routes[0]._id,
                status: "active",
            },
            {
                institute: admin2._id,
                name: "Rahul Verma",
                enrollmentId: "STU002",
                enrollmentYear: 2023,
                email: "rahul@xyz.edu",
                password: "Student@123",
                contactNumber: "9992223344",
                address: "Sector 62, Noida",
                busNumber: "BUS002",
                busPlateNumber: "UP16XY5678",
                assignedDriver: drivers[1]._id,
                assignedRoute: routes[1]._id,
                status: "active",
            },
        ]);

        await createUser("Neha Gupta", "neha@abc.edu", "Student@123", "student");
        await createUser("Rahul Verma", "rahul@xyz.edu", "Student@123", "student");

        console.log("✅ Students added!");

        // 6️⃣ Create Bus Locations
        await BusLocation.insertMany([
            {
                bus: buses[0]._id,
                driver: drivers[0]._id,
                latitude: 28.7041,
                longitude: 77.1025,
                speed: 45,
                accuracy: 5,
                status: "moving",
                address: "Near CP, Delhi",
            },
            {
                bus: buses[1]._id,
                driver: drivers[1]._id,
                latitude: 28.5355,
                longitude: 77.391,
                speed: 38,
                accuracy: 5,
                status: "moving",
                address: "Sector 18, Noida",
            },
        ]);

        console.log("✅ Bus Locations added!");
        console.log("🎉 All data seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeding Error:", err);
        process.exit(1);
    }
};

seedData();
