import React from "react";
import { notifications } from "@/lib/mock-data";
import { FaExclamationCircle, FaCheckCircle } from "react-icons/fa";

export default function NotificationsSection() {
  return (
    <div className="w-full">
      <div className="bg-gray-50 p-4 rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-900 mb-4">
          Notifications
        </h2>

        <ul className="space-y-4 max-h-[60vh] overflow-y-auto">
          {notifications?.admin?.map((note) => (
            <li
              key={note.id}
              className={`flex items-start gap-3 p-4 rounded-xl transition hover:shadow-md ${
                note.type === "alert" ? "bg-red-50" : "bg-green-50"
              }`}
            >
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
    </div>
  );
}
