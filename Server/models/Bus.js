import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
    busId: { type: String, required: true },
    driverName: { type: String, required: true },
    capacity: { type: Number, required: true },
});

export default mongoose.model("Bus", busSchema);
