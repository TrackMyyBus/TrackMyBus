import express from "express";
import fetch from "node-fetch";

const router = express.Router();

// GET /api/geocode?place=Indore
router.get("/", async (req, res) => {
    const place = req.query.place;
    if (!place) return res.status(400).json({ error: "Place required" });

    try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;

        const response = await fetch(url, {
            headers: { "User-Agent": "TrackMyBus/1.0" }
        });

        const data = await response.json();
        if (!data.length) return res.json({ lat: 0, lon: 0 });

        res.json({
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
        });
    } catch (err) {
        console.log("Geocode error:", err);
        res.json({ lat: 0, lon: 0 });
    }
});

export default router;
