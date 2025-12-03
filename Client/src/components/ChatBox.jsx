// src/components/ChatBox.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ChatBox({ roomName, messages, onSend, user }) {
  const [text, setText] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow">
      <header className="border-b p-3">
        <div className="font-bold text-indigo-900">{roomName}</div>
        <div className="text-sm text-gray-500">Active</div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`max-w-xl ${
              m.senderId === user?.id
                ? "ml-auto text-right"
                : "mr-auto text-left"
            }`}
          >
            <div className="text-xs text-slate-500">{m.senderName}</div>

            <div
              className={`inline-block px-3 py-2 rounded-lg ${
                m.senderId === user?.id
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {m.text}
            </div>

            <div className="text-xs text-slate-400 mt-1">
              {new Date(m.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={send} className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
          className="flex-1 rounded border px-3 py-2"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
}
