// src/hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket({ serverUrl, token, onMessage }) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(serverUrl, {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("💛 Socket Connected");
      socket.emit("setup-rooms", { token });
    });

    // NEW EVENT NAME
    socket.on("receive-message", (msg) => {
      onMessage && onMessage(msg);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error", err);
    });

    return () => socket.disconnect();
  }, [serverUrl, token]);

  // NEW SEND EVENT
  const sendMessage = (roomName, text) => {
    if (!socketRef.current) return;
    socketRef.current.emit("send-message", { roomName, text });
  };

  return { sendMessage };
}
