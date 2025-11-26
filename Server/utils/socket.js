// (Optional abstraction if you want to use a socket helper)
import { Server } from "socket.io";

export let io;

export const configureSockets = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("message", (msg) => {
      io.emit("message", msg);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
