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
    setMessages([...messages, { sender: "You", text: input }]);
    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-100 rounded-2xl shadow-lg p-4 w-full max-w-full">
      <h2 className="text-2xl font-bold mb-3 text-gray-800">Team Chat</h2>
      <div className="flex-1 overflow-y-auto p-2 space-y-2 border rounded-xl bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-full px-3 py-2 rounded-2xl shadow-sm break-words ${
              msg.sender === "You"
                ? "bg-yellow-100 self-end text-right"
                : "bg-gray-100 self-start text-left"
            }`}>
            <p className="text-sm">
              <span className="font-semibold">{msg.sender}:</span> {msg.text}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex mt-2 gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 rounded-2xl flex items-center gap-2 shadow-md transition text-sm"
          onClick={sendMessage}>
          <FaPaperPlane />
          Send
        </button>
      </div>
    </div>
  );
}
