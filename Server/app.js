import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.js";
import passwordRoutes from "./routes/password.js";
import studentRoutes from "./routes/student.js";
import driverRoutes from "./routes/driver.js";
import busRoutes from "./routes/bus.js";
import routeRoutes from "./routes/route.js";
import adminRoutes from "./routes/admin.js";
import locationRoutes from "./routes/location.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/location", locationRoutes);

export default app;
