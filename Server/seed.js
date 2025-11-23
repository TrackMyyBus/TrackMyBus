import mongoose from "mongoose";
import dotenv from "dotenv";

import Admin from "./models/Admin.js";
import Driver from "./models/Driver.js";
import Student from "./models/Student.js";
import Route from "./models/Route.js";
import Bus from "./models/Bus.js";
import BusLocation from "./models/BusLocation.js";
import User from "./models/User.js";

dotenv.config();

// Connect to DB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ DB Error:", err));

// Helper: create User if not exists
const createUser = async (name, email, password, role) => {
    const exists = await User.findOne({ email });
    if (exists) return exists;
    return await User.create({ name, email, password, role });
};

const seed = async () => {
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

        console.log("⏳ Seeding Started...");

        // ------------------- ADMINS -------------------
        const adminsData = [
            {
                _id: new mongoose.Types.ObjectId("691b322c88d435b0a2fa6f10"),
                instituteName: "Medicaps University",
                instituteCode: "MU001",
                email: "admin@medicaps.edu",
                password: "Admin@123",
                contactNumber: "9998887771",
                address: "AB Road, Indore",
                city: "Indore",
                state: "MP",
                notifications: [{ title: "System Initiated", message: "Admin created successfully" }],
            },
            {
                _id: new mongoose.Types.ObjectId("691b338dc42bfb7663b54669"),
                instituteName: "Acropolish Institute",
                instituteCode: "AC-101",
                email: "admin@acro.edu",
                password: "$2b$10$c1wUegxM6dxGVuGYQuS5wOjpYHDdPbVKA0iLIJmECtXq/LDJ9m.2q", // pre-hashed
                contactNumber: "07311111",
                address: "ByPass",
                city: "Indore",
                state: "Madhya Pradesh",
                notifications: [],
            },
            {
                _id: new mongoose.Types.ObjectId("691b4bd8812c070e0a5ee836"),
                instituteName: "Prestige Institute",
                instituteCode: "PI-01",
                email: "admin@pi.edu",
                password: "$2b$10$1R4dU4hvgsZxdAXYkVubiuwD3NYfLJ2mtLyNg81cmN35v6WGDMhr2", // pre-hashed
                contactNumber: "07312222",
                address: "SatyaSai",
                city: "Indore",
                state: "Madhya Pradesh",
                notifications: [],
            },
        ];

        const admins = [];
        for (const a of adminsData) {
            const admin = await Admin.create(a);
            await createUser(admin.instituteName, admin.email, a.password, "admin");
            admins.push(admin);
        }
        console.log("✅ Admins created");

        // ------------------- STUDENTS / DRIVERS / BUSES / ROUTES -------------------
        // Students count: 3,4,1
        // Buses count: 3,4,1
        const studentsCount = [3, 4, 1];
        const busesCount = [3, 4, 1];

        for (let i = 0; i < admins.length; i++) {
            const admin = admins[i];

            // Routes (1 per admin)
            const route = await Route.create({
                institute: admin._id,
                routeName: `${admin.instituteName} Main Route`,
                startPoint: { name: "Start", latitude: 22.7 + i * 0.01, longitude: 75.8 + i * 0.01 },
                endPoint: { name: "End", latitude: 22.8 + i * 0.01, longitude: 75.9 + i * 0.01 },
                stops: [
                    { name: "Stop1", latitude: 22.71 + i * 0.01, longitude: 75.81 + i * 0.01, stopOrder: 1 },
                    { name: "Stop2", latitude: 22.72 + i * 0.01, longitude: 75.82 + i * 0.01, stopOrder: 2 },
                ],
                totalDistance: 20 + i * 5,
                estimatedDuration: `${30 + i * 10} minutes`,
            });

            admin.routes.push(route._id);

            // Buses & Drivers
            const buses = [];
            const drivers = [];
            for (let j = 0; j < busesCount[i]; j++) {
                const bus = await Bus.create({
                    institute: admin._id,
                    busId: `${admin.instituteCode}-BUS-${j + 1}`,
                    busNumberPlate: `${admin.instituteCode}-PLATE-${j + 1}`,
                    status: "active",
                    assignedRoute: route._id,
                    currentLocation: {
                        latitude: 22.7 + j * 0.01,
                        longitude: 75.8 + j * 0.01,
                        speed: 30,
                        lastUpdated: new Date(),
                    },
                });
                buses.push(bus);

                const driver = await Driver.create({
                    institute: admin._id,
                    name: `Driver ${j + 1} - ${admin.instituteName}`,
                    driverId: `${admin.instituteCode}-DRV-${j + 1}`,
                    email: `driver${j + 1}.${admin.instituteCode.toLowerCase()}@edu.com`,
                    contactNumber: `99999${i}${j}000`,
                    assignedBus: bus._id,
                    assignedRoute: route._id,
                });
                drivers.push(driver);
                bus.assignedDriver = driver._id;
                await bus.save();

                await createUser(driver.name, driver.email, "Driver@123", "driver");

                // Bus Location
                await BusLocation.create({
                    bus: bus._id,
                    driver: driver._id,
                    latitude: bus.currentLocation.latitude,
                    longitude: bus.currentLocation.longitude,
                    speed: 30,
                    status: "moving",
                    address: "Near Route Start",
                });
            }

            // Students
            const students = [];
            for (let k = 0; k < studentsCount[i]; k++) {
                const assignedBus = buses[k % buses.length];
                const assignedDriver = drivers[k % drivers.length];

                const student = await Student.create({
                    institute: admin._id,
                    name: `Student ${k + 1} - ${admin.instituteName}`,
                    enrollmentId: `${admin.instituteCode}-STD-${k + 1}`,
                    enrollmentYear: 2025,
                    email: `student${k + 1}.${admin.instituteCode.toLowerCase()}@edu.com`,
                    contactNumber: `88888${i}${k}00`,
                    address: `Address ${k + 1}`,
                    busNumber: assignedBus.busId,
                    busPlateNumber: assignedBus.busNumberPlate,
                    assignedBus: assignedBus._id,
                    assignedDriver: assignedDriver._id,
                    assignedRoute: route._id,
                });
                students.push(student);
                await createUser(student.name, student.email, "Student@123", "student");
            }

            // Update Admin references
            admin.students = students.map((s) => s._id);
            admin.drivers = drivers.map((d) => d._id);
            admin.buses = buses.map((b) => b._id);
            await admin.save();
        }

        console.log("🎉 Seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seeder Error:", err);
        process.exit(1);
    }
};

seed();
