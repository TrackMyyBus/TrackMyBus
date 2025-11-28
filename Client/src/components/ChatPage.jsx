// src/components/ChatPage.jsx
import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useSocket } from "../hooks/useSocket";
import ChatBox from "./ChatBox";

const SERVER = process.env.REACT_APP_API_URL || "http://localhost:5000";

export default function ChatPage() {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null; // expects { _id, name, role, busId }
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);

  const { sendMessage, joinRoom } = useSocket({
    serverUrl: SERVER,
    token,
    onConnect: async () => {
      // load rooms (via REST)
      const res = await fetch(`${SERVER}/api/chat/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
        // auto open user's bus room if any
        if (user?.busId) {
          const b = `bus_${user.busId}`;
          setActiveRoom(b);
          joinRoom(b, "bus");
          await loadMessages(b);
        }
      }
    },
    onMessage: (msg) => {
      // if message belongs to active room, append
      setMessages((prev) => [...prev, msg]);
    },
    onBroadcast: (payload) => {
      // show broadcast inside active chat as system message
      setMessages((prev) => [
        ...prev,
        {
          _id: `b-${Date.now()}`,
          senderName: "ADMIN",
          text: payload.text,
          createdAt: payload.createdAt,
        },
      ]);
    },
  });

  async function loadMessages(roomName) {
    try {
      const res = await fetch(`${SERVER}/api/chat/history/${roomName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const msgs = await res.json();
        setMessages(msgs);
      } else {
        setMessages([]);
      }
    } catch (err) {
      setMessages([]);
    }
  }

  const handleRoomSelect = (r) => {
    const name = r.roomName || r;
    setActiveRoom(name);
    joinRoom(name, r.roomType || "direct");
    loadMessages(name);
  };

  const handleSend = (text) => {
    if (!activeRoom) return;
    sendMessage(activeRoom, text);
  };

  return (
    <div className="flex h-screen">
      <aside className="w-80 border-r p-4">
        <h3 className="text-lg font-semibold mb-3">Chats</h3>
        <div className="space-y-2">
          {rooms.map((r) => (
            <button
              key={r._id || r.roomName}
              onClick={() => handleRoomSelect(r)}
              className={`w-full text-left p-2 rounded ${
                activeRoom === (r.roomName || r)
                  ? "bg-slate-100"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="font-medium">{r.roomName}</div>
              <div className="text-sm text-slate-500">{r.roomType}</div>
            </button>
          ))}
          <button
            onClick={() => handleRoomSelect(`bus_${user?.busId}`)}
            className="mt-3 p-2 w-full rounded border"
          >
            Open My Bus Group
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 flex flex-col">
        {activeRoom ? (
          <ChatBox
            roomName={activeRoom}
            messages={messages}
            onSend={handleSend}
            user={user}
          />
        ) : (
          <div className="m-auto text-center text-slate-500">
            Select a chat to start messaging
          </div>
        )}
      </main>
    </div>
  );
}
