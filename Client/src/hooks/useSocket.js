// src/hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export function useSocket({
  serverUrl,
  token,
  onConnect,
  onMessage,
  onBroadcast,
}) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    const socket = io(serverUrl, { auth: { token } });
    socketRef.current = socket;

    socket.on("connect", () => {
      onConnect && onConnect(socket);
    });

    socket.on("chat-receive", (msg) => {
      onMessage && onMessage(msg);
    });

    socket.on("chat-broadcast-receive", (payload) => {
      onBroadcast && onBroadcast(payload);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect error", err);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl, token]);

  const sendMessage = (roomName, text) => {
    if (!socketRef.current) return;
    socketRef.current.emit("chat-send", {
      token: localStorage.getItem("token"),
      roomName,
      text,
    });
  };

  const joinRoom = (roomName, roomType = "bus") => {
    if (!socketRef.current) return;
    socketRef.current.emit("chat-join", {
      token: localStorage.getItem("token"),
      roomName,
      roomType,
    });
  };

  const adminBroadcast = (target, text) => {
    if (!socketRef.current) return;
    socketRef.current.emit("admin-broadcast", {
      token: localStorage.getItem("token"),
      target,
      text,
    });
  };

  return { sendMessage, joinRoom, adminBroadcast, socket: socketRef.current };
}
