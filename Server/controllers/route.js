import Route from "../models/Route.js";

export const getRoutes = async (req, res) => {
    const routes = await Route.find();
    res.json(routes);
};

export const addRoute = async (req, res) => {
    try {
        const route = new Route(req.body);
        await route.save();
        res.json(route);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const updateRoute = async (req, res) => {
    try {
        const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(route);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
