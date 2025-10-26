import Bus from "../models/Bus.js";

export const getBuses = async (req, res) => {
    const buses = await Bus.find();
    res.json(buses);
};

export const addBus = async (req, res) => {
    try {
        const bus = new Bus(req.body);
        await bus.save();
        res.json(bus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateBus = async (req, res) => {
    try {
        const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(bus);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
