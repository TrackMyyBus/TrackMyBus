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
    <div className="flex flex-col mt-4 md:mt-0 ml-16 md:ml-0 min-h-[80vh] w-[80%] max-w-3xl bg-gray-100 rounded-2xl shadow-lg p-2 sm:p-4">
      <h2 className="text-3xl font-extrabold text-indigo-900 sm:text-2xl mb-2 sm:mb-3">
        Team Chat
      </h2>

      {/* Chat messages container */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2 border rounded-xl bg-white">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-full px-2 sm:px-3 py-1 sm:py-2 rounded-2xl shadow-sm break-words ${
              msg.sender === "You"
                ? "bg-yellow-100 self-end text-right"
                : "bg-gray-100 self-start text-left"
            }`}>
            <p className="text-sm sm:text-base">
              <span className="font-semibold">{msg.sender}:</span> {msg.text}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex mt-2 gap-2 sticky bottom-0 bg-gray-100 pt-2 pb-2">
        <input
          className="flex-1 border border-gray-300 rounded-2xl px-2 sm:px-3 py-1 sm:py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 sm:px-4 rounded-2xl flex items-center gap-2 shadow-md transition text-sm sm:text-base"
          onClick={sendMessage}>
          <FaPaperPlane />
          Send
        </button>
      </div>
    </div>
  );
}
