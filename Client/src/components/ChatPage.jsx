// src/components/ChatPage.jsx
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { useSocket } from "../hooks/useSocket";
import ChatBox from "./ChatBox";

const SERVER = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ChatPage() {
  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;

  const adminId = localStorage.getItem("adminId");

  // DRIVER & STUDENT BUS ID
  const driverBusId = localStorage.getItem("driverBusId");
  const studentBusId = localStorage.getItem("studentBusId");

  const busId = driverBusId || studentBusId || null;

  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const { sendMessage, joinRoom } = useSocket({
    serverUrl: SERVER,
    token,
    onConnect: () => console.log("Chat connected"),

    onMessage: (msg) => setMessages((prev) => [...prev, msg]),

    onBroadcast: (payload) =>
      setMessages((prev) => [
        ...prev,
        {
          _id: `b-${Date.now()}`,
          senderName: "ADMIN",
          text: payload.text,
          createdAt: payload.createdAt,
        },
      ]),
  });

  // ⭐ ROOMS BASED ON ROLE
  function getRooms() {
    if (!decoded) return [];
    const list = [];

    // ===============================
    // ADMIN ROOMS
    // ===============================
    if (decoded.role === "admin") {
      list.push(
        {
          roomName: `admin_${decoded.id}`,
          label: "Admin Group",
          roomType: "group",
        },
        {
          roomName: `students_${adminId}`,
          label: "Message All Students",
          roomType: "broadcast",
        },
        {
          roomName: `drivers_${adminId}`,
          label: "Message All Drivers",
          roomType: "broadcast",
        }
      );
    }

    // ===============================
    // DRIVER ROOMS
    // ===============================
    if (decoded.role === "driver") {
      list.push({
        roomName: `driver_admin_${decoded.id}`,
        label: "Chat With Admin",
        roomType: "direct",
      });

      if (busId) {
        list.push(
          {
            roomName: `bus_${busId}_${adminId}`,
            label: "Bus Group",
            roomType: "group",
          },
          {
            roomName: `bus_students_${busId}_${adminId}`,
            label: "Message Students",
            roomType: "group",
          }
        );
      }
    }

    // ===============================
    // STUDENT ROOMS
    // ===============================
    if (decoded.role === "student") {
      list.push({
        roomName: `student_admin_${decoded.id}`,
        label: "Chat With Admin",
        roomType: "direct",
      });

      if (busId) {
        list.push(
          {
            roomName: `bus_${busId}_${adminId}`,
            label: "Bus Group",
            roomType: "group",
          },
          {
            roomName: `bus_driver_${busId}_${adminId}`,
            label: "My Driver",
            roomType: "direct",
          }
        );
      }
    }

    return list;
  }

  async function loadMessages(roomName) {
    try {
      const res = await fetch(`${SERVER}/api/chat/history/${roomName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const msgs = res.ok ? await res.json() : [];
      setMessages(msgs);
    } catch {
      setMessages([]);
    }
  }

  const handleRoomSelect = (room) => {
    const name = room.roomName;
    setActiveRoom(name);
    joinRoom(name, room.roomType);
    loadMessages(name);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-80 border-r p-4 bg-white">
        <h3 className="text-lg font-semibold mb-3 text-indigo-900">Chats</h3>

        <div className="space-y-2">
          {getRooms().map((r) => (
            <button
              key={r.roomName}
              onClick={() => handleRoomSelect(r)}
              className={`w-full text-left p-2 rounded ${
                activeRoom === r.roomName
                  ? "bg-yellow-200"
                  : "hover:bg-gray-100"
              }`}
            >
              <div className="font-medium text-indigo-900">{r.label}</div>
              <div className="text-sm text-slate-500">{r.roomType}</div>
            </button>
          ))}
        </div>
      </aside>

      <main className="flex-1 p-4 flex flex-col">
        {activeRoom ? (
          <ChatBox
            roomName={activeRoom}
            user={decoded}
            messages={messages}
            onSend={(text) => sendMessage(activeRoom, text)}
          />
        ) : (
          <div className="m-auto text-slate-500">
            Select a chat to start messaging
          </div>
        )}
      </main>
    </div>
  );
}
