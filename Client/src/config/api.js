const TUNNEL_URL = import.meta.env.VITE_TUNNEL_URL; // Backend tunnel only

export const API_BASE_URL = TUNNEL_URL && TUNNEL_URL !== ""
    ? TUNNEL_URL                                    // use backend tunnel
    : "http://localhost:5000";                       // fallback local
