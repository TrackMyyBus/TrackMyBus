// src/components/ChatBox.jsx
import React, { useEffect, useRef, useState } from "react";

export default function ChatBox({ roomName, messages, onSend, user }) {
  const [text, setText] = useState("");
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex flex-col h-full">
      <header className="border-b p-3 flex items-center justify-between">
        <div>
          <div className="font-bold">{roomName}</div>
          <div className="text-sm text-slate-500">Active</div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m._id || `${m.senderId}-${m.createdAt}`}
            className={`max-w-xl ${
              m.senderId === user?._id
                ? "ml-auto text-right"
                : "mr-auto text-left"
            }`}
          >
            <div className="text-xs text-slate-500">
              {m.senderName || (m.senderName === "ADMIN" ? "ADMIN" : "System")}
            </div>
            <div
              className={`inline-block p-2 rounded ${
                m.senderId === user?._id
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-900"
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

      <form onSubmit={submit} className="p-3 border-t flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-sky-600 text-white"
        >
          Send
        </button>
      </form>
    </div>
  );
}
