import React from "react";
import { notifications } from "@/lib/mock-data";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

export default function NotificationsSection() {
  return (
    <div className="bg-gray-100 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Notifications</h2>
      <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
        {notifications.admin.map((note) => (
          <li
            key={note.id}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-md transition hover:shadow-lg ${
              note.type === "alert" ? "bg-red-100" : "bg-green-100"
            }`}>
            <span className="mt-1 text-xl">
              {note.type === "alert" ? (
                <FaExclamationCircle className="text-red-500" />
              ) : (
                <FaCheckCircle className="text-green-500" />
              )}
            </span>
            <div>
              <p className="font-medium text-gray-700">{note.message}</p>
              <span className="text-xs text-gray-500">{note.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
