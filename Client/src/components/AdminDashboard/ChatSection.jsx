import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatSection() {
  const [messages, setMessages] = useState([
    { sender: "Admin", text: "Hello team, update me on Bus 101" },
    { sender: "Driver", text: "Bus 101 is on time." },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { sender: "You", text: input }]);
    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-4xl bg-transparent">
      <div className="flex flex-col bg-gray-50 rounded-2xl shadow-lg p-3 sm:p-4 min-h-[70vh]">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 mb-3">
          Team Chat
        </h2>

        <div className="flex-1 overflow-y-auto p-2 space-y-3 border rounded-xl bg-white">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-full px-3 py-2 rounded-2xl shadow-sm break-words ${
                msg.sender === "You"
                  ? "bg-yellow-100 self-end text-right ml-auto"
                  : "bg-gray-100 self-start text-left"
              }`}
            >
              <p className="text-sm sm:text-base">
                <span className="font-semibold">{msg.sender}:</span> {msg.text}
              </p>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="mt-3 flex gap-2 items-center">
          <input
            className="flex-1 border border-gray-300 rounded-2xl px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-md"
          >
            <FaPaperPlane /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
