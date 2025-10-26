import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    stops: [{ type: String }],
});

export default mongoose.model("Route", routeSchema);
