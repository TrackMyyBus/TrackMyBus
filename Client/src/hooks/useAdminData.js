// useAdminData.js

import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

export default function useAdminData(adminId, token) {
    const [loading, setLoading] = useState(true);

    const [overview, setOverview] = useState(null);
    const [students, setStudents] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);

    // ⭐ FIXED — dynamic baseURL for DevTunnel or localhost
    const api = axios.create({
        baseURL: `${API_BASE_URL}/api`,
        headers: { Authorization: `Bearer ${token}` },
    });

    const fetchOverview = async () => {
        const { data } = await api.get(`/admin/overview/${adminId}`);
        setOverview(data);
    };

    const fetchStudents = async () => {
        const { data } = await api.get(`/admin/students/${adminId}`);
        setStudents(data.students || []);
    };

    const fetchDrivers = async () => {
        const { data } = await api.get(`/admin/drivers/${adminId}`);
        setDrivers(data.drivers || []);
    };

    const fetchBuses = async () => {
        const { data } = await api.get(`/admin/buses/${adminId}`);
        setBuses(data.buses || []);
    };

    const fetchRoutes = async () => {
        const { data } = await api.get(`/admin/routes/${adminId}`);
        setRoutes(data.routes || []);
    };

    const refreshAll = async () => {
        setLoading(true);
        await Promise.all([
            fetchOverview(),
            fetchStudents(),
            fetchDrivers(),
            fetchBuses(),
            fetchRoutes(),
        ]);
        setLoading(false);
    };

    useEffect(() => {
        if (adminId && token) refreshAll();
    }, [adminId, token]);

    return {
        loading,
        overview,
        students,
        drivers,
        buses,
        routes,
        refreshAll
    };
}
