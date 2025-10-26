import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import passwordRoutes from "./routes/password.js";
import studentRoutes from "./routes/student.js";
import driverRoutes from "./routes/driver.js";
import busRoutes from "./routes/bus.js";
import routeRoutes from "./routes/route.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("TrackMyBus running successfully"));
app.use("/api/auth", authRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/admin", adminRoutes);

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
