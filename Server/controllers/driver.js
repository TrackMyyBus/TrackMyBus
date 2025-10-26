import Driver from "../models/Driver.js";

export const getDrivers = async (req, res) => {
    const drivers = await Driver.find();
    res.json(drivers);
};

export const addDriver = async (req, res) => {
    try {
        const driver = new Driver(req.body);
        await driver.save();
        res.json(driver);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(driver);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
